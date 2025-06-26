@echo off
chcp 65001 >nul

echo 🏥 医学手术复盘AI助手 Demo - 本地开发模式启动
echo ==========================================

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Python 未安装
    echo 请先安装 Python: https://www.python.org/
    pause
    exit /b 1
)

REM 检查配置文件是否存在
if not exist "config\app_config.json" (
    echo ❌ 错误: 配置文件不存在
    echo 请确保 config\app_config.json 文件存在并正确配置
    pause
    exit /b 1
)

echo ✅ 环境检查通过

REM 启动后端服务
echo 🚀 启动后端服务...
cd backend
start "后端服务" cmd /c "pip install -r requirements.txt && python app.py"
cd ..

REM 等待后端启动
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak >nul

REM 启动前端服务
echo 🚀 启动前端服务...
cd frontend
start "前端服务" cmd /c "npm install && npm run dev"
cd ..

echo ==========================================
echo 🎉 启动完成!
echo.
echo 服务将在新窗口中启动:
echo   后端服务: http://localhost:5000
echo   前端服务: http://localhost:3000
echo.
echo 等待几分钟让服务完全启动，然后访问前端地址
echo ==========================================
pause 