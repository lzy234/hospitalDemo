# --- 1. 构建阶段 ---
# 使用 Node.js 镜像来构建 React 应用
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件和目录到工作目录
COPY . .

# 构建应用
RUN npm run build

# --- 2. 生产阶段 ---
# 使用 Nginx 作为基础镜像来提供静态文件服务
FROM nginx:alpine

# 从构建阶段复制构建好的静态文件到 Nginx 的 web 根目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"] 