#!/bin/zsh

set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

PROJECT_DIR="/Users/jf/Desktop/Myself"
NGINX_BIN="/usr/local/nginx/sbin/nginx"
NGINX_DIR="/Users/jf/Documents/Codex/2026-05-07/cloudflare-0000238-xyz-nginx-apsmac-0000238"
NGINX_CONF="$NGINX_DIR/nginx-0000238-full.conf"
NGINX_ERROR_LOG="$NGINX_DIR/error.log"
SITE_URL="https://yven.0000238.xyz/"

on_error() {
  local exit_code=$?
  echo
  echo "启动失败，请看上面的报错信息。"
  read -r "?按回车关闭窗口..."
  exit "$exit_code"
}

trap on_error ERR

echo "==> 进入项目目录"
cd "$PROJECT_DIR"

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "==> 安装依赖"
  npm install
fi

echo "==> 构建个人主页"
npm run build

echo "==> 校验 Nginx 配置"
"$NGINX_BIN" -t -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"

if [ -f "$NGINX_DIR/nginx.pid" ] && kill -0 "$(cat "$NGINX_DIR/nginx.pid")" 2>/dev/null; then
  echo "==> 重载 Nginx"
  "$NGINX_BIN" -s reload -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
else
  echo "==> 启动 Nginx"
  "$NGINX_BIN" -c "$NGINX_CONF" -g "error_log $NGINX_ERROR_LOG;"
fi

echo "==> 打开个人主页"
open "$SITE_URL"

echo
echo "个人主页已经启动并打开：$SITE_URL"
