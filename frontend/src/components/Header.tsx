import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
  text-align: center;
  color: white;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
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