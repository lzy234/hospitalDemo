#!/bin/bash

echo "🏥 医学手术复盘AI助手 Demo - 本地开发模式启动"
echo "=========================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查Python是否安装
# 尝试使用 python3, 如果不存在则尝试 python
PYTHON_CMD="python3"
if ! command -v $PYTHON_CMD &> /dev/null; then
    PYTHON_CMD="python"
    if ! command -v $PYTHON_CMD &> /dev/null; then
        echo "❌ 错误: Python 未安装"
        echo "请先安装 Python: https://www.python.org/"
        exit 1
    fi
fi

# 检查配置文件是否存在
if [ ! -f "config/app_config.json" ]; then
    echo "❌ 错误: 配置文件不存在"
    echo "请确保 config/app_config.json 文件存在并正确配置"
    exit 1
fi

echo "✅ 环境检查通过"

# 创建或清空日志文件
> backend-dev.log
> frontend-dev.log

# 启动后端服务
echo "🚀 启动后端服务..."
(
  cd backend || exit
  echo "正在安装后端依赖..."
  pip install -r requirements.txt
  echo "后端依赖安装完成，启动服务..."
  $PYTHON_CMD app.py
) > backend-dev.log 2>&1 &
BACKEND_PID=$!
echo "后端服务已在后台启动，PID: $BACKEND_PID, 日志文件: backend-dev.log"

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 启动前端服务
echo "🚀 启动前端服务..."
(
  cd frontend || exit
  echo "正在安装前端依赖..."
  npm install
  echo "前端依赖安装完成，启动开发服务器..."
  npm run dev
) > frontend-dev.log 2>&1 &
FRONTEND_PID=$!
echo "前端服务已在后台启动，PID: $FRONTEND_PID, 日志文件: frontend-dev.log"


echo "=========================================="
echo "🎉 启动完成!"
echo ""
echo "服务已在后台启动:"
echo "  后端服务: http://localhost:5000"
echo "  前端服务: http://localhost:3000"
echo ""
echo "查看实时日志:"
echo "  后端: tail -f backend-dev.log"
echo "  前端: tail -f frontend-dev.log"
echo ""
echo "停止服务:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "==========================================" 