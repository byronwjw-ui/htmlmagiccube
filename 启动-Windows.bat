@echo off
chcp 65001 >nul
title 小魔方大师 - 本地服务器
cd /d "%~dp0"

set PORT=8080

echo ========================================
echo   小魔方大师 (Magic Cube Master)
echo   正在启动本地服务器...
echo ========================================
echo.
echo   访问地址: http://localhost:%PORT%
echo.
echo   关闭网站请直接关闭这个黑色窗口。
echo ========================================
echo.

rem 2 秒后自动打开浏览器
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:%PORT%"

rem 优先 python，回退 py launcher
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server %PORT%
  goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server %PORT%
  goto :end
)

echo.
echo ❌ 未检测到 Python，请先安装 Python 3。
echo    下载地址: https://www.python.org/downloads/
echo    安装时记得勾选 "Add Python to PATH"
echo.
pause

:end
