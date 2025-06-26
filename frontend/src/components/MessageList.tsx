import React, { forwardRef, useEffect } from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { ChatMessage } from '../types'

const MessageContainer = styled.div<{ isFullScreen?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.isFullScreen ? '0' : '20px'};
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  /* 白色背景下的滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`

const MessageBubble = styled.div<{ isUser: boolean; isFullScreen?: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => {
    if (props.isUser) {
      // 用户消息保持渐变色
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    } else {
      // AI消息改为浅灰色背景
      return '#f8f9fa'
    }
  }};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  word-wrap: break-word;
  border: ${props => props.isUser ? 'none' : '1px solid #e9ecef'};

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    ${props => props.isUser ? 'right: 16px;' : 'left: 16px;'}
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 0 8px;
    border-color: ${props => {
      if (props.isUser) {
        return '#667eea transparent transparent transparent'
      } else {
        return '#f8f9fa transparent transparent transparent'
      }
    }};
  }
`

const MessageContent = styled.div<{ isFullScreen?: boolean }>`
  line-height: 1.5;
  
  /* Markdown 样式 */
  h1, h2, h3, h4, h5, h6 {
    margin: 16px 0 8px 0;
    font-weight: 600;
    color: inherit;
  }
  
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
  h3 { font-size: 1.1rem; }
  
  p {
    margin: 8px 0;
    color: inherit;
  }
  
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 4px 0;
    color: inherit;
  }
  
  strong {
    font-weight: 600;
    color: inherit;
  }
  
  em {
    font-style: italic;
    color: inherit;
  }
  
  code {
    background: ${props => props.isFullScreen ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: inherit;
  }
  
  pre {
    background: ${props => props.isFullScreen ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;
  }
  
  blockquote {
    border-left: 4px solid ${props => props.isFullScreen ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)'};
    padding-left: 12px;
    margin: 8px 0;
    font-style: italic;
    color: inherit;
  }
`

const MessageTime = styled.div<{ isUser: boolean; isFullScreen?: boolean }>`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
  color: inherit;
`

const LoadingIndicator = styled.div<{ isFullScreen?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 16px;
  align-self: flex-start;
  max-width: 80%;
  color: #666;
  border: 1px solid #e9ecef;
  
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #666;
    animation: pulse 1.5s infinite;
  }
`

const SuggestedQuestionsContainer = styled.div`
  align-self: stretch;
  margin: 8px 0;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`

const QuestionsTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-align: center;
`

const QuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }
`

const QuestionButton = styled.button<{ disabled: boolean }>`
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 13px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.4;
  font-family: inherit;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  isFullScreen?: boolean
  suggestedQuestions?: string[]
  onQuestionClick?: (question: string) => void
  disabled?: boolean
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ 
  messages, 
  isLoading, 
  isFullScreen = false,
  suggestedQuestions = [],
  onQuestionClick,
  disabled = false
}, ref) => {
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

  const renderSuggestedQuestions = () => {
    if (!suggestedQuestions || suggestedQuestions.length === 0 || !onQuestionClick) {
      return null
    }

    return (
      <SuggestedQuestionsContainer>
        <QuestionsTitle>💡 建议问题</QuestionsTitle>
        <QuestionsGrid>
          {suggestedQuestions.map((question, index) => (
            <QuestionButton
              key={index}
              onClick={() => onQuestionClick(question)}
              disabled={disabled}
            >
              {question}
            </QuestionButton>
          ))}
        </QuestionsGrid>
      </SuggestedQuestionsContainer>
    )
  }

  return (
    <MessageContainer ref={ref} isFullScreen={isFullScreen}>
      {messages.map((message) => (
        <div key={message.id}>
          <MessageBubble isUser={message.type === 'user'} isFullScreen={isFullScreen}>
            <MessageContent isFullScreen={isFullScreen}>
              {message.type === 'user' ? (
                message.content
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </MessageContent>
            <MessageTime isUser={message.type === 'user'} isFullScreen={isFullScreen}>
              {formatTime(message.timestamp)}
            </MessageTime>
          </MessageBubble>
        </div>
      ))}
      {isLoading && (
        <LoadingIndicator isFullScreen={isFullScreen}>
          AI正在思考中...
        </LoadingIndicator>
      )}
      {!isLoading && renderSuggestedQuestions()}
    </MessageContainer>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList 