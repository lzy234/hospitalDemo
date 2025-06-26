import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div<{ isFullScreen?: boolean }>`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: ${props => props.isFullScreen ? 'rgba(255, 255, 255, 0.95)' : 'white'};
  border-radius: ${props => props.isFullScreen ? '8px' : '0 0 12px 12px'};
  border-top: 1px solid #eee;
  backdrop-filter: ${props => props.isFullScreen ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.isFullScreen ? '0 -1px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  position: ${props => props.isFullScreen ? 'sticky' : 'relative'};
  bottom: ${props => props.isFullScreen ? '16px' : 'auto'};
  margin: ${props => props.isFullScreen ? '8px 0 0 0' : '0'};
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: ${props => props.isFullScreen ? '8px' : 'auto'};
    margin: ${props => props.isFullScreen ? '8px 0 0 0' : '0'};
  }
`

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 36px;
  max-height: 80px;
  padding: 8px 50px 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  resize: none;
  font-size: 13px;
  line-height: 1.4;
  outline: none;
  transition: all 0.2s ease;
  background: white;
  color: #333;
  font-family: inherit;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }

  &:disabled {
    background: #f8f9fa;
    border-color: #dee2e6;
    color: #6c757d;
    cursor: not-allowed;
  }
`

const CharCount = styled.div`
  position: absolute;
  right: 12px;
  bottom: 6px;
  font-size: 10px;
  color: #999;
  pointer-events: none;
`

const SendButton = styled.button<{ disabled: boolean }>`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: ${props => props.disabled 
    ? '#e9ecef' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.disabled ? '#adb5bd' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: ${props => props.disabled ? 'none' : '0 1px 4px rgba(102, 126, 234, 0.3)'};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 2px 8px rgba(102, 126, 234, 0.4)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
  }
`

interface InputAreaProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  isFullScreen?: boolean
}

const InputArea: React.FC<InputAreaProps> = ({ 
  onSendMessage, 
  disabled = false,
  isFullScreen = false 
}) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 80)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [input])

  return (
    <InputContainer isFullScreen={isFullScreen}>
      <InputWrapper>
        <TextArea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
          disabled={disabled}
        />
        <CharCount>{input.length}/1000</CharCount>
      </InputWrapper>
      <SendButton
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
      >
        ➤
      </SendButton>
    </InputContainer>
  )
}

export default InputArea 