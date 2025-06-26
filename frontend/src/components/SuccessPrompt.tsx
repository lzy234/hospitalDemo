import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
`

const Overlay = styled.div<{ isVisible: boolean; isExiting: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.3s ease-in-out;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
`

const PromptCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out 0.2s both;
`

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.6s ease-out 0.4s both;
`

const Title = styled.h2`
  color: #c00;
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  animation: ${fadeIn} 0.6s ease-out 0.6s both;
`

const Message = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.5;
  animation: ${fadeIn} 0.6s ease-out 0.8s both;
`

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #c00;
  font-size: 14px;
  animation: ${fadeIn} 0.6s ease-out 1s both;
`

const CountdownNumber = styled.span`
  background: #c00;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
`

const SkipButton = styled.button`
  background: transparent;
  border: 1px solid #c00;
  color: #c00;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s;
  animation: ${fadeIn} 0.6s ease-out 1.2s both;

  &:hover {
    background: #c00;
    color: white;
  }
`

interface SuccessPromptProps {
  isVisible: boolean
  onComplete: () => void
  countdown?: number
}

const SuccessPrompt: React.FC<SuccessPromptProps> = ({ 
  isVisible, 
  onComplete, 
  countdown = 3 
}) => {
  const [currentCount, setCurrentCount] = useState(countdown)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setCurrentCount(countdown)
      setIsExiting(false)
      return
    }

    const timer = setInterval(() => {
      setCurrentCount(prev => {
        if (prev <= 1) {
          setIsExiting(true)
          setTimeout(onComplete, 300) // 等待退出动画完成
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible, countdown, onComplete])

  const handleSkip = () => {
    setIsExiting(true)
    setTimeout(onComplete, 300)
  }

  if (!isVisible && !isExiting) return null

  return (
    <Overlay isVisible={isVisible} isExiting={isExiting}>
      <PromptCard>
        <SuccessIcon>🎉</SuccessIcon>
        <Title>解析成功！</Title>
        <Message>
          手术视频已成功解析完成<br />
          即将为您跳转到AI智能问答界面
        </Message>
        <CountdownContainer>
          <CountdownNumber>{currentCount}</CountdownNumber>
          <span>秒后自动跳转</span>
        </CountdownContainer>
        <SkipButton onClick={handleSkip}>
          立即跳转
        </SkipButton>
      </PromptCard>
    </Overlay>
  )
}

export default SuccessPrompt 