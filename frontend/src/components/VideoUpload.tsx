import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { apiService } from '../services/api'

const UploadContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`

const UploadArea = styled.div<{ isDragOver: boolean; isUploaded: boolean }>`
  border: 2px dashed ${props => props.isUploaded ? '#28a745' : props.isDragOver ? '#667eea' : '#ddd'};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.isDragOver ? 'rgba(102, 126, 234, 0.05)' : 'transparent'};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #666;
`

const UploadText = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`

const UploadHint = styled.p`
  font-size: 14px;
  color: #999;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
`

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.progress}%;
  transition: width 0.3s;
`

const StatusText = styled.div<{ type: 'success' | 'info' | 'warning' }>`
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda'
      case 'info': return '#d1ecf1'
      case 'warning': return '#fff3cd'
      default: return '#f8f9fa'
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724'
      case 'info': return '#0c5460'
      case 'warning': return '#856404'
      default: return '#495057'
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb'
      case 'info': return '#bee5eb'
      case 'warning': return '#ffeeba'
      default: return '#dee2e6'
    }
  }};
`

const AnalysisResult = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`

const AnalysisTitle = styled.h3`
  margin-bottom: 12px;
  color: #333;
  font-size: 18px;
`

interface VideoUploadProps {
  onVideoAnalyzed: (result: string) => void
  mockAnalysisResult: string
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoAnalyzed, mockAnalysisResult }) => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    isUploaded: false,
    isAnalyzing: false,
    isAnalyzed: false,
    filename: '',
    progress: 0
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // 开始上传
    setUploadState(prev => ({ ...prev, isUploading: true, filename: file.name, progress: 0 }))

    // 模拟上传进度
    for (let i = 0; i <= 100; i += 20) {
      setUploadState(prev => ({ ...prev, progress: i }))
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    try {
      // 调用模拟上传接口
      await apiService.mockUpload(file.name)
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        isUploaded: true, 
        isAnalyzing: true 
      }))

      // 模拟解析过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 调用模拟解析接口
      const analysisResult = await apiService.mockAnalysis()
      
      setUploadState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        isAnalyzed: true 
      }))

      // 通知父组件
      onVideoAnalyzed(analysisResult.result)
      
    } catch (error) {
      console.error('上传或解析失败:', error)
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false, 
        isAnalyzing: false 
      }))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleClick = () => {
    if (!uploadState.isUploading && !uploadState.isAnalyzing) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const renderContent = () => {
    if (uploadState.isAnalyzed) {
      return (
        <>
          <UploadIcon>✅</UploadIcon>
          <UploadText>视频解析完成</UploadText>
          <StatusText type="success">
            视频"{uploadState.filename}"已成功解析，可以开始与AI对话了
          </StatusText>
          <AnalysisResult>
            <AnalysisTitle>解析结果预览：</AnalysisTitle>
            <div>{mockAnalysisResult.substring(0, 200)}...</div>
          </AnalysisResult>
        </>
      )
    }

    if (uploadState.isAnalyzing) {
      return (
        <>
          <UploadIcon>🔄</UploadIcon>
          <UploadText>正在解析视频...</UploadText>
          <StatusText type="info">
            AI正在分析手术视频内容，请稍候...
          </StatusText>
        </>
      )
    }

    if (uploadState.isUploaded) {
      return (
        <>
          <UploadIcon>✅</UploadIcon>
          <UploadText>上传成功</UploadText>
          <StatusText type="success">
            视频"{uploadState.filename}"上传成功，即将开始解析...
          </StatusText>
        </>
      )
    }

    if (uploadState.isUploading) {
      return (
        <>
          <UploadIcon>📤</UploadIcon>
          <UploadText>正在上传 {uploadState.filename}...</UploadText>
          <ProgressBar>
            <ProgressFill progress={uploadState.progress} />
          </ProgressBar>
          <div>{uploadState.progress}%</div>
        </>
      )
    }

    return (
      <>
        <UploadIcon>📹</UploadIcon>
        <UploadText>点击或拖拽上传手术视频</UploadText>
        <UploadHint>支持 MP4, AVI, MOV 格式，最大 100MB</UploadHint>
      </>
    )
  }

  return (
    <UploadContainer>
      <UploadArea
        isDragOver={isDragOver}
        isUploaded={uploadState.isUploaded}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {renderContent()}
      </UploadArea>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </UploadContainer>
  )
}

export default VideoUpload 