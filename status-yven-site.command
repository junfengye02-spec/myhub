#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
"$SCRIPT_DIR/scripts/yven-site-control.zsh" status

echo
read -r "?按回车关闭窗口..."
