import axios from 'axios'
import { AppConfig, ChatEventData } from '../types'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

export class ApiService {
  // 获取配置
  async getConfig(): Promise<AppConfig> {
    const response = await api.get<AppConfig>('/config')
    return response.data
  }

  // 模拟视频上传
  async mockUpload(filename: string): Promise<{ success: boolean; message: string; filename: string }> {
    const response = await api.post('/upload/mock', { filename })
    return response.data
  }

  // 模拟视频解析
  async mockAnalysis(): Promise<{ success: boolean; message: string; result: string }> {
    const response = await api.post('/analysis/mock')
    return response.data
  }

  // 流式聊天
  async chatStream(message: string, onData: (data: ChatEventData) => void): Promise<void> {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法创建流读取器')
    }

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              onData(data)
              
              // 如果收到结束信号，停止读取
              if (data.type === 'end') {
                return
              }
            } catch (error) {
              console.error('解析SSE数据失败:', error)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/health')
    return response.data
  }
}

export const apiService = new ApiService() 