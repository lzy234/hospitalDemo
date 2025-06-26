import React from 'react'
import styled from 'styled-components'

const SuggestionsContainer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
`

const SuggestionsTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
`

const SuggestionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const SuggestionButton = styled.button<{ disabled: boolean }>`
  padding: 8px 16px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 16px;
  font-size: 13px;
  color: #495057;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    flex: 1;
    min-width: calc(50% - 4px);
  }
`

interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  disabled?: boolean
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionClick, 
  disabled = false 
}) => {
  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <SuggestionsContainer>
      <SuggestionsTitle>
        💡 建议提问：
      </SuggestionsTitle>
      <SuggestionsGrid>
        {questions.map((question, index) => (
          <SuggestionButton
            key={index}
            onClick={() => !disabled && onQuestionClick(question)}
            disabled={disabled}
            title={question}
          >
            {question}
          </SuggestionButton>
        ))}
      </SuggestionsGrid>
    </SuggestionsContainer>
  )
}

export default SuggestedQuestions 