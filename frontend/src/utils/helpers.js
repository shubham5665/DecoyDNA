export const useWebSocket = (onMessage) => {
  const connect = () => {
    const ws = new WebSocket('ws://127.0.0.1:8000/api/ws/events')
    
    ws.onopen = () => {
      console.log('WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (onMessage) {
        onMessage(data)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect()
      }, 3000)
    }
    
    return ws
  }
  
  return { connect }
}

export const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleString()
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes, k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export const truncateString = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const getEventColor = (eventType) => {
  const colors = {
    modified: '#FFA500',
    accessed: '#FFD700',
    moved: '#87CEEB',
    created: '#90EE90',
    open: '#FF6347',
    execute: '#FF0000',
  }
  return colors[eventType] || '#00f0ff'
}

export const getEventIcon = (eventType) => {
  const icons = {
    modified: '✎',
    accessed: '👁️',
    moved: '→',
    created: '✚',
    open: '📂',
    execute: '▶️',
  }
  return icons[eventType] || '●'
}
