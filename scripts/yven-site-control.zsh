#!/bin/zsh

set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEFAULT_PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PROJECT_DIR="${PROJECT_DIR:-$DEFAULT_PROJECT_DIR}"
NGINX_BIN="${NGINX_BIN:-/usr/local/nginx/sbin/nginx}"
NGINX_DIR="${NGINX_DIR:-/Users/jf/Documents/Codex/2026-05-07/cloudflare-0000238-xyz-nginx-apsmac-0000238}"
NGINX_CONF="${NGINX_CONF:-$NGINX_DIR/nginx-0000238-full.conf}"
NGINX_ERROR_LOG="${NGINX_ERROR_LOG:-$NGINX_DIR/error.log}"
NGINX_PID_FILE="${NGINX_PID_FILE:-$NGINX_DIR/nginx.pid}"
SITE_HOST="${SITE_HOST:-yven.0000238.xyz}"
SITE_URL="${SITE_URL:-https://$SITE_HOST/}"
DEV_PORT="${DEV_PORT:-5173}"

COMMAND="${1:-status}"
shift || true

DRY_RUN=0
OPEN_AFTER_START=0

while (( $# > 0 )); do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --open)
      OPEN_AFTER_START=1
      ;;
    --no-open)
      OPEN_AFTER_START=0
      ;;
    -h|--help)
      COMMAND="help"
      ;;
    *)
      echo "未知参数: $1" >&2
      exit 2
      ;;
  esac
  shift
done

log() {
  echo "==> $*"
}

warn() {
  echo "!! $*" >&2
}

run_cmd() {
  if (( DRY_RUN )); then
    echo "DRY RUN: $*"
  else
    "$@"
  fi
}

need_file() {
  [[ -e "$1" ]] || {
    echo "找不到: $1" >&2
    exit 1
  }
}

pid_alive() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

nginx_pid() {
  [[ -f "$NGINX_PID_FILE" ]] && tr -d '[:space:]' < "$NGINX_PID_FILE"
}

nginx_running() {
  local pid
  pid="$(nginx_pid)"
  [[ -n "$pid" ]] && pid_alive "$pid"
}

port_listener() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
}

ensure_dependencies() {
  need_file "$PROJECT_DIR/package.json"
  command -v npm >/dev/null 2>&1 || {
    echo "找不到 npm，请先安装 Node.js / npm。" >&2
    exit 1
  }

  if [[ ! -d "$PROJECT_DIR/node_modules" ]]; then
    log "缺少 node_modules，安装依赖"
    (cd "$PROJECT_DIR" && run_cmd npm install)
  else
    log "依赖已存在"
  fi
}

build_site() {
  log "构建个人主页"
  (cd "$PROJECT_DIR" && run_cmd npm run build)
}

ensure_nginx_available() {
  need_file "$NGINX_CONF"
  if [[ ! -x "$NGINX_BIN" && "$NGINX_BIN" != /mock/* ]]; then
    echo "Nginx 不可执行: $NGINX_BIN" >&2
    exit 1
  fi
}

validate_nginx() {
  log "校验 Nginx 配置"
  run_cmd "$NGINX_BIN" -t -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
}

ensure_port_80_safe() {
  if (( DRY_RUN )); then
    echo "DRY RUN: check port 80"
    return
  fi

  local listeners
  listeners="$(port_listener 80)"
  if [[ -z "$listeners" ]]; then
    return
  fi

  if nginx_running; then
    return
  fi

  warn "80 端口已经被其它进程占用，无法安全启动这份 Nginx："
  echo "$listeners" >&2
  exit 1
}

start_nginx() {
  if nginx_running; then
    log "Nginx 已在运行，重载配置"
    run_cmd "$NGINX_BIN" -s reload -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
  else
    ensure_port_80_safe
    log "启动 Nginx"
    run_cmd "$NGINX_BIN" -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
  fi
}

check_local_site() {
  if ! command -v curl >/dev/null 2>&1; then
    warn "找不到 curl，跳过 HTTP 检测"
    return
  fi

  log "检测本地 Nginx 是否能服务 $SITE_HOST"
  if (( DRY_RUN )); then
    echo "DRY RUN: curl -I -H Host:$SITE_HOST http://127.0.0.1/"
    return
  fi

  curl -fsSI -H "Host: $SITE_HOST" "http://127.0.0.1/" >/dev/null
}

open_site() {
  if (( ! OPEN_AFTER_START )); then
    return 0
  fi
  if (( DRY_RUN )); then
    echo "DRY RUN: open $SITE_URL"
  else
    open "$SITE_URL"
  fi
}

stop_nginx() {
  local pid
  pid="$(nginx_pid)"
  if [[ -z "$pid" || ! -f "$NGINX_PID_FILE" ]]; then
    log "没有找到这份 Nginx 的 pid 文件，跳过"
    echo "不会强杀未知进程"
    return
  fi

  if (( DRY_RUN )); then
    log "停止这份 Nginx pid=$pid"
    run_cmd "$NGINX_BIN" -s quit -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
    echo "不会强杀未知进程"
    return
  fi

  if ! pid_alive "$pid"; then
    log "pid 文件存在，但进程 $pid 已不在运行"
    echo "不会强杀未知进程"
    return
  fi

  log "停止这份 Nginx pid=$pid"
  run_cmd "$NGINX_BIN" -s quit -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
  echo "不会强杀未知进程"
}

stop_dev_server_if_owned() {
  local listeners
  listeners="$(port_listener "$DEV_PORT")"
  [[ -n "$listeners" ]] || {
    log "$DEV_PORT 端口没有 dev server"
    return
  }

  local pids pid cwd
  pids=("${(@f)$(lsof -tiTCP:"$DEV_PORT" -sTCP:LISTEN 2>/dev/null || true)}")
  for pid in "${pids[@]}"; do
    [[ -n "$pid" ]] || continue
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1)"
    if [[ "$cwd" == "$PROJECT_DIR" ]]; then
      log "停止本项目 dev server pid=$pid"
      run_cmd kill "$pid"
    else
      warn "$DEV_PORT 端口由其它目录进程占用，跳过 pid=$pid cwd=${cwd:-unknown}"
    fi
  done
}

print_status() {
  echo "项目目录: $PROJECT_DIR"
  echo "Nginx 配置: $NGINX_CONF"
  echo "线上地址: $SITE_URL"
  echo

  if nginx_running; then
    echo "Nginx: running pid=$(nginx_pid)"
  else
    echo "Nginx: stopped"
  fi

  echo
  echo "80 端口:"
  port_listener 80 || true

  echo
  echo "$DEV_PORT 端口:"
  port_listener "$DEV_PORT" || true

  if (( DRY_RUN )); then
    echo
    echo "DRY RUN: status 只展示配置和当前检测点"
  fi
}

start_all() {
  ensure_dependencies
  build_site
  ensure_nginx_available
  validate_nginx
  start_nginx
  check_local_site
  open_site
  echo
  echo "个人主页已启动：$SITE_URL"
}

stop_all() {
  stop_nginx
  stop_dev_server_if_owned
  echo
  echo "个人主页相关服务已停止。"
}

case "$COMMAND" in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  status)
    print_status
    ;;
  help)
    cat <<EOF
用法:
  scripts/yven-site-control.zsh start [--open] [--dry-run]
  scripts/yven-site-control.zsh stop [--dry-run]
  scripts/yven-site-control.zsh status [--dry-run]

环境变量可覆盖:
  PROJECT_DIR NGINX_BIN NGINX_DIR NGINX_CONF SITE_HOST SITE_URL DEV_PORT
EOF
    ;;
  *)
    echo "未知命令: $COMMAND" >&2
    exit 2
    ;;
esac
