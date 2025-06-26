#!/bin/bash

echo "🏥 医学手术复盘AI助手 Demo 启动脚本"
echo "=================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查docker compose是否安装
#if ! command -v docker compose &> /dev/null; then
#    echo "❌ 错误: Docker Compose 未安装"
#    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
#    exit 1
#fi

# 检查配置文件是否存在
if [ ! -f "config/app_config.json" ]; then
    echo "❌ 错误: 配置文件不存在"
    echo "请确保 config/app_config.json 文件存在并正确配置"
    exit 1
fi

echo "✅ 环境检查通过"

# 停止已有的容器
echo "🛑 停止已有容器..."
docker compose down

# 构建并启动服务
echo "🚀 构建并启动服务..."
docker compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ 后端服务运行正常"
else
    echo "❌ 后端服务启动失败"
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端服务运行正常"
else
    echo "❌ 前端服务启动失败"
fi

echo "=================================="
echo "🎉 启动完成!"
echo ""
echo "访问地址:"
echo "  前端应用: http://localhost:3000"
echo "  后端API:  http://localhost:5000"
echo ""
echo "停止服务: docker compose down"
echo "查看日志: docker compose logs -f"
echo "==================================" 
