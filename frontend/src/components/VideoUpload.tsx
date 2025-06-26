import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { apiService } from '../services/api'

const UploadContainer = styled.div<{ isCompact: boolean }>`
  background: white;
  border-radius: 12px;
  padding: ${props => props.isCompact ? '16px' : '24px'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.isCompact ? '0' : '20px'};
  height: ${props => props.isCompact ? 'fit-content' : 'auto'};
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`

const UploadArea = styled.div<{ isDragOver: boolean; isUploaded: boolean; isCompact: boolean }>`
  border: 2px dashed ${props => props.isUploaded ? '#c00' : props.isDragOver ? '#c00' : '#ddd'};
  border-radius: 8px;
  padding: ${props => props.isCompact ? '20px 16px' : '40px 20px'};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.isDragOver ? 'rgba(200, 0, 0, 0.05)' : 'transparent'};

  &:hover {
    border-color: #c00;
    background: rgba(200, 0, 0, 0.05);
  }
`

const UploadIcon = styled.div<{ isCompact?: boolean }>`
  font-size: ${props => props.isCompact ? '24px' : '48px'};
  margin-bottom: ${props => props.isCompact ? '8px' : '16px'};
  color: #666;
`

const UploadText = styled.p<{ isCompact?: boolean }>`
  font-size: ${props => props.isCompact ? '14px' : '16px'};
  color: #666;
  margin-bottom: ${props => props.isCompact ? '4px' : '8px'};
`

const UploadHint = styled.p<{ isCompact?: boolean }>`
  font-size: ${props => props.isCompact ? '12px' : '14px'};
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
  background: #c00;
  width: ${props => props.progress}%;
  transition: width 0.3s;
`

const StatusText = styled.div<{ type: 'success' | 'info' | 'warning'; isCompact?: boolean }>`
  padding: ${props => props.isCompact ? '8px' : '12px'};
  border-radius: 6px;
  margin-top: ${props => props.isCompact ? '8px' : '16px'};
  font-size: ${props => props.isCompact ? '12px' : '14px'};
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

const AnalysisResult = styled.div<{ isCompact: boolean }>`
  margin-top: ${props => props.isCompact ? '12px' : '20px'};
  padding: ${props => props.isCompact ? '12px' : '20px'};
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #c00;
  max-height: ${props => props.isCompact ? '100px' : 'none'};
  overflow: hidden;
`

const AnalysisTitle = styled.h3<{ isCompact?: boolean }>`
  margin-bottom: ${props => props.isCompact ? '8px' : '12px'};
  color: #333;
  font-size: ${props => props.isCompact ? '14px' : '18px'};
`

const ExpandButton = styled.button`
  background: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;

  &:hover {
    background: #a00;
  }
`

interface VideoUploadProps {
  onVideoAnalyzed: (result: string) => void
  mockAnalysisResult: string
  isCompactMode?: boolean
}

const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onVideoAnalyzed, 
  mockAnalysisResult, 
  isCompactMode = false 
}) => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    isUploaded: false,
    isAnalyzing: false,
    isAnalyzed: false,
    filename: '',
    progress: 0
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
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
          <UploadIcon isCompact={isCompactMode}>✅</UploadIcon>
          <UploadText isCompact={isCompactMode}>
            {isCompactMode ? '解析完成' : '视频解析完成'}
          </UploadText>
          <StatusText type="success" isCompact={isCompactMode}>
            {isCompactMode 
              ? `"${uploadState.filename.length > 15 ? uploadState.filename.substring(0, 15) + '...' : uploadState.filename}"已解析` 
              : `视频"${uploadState.filename}"已成功解析，可以开始与AI对话了`
            }
          </StatusText>
          {(!isCompactMode || isExpanded) && (
            <AnalysisResult isCompact={isCompactMode}>
              <AnalysisTitle isCompact={isCompactMode}>解析结果预览：</AnalysisTitle>
              <div>{mockAnalysisResult.substring(0, isCompactMode ? 100 : 200)}...</div>
            </AnalysisResult>
          )}
          {isCompactMode && !isExpanded && (
            <ExpandButton onClick={() => setIsExpanded(true)}>
              查看详情
            </ExpandButton>
          )}
          {isCompactMode && isExpanded && (
            <ExpandButton onClick={() => setIsExpanded(false)}>
              收起
            </ExpandButton>
          )}
        </>
      )
    }

    if (uploadState.isAnalyzing) {
      return (
        <>
          <UploadIcon isCompact={isCompactMode}>🔄</UploadIcon>
          <UploadText isCompact={isCompactMode}>
            {isCompactMode ? '解析中...' : '正在解析视频...'}
          </UploadText>
          <StatusText type="info" isCompact={isCompactMode}>
            {isCompactMode ? 'AI分析中...' : 'AI正在分析手术视频内容，请稍候...'}
          </StatusText>
        </>
      )
    }

    if (uploadState.isUploaded) {
      return (
        <>
          <UploadIcon isCompact={isCompactMode}>✅</UploadIcon>
          <UploadText isCompact={isCompactMode}>上传成功</UploadText>
          <StatusText type="success" isCompact={isCompactMode}>
            {isCompactMode 
              ? '即将解析...' 
              : `视频"${uploadState.filename}"上传成功，即将开始解析...`
            }
          </StatusText>
        </>
      )
    }

    if (uploadState.isUploading) {
      return (
        <>
          <UploadIcon isCompact={isCompactMode}>📤</UploadIcon>
          <UploadText isCompact={isCompactMode}>
            {isCompactMode ? '上传中...' : `正在上传 ${uploadState.filename}...`}
          </UploadText>
          <ProgressBar>
            <ProgressFill progress={uploadState.progress} />
          </ProgressBar>
          <div>{uploadState.progress}%</div>
        </>
      )
    }

    return (
      <>
        <UploadIcon isCompact={isCompactMode}>📹</UploadIcon>
        <UploadText isCompact={isCompactMode}>
          {isCompactMode ? '上传视频' : '点击或拖拽上传手术视频'}
        </UploadText>
        {!isCompactMode && (
          <UploadHint isCompact={isCompactMode}>支持 MP4, AVI, MOV 格式，最大 100MB</UploadHint>
        )}
      </>
    )
  }

  return (
    <UploadContainer isCompact={isCompactMode}>
      <UploadArea
        isDragOver={isDragOver}
        isUploaded={uploadState.isUploaded}
        isCompact={isCompactMode}
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