import React, { forwardRef, useEffect } from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { ChatMessage } from '../types'

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#f8f9fa'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  word-wrap: break-word;

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    ${props => props.isUser ? 'right: 16px;' : 'left: 16px;'}
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 0 8px;
    border-color: ${props => props.isUser 
      ? '#667eea transparent transparent transparent' 
      : '#f8f9fa transparent transparent transparent'};
  }
`

const MessageContent = styled.div`
  line-height: 1.5;
  
  /* Markdown 样式 */
  h1, h2, h3, h4, h5, h6 {
    margin: 16px 0 8px 0;
    font-weight: 600;
  }
  
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
  h3 { font-size: 1.1rem; }
  
  p {
    margin: 8px 0;
  }
  
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 4px 0;
  }
  
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
  
  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.1);
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;
  }
  
  blockquote {
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    padding-left: 12px;
    margin: 8px 0;
    font-style: italic;
  }
`

const MessageTime = styled.div<{ isUser: boolean }>`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 16px;
  align-self: flex-start;
  max-width: 80%;
  
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    animation: pulse 1.5s infinite;
  }
`

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ messages, isLoading }, ref) => {
  useEffect(() => {
    // 自动滚动到底部
    if (ref && 'current' in ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [messages, isLoading, ref])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <MessageContainer ref={ref}>
      {messages.map((message) => (
        <div key={message.id}>
          <MessageBubble isUser={message.type === 'user'}>
            <MessageContent>
              {message.type === 'user' ? (
                message.content
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </MessageContent>
            <MessageTime isUser={message.type === 'user'}>
              {formatTime(message.timestamp)}
            </MessageTime>
          </MessageBubble>
        </div>
      ))}
      {isLoading && (
        <LoadingIndicator>
          AI正在思考中...
        </LoadingIndicator>
      )}
    </MessageContainer>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList 