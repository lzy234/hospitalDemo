import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import MessageList from './MessageList'
import InputArea from './InputArea'
import SuggestedQuestions from './SuggestedQuestions'
import { ChatMessage } from '../types'
import { apiService } from '../services/api'

const ChatContainer = styled.div<{ isFullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: ${props => props.isFullScreen ? 'calc(100vh - 80px)' : '500px'};
  max-height: ${props => props.isFullScreen ? 'calc(100vh - 80px)' : 'calc(100vh - 200px)'};
  width: 100%;
  padding: ${props => props.isFullScreen ? '20px 40px' : '0'};
  overflow: hidden;
  
  /* 白色背景适配 */
  background: ${props => props.isFullScreen ? 'transparent' : 'white'};
  border-radius: ${props => props.isFullScreen ? '0' : '12px'};
  box-shadow: ${props => props.isFullScreen ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  
  @media (max-width: 768px) {
    padding: ${props => props.isFullScreen ? '20px' : '0'};
    height: ${props => props.isFullScreen ? 'calc(100vh - 80px)' : '600px'};
    max-height: none;
  }
`

const ChatHeader = styled.div<{ isFullScreen: boolean }>`
  padding: ${props => props.isFullScreen ? '0 0 24px 0' : '16px 20px'};
  border-bottom: ${props => props.isFullScreen ? '1px solid #e9ecef' : '1px solid #eee'};
  background: ${props => props.isFullScreen ? 'transparent' : '#f8f9fa'};
  border-radius: ${props => props.isFullScreen ? '0' : '12px 12px 0 0'};
  flex-shrink: 0;
  margin-bottom: ${props => props.isFullScreen ? '20px' : '0'};
`

const ChatTitle = styled.h3<{ isFullScreen: boolean }>`
  margin: 0;
  color: ${props => props.isFullScreen ? '#333' : '#333'};
  font-size: ${props => props.isFullScreen ? '24px' : '18px'};
  font-weight: 600;
  text-align: ${props => props.isFullScreen ? 'center' : 'left'};
`

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`

const WelcomeMessage = styled.div<{ isFullScreen?: boolean }>`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

interface ChatInterfaceProps {
  suggestedQuestions: string[]
  videoAnalysisResult: string
  isVideoAnalyzed: boolean
  isFullScreen?: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  suggestedQuestions, 
  videoAnalysisResult, 
  isVideoAnalyzed,
  isFullScreen = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 当视频解析完成时，自动添加解析结果消息
  useEffect(() => {
    if (isVideoAnalyzed && videoAnalysisResult && messages.length === 0) {
      const analysisMessage: ChatMessage = {
        id: `analysis-${Date.now()}`,
        type: 'assistant',
        content: videoAnalysisResult,
        timestamp: new Date()
      }
      setMessages([analysisMessage])
    }
  }, [isVideoAnalyzed, videoAnalysisResult, messages.length])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // 创建AI回复消息
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: '',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      await apiService.chatStream(content.trim(), (data) => {
        if (data.type === 'message_delta' && data.content) {
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.type === 'assistant') {
              lastMessage.content += data.content
            }
            return newMessages
          })
        } else if (data.type === 'error') {
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.type === 'assistant') {
              lastMessage.content = `抱歉，发生了错误：${data.error}`
            }
            return newMessages
          })
        }
      })
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.type === 'assistant') {
          lastMessage.content = `抱歉，连接失败：${error}`
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  const renderContent = () => {
    if (!isVideoAnalyzed) {
      return (
        <WelcomeMessage isFullScreen={isFullScreen}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
          <div>请先上传手术视频进行解析</div>
          <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
            上传完成后即可开始与AI对话
          </div>
        </WelcomeMessage>
      )
    }

    return (
      <>
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          isFullScreen={isFullScreen}
          suggestedQuestions={suggestedQuestions}
          onQuestionClick={handleQuestionClick}
          disabled={isLoading}
          ref={chatContainerRef}
        />
        <InputArea 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          isFullScreen={isFullScreen}
        />
      </>
    )
  }

  return (
    <ChatContainer isFullScreen={isFullScreen}>
      <ChatBody>
        {renderContent()}
      </ChatBody>
    </ChatContainer>
  )
}

export default ChatInterface 