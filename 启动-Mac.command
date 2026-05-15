#!/bin/bash
# 小魔方大师 - Mac 一键启动脚本
# 双击即可在浏览器打开 http://localhost:8080

# 切到脚本所在目录
cd "$(dirname "$0")"

PORT=8080

echo "========================================"
echo "  小魔方大师 (Magic Cube Master)"
echo "  正在启动本地服务器..."
echo "========================================"
echo ""
echo "  访问地址: http://localhost:$PORT"
echo ""
echo "  关闭网站请直接关闭这个终端窗口。"
echo "========================================"
echo ""

# 2 秒后自动打开浏览器（给服务器一点启动时间）
(sleep 2 && open "http://localhost:$PORT") &

# 优先 python3，回退 python
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server $PORT
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer $PORT
else
  echo "❌ 未检测到 Python，请先安装 Python 3。"
  echo "   macOS 通常自带，若没有可访问 https://www.python.org/downloads/"
  read -p "按回车键退出..."
fi
