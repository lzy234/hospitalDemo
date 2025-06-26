# 医学手术复盘AI Agent - 产品需求文档

## 现有例程
现在有一个coze例程如下：

"""
This example is about how to use the streaming interface to start a chat request
and handle chat events
"""

import os
# Our official coze sdk for Python [cozepy](https://github.com/coze-dev/coze-py)
from cozepy import COZE_CN_BASE_URL

# Get an access_token through personal access token or oauth.
coze_api_token = 'pat_BabxcQ99cMx3ziABhpRshfsvXBP0HXgke1wVigzquPehrOshql7Fr61kXhex1S4b'
# The default access is api.coze.com, but if you need to access api.coze.cn,
# please use base_url to configure the api endpoint to access
coze_api_base = COZE_CN_BASE_URL

from cozepy import Coze, TokenAuth, Message, ChatStatus, MessageContentType, ChatEventType  # noqa

# Init the Coze client through the access_token.
coze = Coze(auth=TokenAuth(token=coze_api_token), base_url=coze_api_base)

# Create a bot instance in Coze, copy the last number from the web link as the bot's ID.
bot_id = '7519906707460898851'
# The user id identifies the identity of a user. Developers can use a custom business ID
# or a random string.
user_id = '123456789'

# Call the coze.chat.stream method to create a chat. The create method is a streaming
# chat and will return a Chat Iterator. Developers should iterate the iterator to get
# chat event and handle them.
for event in coze.chat.stream(
    bot_id=bot_id,
    user_id=user_id,
    additional_messages=[
        Message.build_user_question_text("Tell a 500-word story."),
    ],
):
    if event.event == ChatEventType.CONVERSATION_MESSAGE_DELTA:
        print(event.message.content, end="", flush=True)

    if event.event == ChatEventType.CONVERSATION_CHAT_COMPLETED:
        print()
        print("token usage:", event.chat.usage.token_count)

## 项目目标
需要根据这个例程做一个医学手术复盘的AI Agent，理想的最终功能是，能够上传一个手术视频，agent就把视频解析为文本，然后再根据文本，医生能够与AI对话。

## Demo阶段需求
而现在只需要做一个demo。
最小可行功能有：
1、能对接例程，并把例程的配置单独放到配置文件中，以便修改；
2、一个LLM对话框，能够渲染Markdown格式；
3、在对话框的底部，能够显示3个建议用户可以发送给AI的问题，点击后就会发送到对话框，问题也放到配置文件中以便修改；
4、视频上传功能：不需要真的去实现上传功能，只需要做一个假的视频上传成功的显示；
5、视频解析功能：不需要实现，只需要在视频上传成功后，在前端UI界面直接显示给定的文本就好，这段文本也放到配置文件中以便修改；最后不要忘了显示解析成功，当然也是假的。

总结：后端不需要实现，只需要对接好例程就行；前端需要实现一个简单的web页面

---

## 我的理解和分析

### 技术架构
- **后端**: Python + Coze SDK，主要负责AI对话接口
- **前端**: Web页面（技术栈待定），负责用户交互界面
- **配置**: 配置文件管理各种参数和文本内容

### 核心功能分解

#### 1. 配置文件设计
需要抽取的配置项：
- Coze API配置：`coze_api_token`, `coze_api_base`, `bot_id`, `user_id`
- 建议问题列表：3个预设问题
- 模拟视频解析结果文本
- 可能还需要其他UI文本配置

#### 2. 前端界面布局
```
┌─────────────────────────────────────┐
│           页面标题                    │
├─────────────────────────────────────┤
│           视频上传区域                │
│        (模拟上传 + 解析状态)          │
├─────────────────────────────────────┤
│                                     │
│           对话消息区域                │
│        (支持Markdown渲染)            │
│                                     │
├─────────────────────────────────────┤
│           输入框                      │
├─────────────────────────────────────┤
│     [建议问题1] [建议问题2] [建议问题3]  │
└─────────────────────────────────────┘
```

#### 3. 交互流程
1. 用户访问页面
2. 用户点击上传视频（模拟）→ 显示上传成功
3. 系统显示解析中状态 → 显示预设的解析结果文本
4. 用户可以通过输入框或点击建议问题与AI对话
5. AI回复支持流式输出和Markdown渲染

### 待确认的问题

1. **前端技术栈**: 希望使用什么前端框架？(React/Vue/原生HTML等)
2. **配置文件格式**: 使用JSON、YAML还是其他格式？
3. **部署方式**: 是否需要考虑部署相关的配置？
4. **用户界面风格**: 是否有特定的UI设计要求或医疗行业的界面规范？
5. **建议问题内容**: 3个建议问题的具体内容是什么？应该针对手术复盘场景设计吗？
6. **模拟解析文本**: 预设的视频解析结果文本应该是什么内容？需要多长？
7. **错误处理**: 是否需要考虑API调用失败等错误情况的处理？

请确认我的理解是否正确，并回答上述问题，这样我就可以开始实现了。