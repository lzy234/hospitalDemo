# 医学手术复盘AI助手 Demo

基于 Coze SDK 的医学手术视频分析与智能问答系统演示版本。

## 项目概述

本项目是一个医学手术复盘AI助手的Demo，主要功能包括：

- 📹 模拟手术视频上传
- 🔍 模拟视频内容解析
- 💬 基于 Coze API 的智能问答
- 📝 支持 Markdown 格式的对话展示
- 💡 预设建议问题快捷输入

## 技术栈

### 后端
- **Python 3.11** - 核心语言
- **Flask** - Web 框架
- **Coze SDK** - AI 对话接口
- **Gunicorn** - WSGI 服务器

### 前端
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Styled Components** - CSS-in-JS
- **React Markdown** - Markdown 渲染

### 部署
- **Docker** - 容器化
- **Nginx** - 前端静态文件服务
- **Docker Compose** - 服务编排

## 项目结构

```
hospitalDemo/
├── backend/                    # 后端服务
│   ├── app.py                 # Flask 主应用
│   ├── coze_client.py         # Coze SDK 封装
│   ├── requirements.txt       # Python 依赖
│   └── Dockerfile             # 后端容器配置
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── services/          # API 服务
│   │   ├── styles/           # 样式文件
│   │   ├── types/            # TypeScript 类型
│   │   ├── App.tsx           # 主应用组件
│   │   └── main.tsx          # 应用入口
│   ├── public/               # 静态资源
│   ├── Dockerfile            # 前端容器配置
│   ├── nginx.conf            # Nginx 配置
│   └── package.json          # 前端依赖
├── config/
│   └── app_config.json       # 应用配置文件
├── docker-compose.yml        # Docker 编排配置
├── prd.md                    # 产品需求文档
├── todo.md                   # 开发任务清单
└── README.md                 # 项目说明文档
```

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 18+ (如需本地开发)
- Python 3.11+ (如需本地开发)

### 配置设置

1. 修改配置文件 `config/app_config.json`：

```json
{
  "coze": {
    "api_token": "your_coze_api_token",
    "api_base": "https://api.coze.cn/v3",
    "bot_id": "your_bot_id",
    "user_id": "your_user_id"
  },
  "ui": {
    "title": "医学手术复盘AI助手",
    "suggested_questions": [
      "你的建议问题1",
      "你的建议问题2", 
      "你的建议问题3"
    ],
    "mock_video_analysis_result": "你的模拟解析结果文本..."
  }
}
```

### Docker 部署（推荐）

1. 克隆项目：
```bash
git clone <repository-url>
cd hospitalDemo
```

2. 启动服务：
```bash
docker-compose up -d
```

3. 访问应用：
- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

4. 停止服务：
```bash
docker-compose down
```

### 本地开发

#### 后端开发

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 启动后端服务：
```bash
python app.py
```

#### 前端开发

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## 主要功能

### 1. 视频上传模拟
- 支持拖拽上传界面
- 模拟上传进度显示
- 上传完成状态提示

### 2. 视频解析模拟
- 模拟解析进度显示
- 可配置的解析结果文本
- 解析完成状态提示

### 3. AI 智能问答
- 基于 Coze SDK 的流式对话
- Markdown 格式渲染支持
- 实时消息流显示

### 4. 建议问题
- 可配置的快捷问题
- 点击直接发送到对话框
- 响应式按钮布局

## API 接口

### 后端 API

- `GET /api/config` - 获取前端配置
- `POST /api/upload/mock` - 模拟视频上传
- `POST /api/analysis/mock` - 模拟视频解析
- `POST /api/chat/stream` - 流式 AI 对话
- `GET /health` - 健康检查

## 配置说明

### Coze 配置
- `api_token`: Coze API 访问令牌
- `api_base`: API 基础 URL
- `bot_id`: 机器人 ID
- `user_id`: 用户 ID

### UI 配置
- `title`: 应用标题
- `subtitle`: 应用副标题
- `suggested_questions`: 建议问题列表
- `mock_video_analysis_result`: 模拟解析结果

## 开发说明

### 目录说明
- `/backend` - Flask 后端应用
- `/frontend` - React 前端应用
- `/config` - 配置文件
- `/docs` - 文档文件

### 开发注意事项
1. 这是一个演示版本，视频上传和解析功能都是模拟的
2. 所有配置都可通过 JSON 文件修改
3. 前后端通过 REST API 通信
4. 支持流式 AI 对话响应

## 许可证

本项目仅供学习和演示使用。

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 这是一个演示版本，不适用于生产环境。在生产使用前需要添加适当的安全措施、错误处理和性能优化。