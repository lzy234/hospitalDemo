import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  background: #c00;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 0;
  text-align: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`

const Subtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 300;
  margin: 0;
`

interface HeaderProps {
  title: string
  subtitle?: string
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </HeaderContainer>
  )
}

export default Header 