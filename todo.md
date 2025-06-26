# 医学手术复盘AI Agent Demo - 实现TODO清单

## 项目概览
- **后端**: Python Flask + Coze SDK
- **前端**: React + TypeScript
- **配置**: JSON配置文件
- **部署**: Docker容器化部署

## 实现步骤

### 阶段1: 项目初始化和结构搭建

#### 1.1 创建项目目录结构
```
hospitalDemo/
├── backend/
│   ├── app.py                 # Flask主应用
│   ├── coze_client.py         # Coze SDK封装
│   ├── requirements.txt       # Python依赖
│   └── config.json           # 后端配置文件
├── frontend/
│   ├── src/
│   │   ├── components/        # React组件
│   │   ├── services/          # API服务
│   │   ├── styles/           # 样式文件
│   │   └── App.tsx           # 主应用组件
│   ├── public/
│   └── package.json          # 前端依赖
├── config/
│   └── app_config.json       # 应用配置文件
├── docker-compose.yml        # Docker部署配置
└── README.md                 # 项目文档
```

#### 1.2 初始化前端React项目
- [ ] 使用create-react-app创建TypeScript项目
- [ ] 安装必要依赖（axios, react-markdown, styled-components等）
- [ ] 配置基础项目结构

#### 1.3 初始化后端Python项目
- [ ] 创建Flask应用基础结构
- [ ] 安装cozepy SDK和其他依赖
- [ ] 配置CORS支持前端调用

### 阶段2: 配置文件设计和实现

#### 2.1 设计JSON配置文件结构
- [ ] 创建`config/app_config.json`，包含以下配置项：
  ```json
  {
    "coze": {
      "api_token": "pat_xxx",
      "api_base": "https://api.coze.cn/v3",
      "bot_id": "7519906707460898851",
      "user_id": "123456789"
    },
    "ui": {
      "title": "医学手术复盘AI助手",
      "suggested_questions": [
        "问题1占位符",
        "问题2占位符", 
        "问题3占位符"
      ],
      "mock_video_analysis_result": "这里是模拟的视频解析结果文本占位符..."
    },
    "app": {
      "backend_port": 5000,
      "frontend_port": 3000
    }
  }
  ```

#### 2.2 实现配置加载模块
- [ ] 后端创建配置加载函数
- [ ] 前端创建配置获取API接口

### 阶段3: 后端API开发

#### 3.1 封装Coze SDK客户端
- [ ] 创建`coze_client.py`模块
- [ ] 实现Coze客户端初始化（从配置文件读取参数）
- [ ] 实现流式聊天接口封装

#### 3.2 创建Flask API接口
- [ ] `/api/config` - 获取前端配置信息
- [ ] `/api/chat/stream` - 流式聊天接口（Server-Sent Events）
- [ ] `/api/upload/mock` - 模拟视频上传接口
- [ ] `/api/analysis/mock` - 模拟视频解析接口

#### 3.3 实现流式响应
- [ ] 实现SSE（Server-Sent Events）流式数据传输
- [ ] 处理Coze SDK的流式事件并转发给前端

### 阶段4: 前端React应用开发

#### 4.1 创建基础组件
- [ ] `Header` - 页面标题组件
- [ ] `VideoUpload` - 视频上传模拟组件
- [ ] `ChatInterface` - 聊天界面主组件
- [ ] `MessageList` - 消息列表组件
- [ ] `MessageItem` - 单条消息组件（支持Markdown）
- [ ] `InputArea` - 输入框组件
- [ ] `SuggestedQuestions` - 建议问题组件

#### 4.2 实现视频上传模拟流程
- [ ] 文件选择界面（拖拽上传区域）
- [ ] 上传进度条动画
- [ ] 上传成功状态显示
- [ ] 解析进度条动画
- [ ] 解析结果文本显示

#### 4.3 实现聊天界面功能
- [ ] 消息列表滚动和布局
- [ ] Markdown渲染支持
- [ ] 流式消息接收和显示
- [ ] 输入框和发送功能
- [ ] 建议问题点击发送

#### 4.4 实现API服务调用
- [ ] 创建API服务模块
- [ ] 实现SSE流式数据接收
- [ ] 实现配置获取接口调用
- [ ] 实现模拟上传和解析接口调用

#### 4.5 样式设计和UI实现
- [ ] 整体页面布局（使用CSS Grid/Flexbox）
- [ ] 响应式设计
- [ ] 医疗主题的配色方案
- [ ] 组件样式和交互效果
- [ ] 加载动画和状态提示

### 阶段5: 功能集成和联调

#### 5.1 前后端接口联调
- [ ] 测试配置获取接口
- [ ] 测试流式聊天接口
- [ ] 测试模拟上传和解析接口
- [ ] 验证数据流转正确性

#### 5.2 完整流程测试
- [ ] 测试页面加载和配置读取
- [ ] 测试视频上传模拟流程
- [ ] 测试AI聊天完整流程
- [ ] 测试建议问题功能
- [ ] 测试Markdown渲染效果

### 阶段6: 部署配置

#### 6.1 Docker化
- [ ] 创建前端Dockerfile（nginx容器）
- [ ] 创建后端Dockerfile（python容器）
- [ ] 创建docker-compose.yml配置
- [ ] 配置容器间网络通信

#### 6.2 简化部署脚本
- [ ] 创建一键启动脚本
- [ ] 添加环境检查和依赖安装
- [ ] 创建停止和清理脚本

#### 6.3 文档完善
- [ ] 更新README.md使用说明
- [ ] 添加配置文件说明文档
- [ ] 添加部署指南

## 开发优先级

### 高优先级（核心功能）
1. 配置文件设计和加载 ✓
2. 后端Coze SDK集成 ✓
3. 前端聊天界面 ✓
4. 流式API接口 ✓

### 中优先级（重要功能）
1. 视频上传模拟 ✓
2. 建议问题功能 ✓
3. Markdown渲染 ✓
4. 基础样式设计 ✓

### 低优先级（优化功能）
1. 高级样式和动画效果
2. 响应式设计优化
3. Docker部署配置

## 技术栈确认

### 后端
- **框架**: Flask
- **AI SDK**: cozepy
- **其他**: flask-cors, python-dotenv

### 前端  
- **框架**: React 18 + TypeScript
- **样式**: CSS3 + styled-components
- **HTTP客户端**: axios
- **Markdown渲染**: react-markdown
- **构建工具**: Vite（替代CRA以提升开发体验）

### 部署
- **容器化**: Docker + docker-compose
- **前端服务**: nginx
- **后端服务**: gunicorn + Flask

---

**注意事项**:
1. 所有配置项都要可通过JSON文件修改
2. 视频上传和解析功能完全是模拟的，不需要真实实现
3. 专注于Demo演示效果，暂不考虑生产环境的安全性和稳定性
4. 保持代码结构清晰，便于后续扩展和修改
