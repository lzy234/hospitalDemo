import React from 'react'
import styled from 'styled-components'

const QuestionsContainer = styled.div<{ isFullScreen?: boolean }>`
  padding: ${props => props.isFullScreen ? '8px 0' : '8px 20px'};
  border-top: 1px solid #eee;
  background: ${props => props.isFullScreen ? 'transparent' : '#f8f9fa'};
  border-radius: ${props => props.isFullScreen ? '0' : '0'};
`

const QuestionsTitle = styled.h4<{ isFullScreen?: boolean }>`
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-align: ${props => props.isFullScreen ? 'center' : 'left'};
`

const QuestionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 6px;
  }
`

const QuestionButton = styled.button<{ disabled: boolean; isFullScreen?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.3;
  font-family: inherit;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    border-color: #c00;
    background: #c00;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(200, 0, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  disabled?: boolean
  isFullScreen?: boolean
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionClick, 
  disabled = false,
  isFullScreen = false 
}) => {
  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <QuestionsContainer isFullScreen={isFullScreen}>
      <QuestionsTitle isFullScreen={isFullScreen}>建议问题</QuestionsTitle>
      <QuestionsGrid>
        {questions.map((question, index) => (
          <QuestionButton
            key={index}
            onClick={() => onQuestionClick(question)}
            disabled={disabled}
            isFullScreen={isFullScreen}
          >
            {question}
          </QuestionButton>
        ))}
      </QuestionsGrid>
    </QuestionsContainer>
  )
}

export default SuggestedQuestions 