@echo off
chcp 65001 >nul

echo 🏥 医学手术复盘AI助手 Demo 启动脚本
echo ==================================

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Docker 未安装
    echo 请先安装 Docker: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM 检查docker-compose是否安装
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Docker Compose 未安装
    echo 请先安装 Docker Compose: https://docs.docker.com/compose/install/
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

REM 停止已有的容器
echo 🛑 停止已有容器...
docker-compose down

REM 构建并启动服务
echo 🚀 构建并启动服务...
docker-compose up -d --build

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 🔍 检查服务状态...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行正常
) else (
    echo ❌ 后端服务启动失败
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行正常
) else (
    echo ❌ 前端服务启动失败
)

echo ==================================
echo 🎉 启动完成!
echo.
echo 访问地址:
echo   前端应用: http://localhost:3000
echo   后端API:  http://localhost:5000
echo.
echo 停止服务: docker-compose down
echo 查看日志: docker-compose logs -f
echo ==================================
pause 