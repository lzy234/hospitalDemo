import React, { useState, useRef, KeyboardEvent } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background: white;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`

const TextArea = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  transition: border-color 0.2s;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`

const SendButton = styled.button<{ disabled: boolean }>`
  padding: 12px 16px;
  background: ${props => props.disabled 
    ? '#6c757d' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 60px;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const CharCounter = styled.div<{ isNearLimit: boolean }>`
  font-size: 12px;
  color: ${props => props.isNearLimit ? '#dc3545' : '#6c757d'};
  margin-left: 8px;
  min-width: 50px;
  text-align: right;
`

interface InputAreaProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  maxLength?: number
}

const InputArea: React.FC<InputAreaProps> = ({ 
  onSendMessage, 
  disabled = false,
  maxLength = 1000
}) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      // 重置文本框高度
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px'
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      setMessage(value)
      
      // 自动调整高度
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }
  }

  const canSend = message.trim().length > 0 && !disabled
  const isNearLimit = message.length > maxLength * 0.8

  return (
    <InputContainer>
      <TextArea
        ref={textareaRef}
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "AI正在回复中..." : "输入您的问题...（按Enter发送，Shift+Enter换行）"}
        disabled={disabled}
        maxLength={maxLength}
      />
      <CharCounter isNearLimit={isNearLimit}>
        {message.length}/{maxLength}
      </CharCounter>
      <SendButton
        onClick={handleSend}
        disabled={!canSend}
      >
        {disabled ? '⏳' : '📤'}
        发送
      </SendButton>
    </InputContainer>
  )
}

export default InputArea 