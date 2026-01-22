import { useChat } from '@ai-sdk/react'
import { useState } from 'react'

export function useChatLogic() {
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [lastUserMessage, setLastUserMessage] = useState<string>('')

  const handleModelChange = (model: string) => {
    setSelectedModel(model)
  }

  const { messages, sendMessage, status, error, regenerate, setMessages, clearError: clearChatError } = useChat({
    onError: (error) => {
      // Try to parse error information
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message)
          
          // Handle all types of errors
          if (errorData.error || errorData.message) {
            setErrorMessage(errorData.message || 'An error occurred')
            return
          }
        } catch (e) {
          // If not JSON format, check if it contains API-related error information
          
          // Check for common API error keywords
          const errorMessage = error.message.toLowerCase()
          if (errorMessage.includes('api key') || errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
            setErrorMessage('API key is invalid or expired. Please check your API key configuration.')
          } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            setErrorMessage('API quota exceeded or rate limit reached. Please try again later.')
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            setErrorMessage('Network connection error. Please check your internet connection.')
          } else {
            setErrorMessage(error.message)
          }
        }
      } else {
        setErrorMessage('An unexpected error occurred')
      }
      
      // Default error message
      setErrorMessage('Connection error, please check your network or try again later')
    },
    onFinish: () => {
      // Message finished
    }
  })

  // Send message
  const handleSendMessage = (text: string) => {
    if (!selectedModel) {
      setErrorMessage('No available model is configured. Please set an API key first.')
      return
    }
    sendMessage({ text }, {
      headers: {
        'X-Model': selectedModel,
      }
    })
  }

  // Regenerate response
  const handleRegenerate = (messageId?: string) => {
    if (status === 'ready') {
      if (!selectedModel) {
        setErrorMessage('No available model is configured. Please set an API key first.')
        return
      }
      regenerate({ 
        messageId,
        headers: {
          'X-Model': selectedModel,
        }
      })
    }
  }

  // Clear error
  const clearError = () => {
    setErrorMessage('')
    clearChatError()
  }

  // Clear last user message (for retry)
  const clearLastUserMessage = () => {
    // Find the last user message from back to front
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        // Save user message content
        const userMessageText = (messages[i].parts?.[0] as any)?.text || ''
        setLastUserMessage(userMessageText)
        
        const newMessages = messages.slice(0, i)
        setMessages(newMessages)
        
        // If no messages left after deletion, return true to indicate need to return to home screen
        return newMessages.length === 0
      }
    }
    
    // If no user message found, return false
    return false
  }

  return {
    // State
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel: handleModelChange,
    errorMessage,
    lastUserMessage,
    
    // Methods
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  }
}
