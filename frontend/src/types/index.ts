export interface AppConfig {
  ui: {
    title: string
    subtitle?: string
    suggested_questions: string[]
    mock_video_analysis_result: string
  }
  app: {
    backend_port: number
  }
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatEventData {
  type: 'message_delta' | 'chat_completed' | 'error' | 'end' | 'other_event'
  content?: string
  message_id?: string
  token_usage?: {
    token_count: number
  }
  chat_id?: string
  error?: string
  error_type?: string
  event_type?: string
  data?: string
}

export interface VideoUploadState {
  isUploading: boolean
  isUploaded: boolean
  isAnalyzing: boolean
  isAnalyzed: boolean
  filename?: string
  analysisResult?: string
} 