#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

readonly DEPLOY_ROOT="/opt/yven-site"
readonly UPLOAD_ROOT="/home/deploy/uploads"
readonly RELEASE_ENV="${DEPLOY_ROOT}/.release.env"
readonly COMPOSE_FILE="${DEPLOY_ROOT}/docker-compose.yml"
readonly COMPOSE_PROJECT="yven-site"
readonly APP_CONTAINER="yven-site-web"
readonly PUBLIC_HEALTH_URL="https://yven.0000238.xyz/healthz"
readonly LOCK_FILE="/var/lock/yven-site-deploy.lock"
readonly IMAGE_RETENTION_COUNT=2
readonly UPLOAD_RETENTION_MINUTES=60

die() {
  echo "yven-site-deploy: $*" >&2
  exit 1
}

usage() {
  die "usage: yven-site-deploy <image-archive> <image-tag> <git-revision>"
}

[[ $# -eq 3 ]] || usage

archive_input=$1
image_tag=$2
git_revision=$3

[[ $image_tag =~ ^yven-site:git-[0-9a-f]{40}$ ]] || die "invalid image tag: ${image_tag}"
[[ $git_revision =~ ^[0-9a-f]{40}$ ]] || die "invalid Git revision: ${git_revision}"

archive_path=$(readlink -f -- "$archive_input")
case "$archive_path" in
  "${UPLOAD_ROOT}"/yven-site-*.tar.gz) ;;
  *) die "archive must be inside ${UPLOAD_ROOT}" ;;
esac

[[ -f $archive_path && ! -L $archive_path ]] || die "image archive does not exist: ${archive_path}"
[[ -f $COMPOSE_FILE ]] || die "missing production Compose file: ${COMPOSE_FILE}"

exec 9>"$LOCK_FILE"
flock -n 9 || die "another Yven site deployment is already running"

compose() {
  docker compose \
    --env-file "$RELEASE_ENV" \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    "$@"
}

image_is_referenced() {
  local candidate=$1
  [[ -n $(docker ps -a --filter "ancestor=${candidate}" --format '{{.ID}}') ]]
}

prune_release_images() {
  local active_image=$1
  local retained_count=1
  local created_at
  local candidate

  while IFS=$'\t' read -r created_at candidate; do
    [[ -n $candidate ]] || continue
    [[ $candidate == "$active_image" ]] && continue
    image_is_referenced "$candidate" && continue

    if (( retained_count < IMAGE_RETENTION_COUNT )); then
      retained_count=$((retained_count + 1))
      continue
    fi

    echo "Removing expired release image ${candidate} (created ${created_at})"
    docker image rm "$candidate" > /dev/null || \
      echo "Warning: could not remove expired release image ${candidate}" >&2
  done < <(
    docker image ls --format '{{.CreatedAt}}\t{{.Repository}}:{{.Tag}}' 'yven-site:git-*' |
      sort -r
  )
}

prune_stale_uploads() {
  find "$UPLOAD_ROOT" \
    -maxdepth 1 \
    -type f \
    -name 'yven-site-*.tar.gz' \
    ! -path "$archive_path" \
    -mmin "+${UPLOAD_RETENTION_MINUTES}" \
    -print \
    -delete
}

write_release_image() {
  local target_image=$1
  local temporary_file
  temporary_file=$(mktemp "${DEPLOY_ROOT}/.release.env.XXXXXX")
  printf 'YVEN_SITE_IMAGE=%s\n' "$target_image" > "$temporary_file"
  chmod 600 "$temporary_file"
  mv -f "$temporary_file" "$RELEASE_ENV"
}

wait_for_application() {
  local health_status

  for _ in $(seq 1 36); do
    health_status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$APP_CONTAINER" 2>/dev/null || true)
    if [[ $health_status == healthy ]] && \
       docker exec "$APP_CONTAINER" wget -q -O /dev/null http://127.0.0.1:8080/healthz; then
      return 0
    fi
    sleep 5
  done

  compose ps >&2 || true
  compose logs --tail=100 web >&2 || true
  return 1
}

wait_for_public_endpoint() {
  for _ in $(seq 1 12); do
    if curl --fail --silent --show-error --max-time 15 "$PUBLIC_HEALTH_URL" > /dev/null; then
      return 0
    fi
    sleep 5
  done
  return 1
}

activate_image() {
  compose up -d --no-deps --no-build --force-recreate web
}

rollback_or_fail() {
  local reason=$1

  if [[ $previous_image =~ ^yven-site:git-[0-9a-f]{40}$ ]]; then
    echo "${reason}; rolling back to ${previous_image}" >&2
    write_release_image "$previous_image"
    activate_image || true
    wait_for_application || die "rollback container also failed its health checks"
    die "${reason}; previous image restored"
  fi

  die "${reason}; no previous image exists for rollback"
}

cd "$DEPLOY_ROOT"

previous_image=$(docker inspect --format '{{.Config.Image}}' "$APP_CONTAINER" 2>/dev/null || true)
prune_stale_uploads
prune_release_images "$previous_image"

echo "Loading ${image_tag}"
gzip -t "$archive_path"
docker load --input "$archive_path" > /dev/null
docker image inspect "$image_tag" > /dev/null

echo "Activating ${image_tag}"
write_release_image "$image_tag"
activate_image || rollback_or_fail "new container could not be started"
wait_for_application || rollback_or_fail "new container failed its health checks"
wait_for_public_endpoint || rollback_or_fail "public endpoint verification failed"

prune_release_images "$image_tag"
rm -f -- "$archive_path"
printf '%s\t%s\t%s\t%s\n' \
  "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  "$git_revision" \
  "$image_tag" \
  "${previous_image:-none}" \
  >> "${DEPLOY_ROOT}/deploy-history.tsv"

echo "Deployment completed: ${image_tag}"
