#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTROL="$ROOT_DIR/scripts/yven-site-control.zsh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_contains() {
  local haystack="$1"
  local needle="$2"
  [[ "$haystack" == *"$needle"* ]] || fail "expected output to contain: $needle"
}

assert_file_mode() {
  local file="$1"
  [[ -x "$file" ]] || fail "$file is not executable"
}

mkdir -p "$TMP_DIR/project/dist" "$TMP_DIR/nginx"
cat > "$TMP_DIR/project/package.json" <<'JSON'
{"scripts":{"build":"astro build"}}
JSON
cat > "$TMP_DIR/nginx/nginx.conf" <<'CONF'
worker_processes 1;
events { worker_connections 16; }
http { server { listen 8080; } }
CONF

assert_file_mode "$CONTROL"

start_output="$(
  PROJECT_DIR="$TMP_DIR/project" \
  NGINX_DIR="$TMP_DIR/nginx" \
  NGINX_CONF="$TMP_DIR/nginx/nginx.conf" \
  NGINX_BIN="/mock/nginx" \
  SITE_URL="https://example.test/" \
  "$CONTROL" start --dry-run
)"

assert_contains "$start_output" "DRY RUN"
assert_contains "$start_output" "npm install"
assert_contains "$start_output" "npm run build"
assert_contains "$start_output" "/mock/nginx -t"
assert_contains "$start_output" "/mock/nginx -c"

printf '123456\n' > "$TMP_DIR/nginx/nginx.pid"
stop_output="$(
  PROJECT_DIR="$TMP_DIR/project" \
  NGINX_DIR="$TMP_DIR/nginx" \
  NGINX_CONF="$TMP_DIR/nginx/nginx.conf" \
  NGINX_BIN="/mock/nginx" \
  SITE_URL="https://example.test/" \
  "$CONTROL" stop --dry-run
)"

assert_contains "$stop_output" "DRY RUN"
assert_contains "$stop_output" "/mock/nginx -s quit"
assert_contains "$stop_output" "不会强杀未知进程"

status_output="$(
  PROJECT_DIR="$TMP_DIR/project" \
  NGINX_DIR="$TMP_DIR/nginx" \
  NGINX_CONF="$TMP_DIR/nginx/nginx.conf" \
  NGINX_BIN="/mock/nginx" \
  SITE_URL="https://example.test/" \
  "$CONTROL" status --dry-run
)"

assert_contains "$status_output" "项目目录"
assert_contains "$status_output" "Nginx 配置"
assert_contains "$status_output" "线上地址"

echo "PASS: yven-site-control"
