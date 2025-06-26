import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import MessageList from './MessageList'
import InputArea from './InputArea'
import SuggestedQuestions from './SuggestedQuestions'
import { ChatMessage } from '../types'
import { apiService } from '../services/api'

const ChatContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
  overflow: hidden;
`

const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
`

const ChatTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const WelcomeMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
`

interface ChatInterfaceProps {
  suggestedQuestions: string[]
  videoAnalysisResult: string
  isVideoAnalyzed: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  suggestedQuestions, 
  videoAnalysisResult, 
  isVideoAnalyzed 
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
        <WelcomeMessage>
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
          ref={chatContainerRef}
        />
        <InputArea 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
        <SuggestedQuestions 
          questions={suggestedQuestions}
          onQuestionClick={handleQuestionClick}
          disabled={isLoading}
        />
      </>
    )
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>AI 智能问答</ChatTitle>
      </ChatHeader>
      <ChatBody>
        {renderContent()}
      </ChatBody>
    </ChatContainer>
  )
}

export default ChatInterface 