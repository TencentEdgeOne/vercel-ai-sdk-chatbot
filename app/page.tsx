'use client'

import { useState, useEffect } from 'react'
import { useChatLogic } from '@/hooks/useChatLogic'
import { useScrollLogic } from '@/hooks/useScrollLogic'
import HomeScreen from '@/components/HomeScreen'
import MessageList from '@/components/MessageList'
import ChatInput from '@/components/ChatInput'
import ErrorMessage from '@/components/ErrorMessage'
import ScrollToBottomButton from '@/components/ScrollToBottomButton'

export default function Chat() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [hideHomeScreen, setHideHomeScreen] = useState(false)
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)

  // Use custom hooks
  const {
    messages,
    status,
    error,
    selectedModel,
    setSelectedModel,
    errorMessage,
    lastUserMessage,
    handleSendMessage,
    handleRegenerate,
    clearError,
    clearLastUserMessage,
  } = useChatLogic()

  const { showScrollToBottom, scrollToBottom, messagesEndRef } = useScrollLogic(messages.length, status)

  // Handle message sending
  const handleMessageSubmit = (text: string) => {
    handleSendMessage(text)
    setShowChat(true)
    setIsTransitioning(false)
    // Delay hiding home screen a bit more to ensure animation completes
    setTimeout(() => {
      setHideHomeScreen(true)
    }, 100)
  }

  // Handle transition start
  const handleTransitionStart = () => {
    setIsTransitioning(true)
  }

  // Handle retry
  const handleRetry = () => {
    clearError()
    const shouldGoToHome = clearLastUserMessage()
    
    // Only return to initial screen if no messages left after deletion
    if (shouldGoToHome) {
      setHideHomeScreen(false)
      setIsTransitioning(false)
      setShowChat(false)
    }
  }

  return (
    <div className="w-full max-w-4xl h-full mx-auto px-6 py-4">
      {/* Initial screen title and description */}
      {messages.length === 0 && !hideHomeScreen ? (
        <HomeScreen
          onSubmit={handleMessageSubmit}
          status={status}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isTransitioning={isTransitioning}
          onTransitionStart={handleTransitionStart}
          initialValue={lastUserMessage}
          onModelSelectorOpenChange={setIsModelSelectorOpen}
        />
      ) : (
        <div className={`min-h-full transition-all duration-800 ease-in-out ${
          showChat ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          {/* Message area - allow entire page to scroll */}
          <div className="px-6 py-4 pb-48">
            <div className="w-full max-w-4xl mx-auto">
              {/* Message list */}
              <MessageList
                messages={messages}
                status={status}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
          
        </div>
      )}

      {/* Error message - fixed above input box */}
      {errorMessage && messages.length > 0 && !isModelSelectorOpen && (
        <div className="fixed left-0 right-0 z-10 px-6" style={{ bottom: '155px' }}>
          <div className="w-full max-w-4xl mx-auto">
            <ErrorMessage
              errorMessage={errorMessage}
              onRetry={handleRetry}
            />
          </div>
        </div>
      )}

      {/* Fixed input box for chat state */}
      {messages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 100%)'
        }}>
          <div className="w-full mx-auto">
            <ChatInput
              key={`chat-${lastUserMessage}`}
              onSubmit={handleSendMessage}
              status={status}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              initialValue={lastUserMessage}
              onModelSelectorOpenChange={setIsModelSelectorOpen}
            />
          </div>
        </div>
      )}

      {/* Scroll to bottom button */}
      <ScrollToBottomButton
        show={showScrollToBottom}
        onClick={scrollToBottom}
      />

      {/* Message end reference for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  )
}