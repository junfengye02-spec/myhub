#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
"$SCRIPT_DIR/scripts/yven-site-control.zsh" start --open

echo
read -r "?按回车关闭窗口..."
