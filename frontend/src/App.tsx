import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from './components/Header'
import VideoUpload from './components/VideoUpload'
import ChatInterface from './components/ChatInterface'
import { AppConfig } from './types'
import { apiService } from './services/api'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  gap: 20px;
`

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<string>('')
  const [isVideoAnalyzed, setIsVideoAnalyzed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configData = await apiService.getConfig()
      setConfig(configData)
    } catch (error) {
      console.error('加载配置失败:', error)
      // 使用默认配置
      setConfig({
        ui: {
          title: '医学手术复盘AI助手',
          subtitle: '基于AI的手术视频分析与智能问答系统',
          suggested_questions: [
            '请分析这次手术的关键操作步骤有哪些？',
            '手术过程中有哪些需要改进的地方？',
            '这次手术的整体效果如何，有什么学习要点？'
          ],
          mock_video_analysis_result: '模拟的视频解析结果...'
        },
        app: {
          backend_port: 5000
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVideoAnalyzed = (result: string) => {
    setVideoAnalysisResult(result)
    setIsVideoAnalyzed(true)
  }

  if (loading) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          color: 'white',
          fontSize: '18px' 
        }}>
          加载中...
        </div>
      </AppContainer>
    )
  }

  if (!config) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          color: 'white',
          fontSize: '18px' 
        }}>
          配置加载失败
        </div>
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <Header 
        title={config.ui.title}
        subtitle={config.ui.subtitle}
      />
      <MainContent>
        <VideoUpload 
          onVideoAnalyzed={handleVideoAnalyzed}
          mockAnalysisResult={config.ui.mock_video_analysis_result}
        />
        <ChatInterface 
          suggestedQuestions={config.ui.suggested_questions}
          videoAnalysisResult={videoAnalysisResult}
          isVideoAnalyzed={isVideoAnalyzed}
        />
      </MainContent>
    </AppContainer>
  )
}

export default App 