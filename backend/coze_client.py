from cozepy import Coze, TokenAuth, Message, ChatEventType
import json

class CozeClient:
    def __init__(self, config):
        """
        初始化Coze客户端
        
        Args:
            config (dict): Coze配置信息，包含api_token, api_base, bot_id, user_id
        """
        self.config = config
        self.coze = Coze(
            auth=TokenAuth(token=config['api_token']),
            base_url=config['api_base']
        )
        self.bot_id = config['bot_id']
        self.user_id = config['user_id']
    
    def chat_stream(self, message):
        """
        流式聊天接口
        
        Args:
            message (str): 用户消息
            
        Yields:
            dict: 聊天事件数据
        """
        try:
            # 调用Coze流式聊天接口
            for event in self.coze.chat.stream(
                bot_id=self.bot_id,
                user_id=self.user_id,
                additional_messages=[
                    Message.build_user_question_text(message),
                ],
            ):
                # 处理消息增量事件
                if event.event == ChatEventType.CONVERSATION_MESSAGE_DELTA:
                    yield {
                        'type': 'message_delta',
                        'content': event.message.content,
                        'message_id': getattr(event.message, 'id', None)
                    }
                
                # 处理聊天完成事件
                elif event.event == ChatEventType.CONVERSATION_CHAT_COMPLETED:
                    yield {
                        'type': 'chat_completed',
                        'token_usage': {
                            'token_count': event.chat.usage.token_count if event.chat.usage else 0
                        },
                        'chat_id': getattr(event.chat, 'id', None)
                    }
                
                # 处理其他事件类型（可根据需要扩展）
                else:
                    yield {
                        'type': 'other_event',
                        'event_type': event.event.value if hasattr(event.event, 'value') else str(event.event),
                        'data': str(event)
                    }
                    
        except Exception as e:
            # 错误处理
            yield {
                'type': 'error',
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    def chat_single(self, message):
        """
        单次聊天接口（非流式）
        
        Args:
            message (str): 用户消息
            
        Returns:
            dict: 聊天结果
        """
        try:
            # 这里可以实现非流式聊天，如果需要的话
            # 目前主要使用流式接口
            pass
        except Exception as e:
            return {
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    def test_connection(self):
        """
        测试Coze连接
        
        Returns:
            bool: 连接是否成功
        """
        try:
            # 发送一个简单的测试消息
            test_message = "Hello"
            for event in self.coze.chat.stream(
                bot_id=self.bot_id,
                user_id=self.user_id,
                additional_messages=[
                    Message.build_user_question_text(test_message),
                ],
            ):
                # 如果能收到任何事件，说明连接成功
                return True
        except Exception as e:
            print(f"Coze连接测试失败: {e}")
            return False 