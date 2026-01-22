'use client'

import { useState, useEffect } from 'react'
import ModelSelector from './ModelSelector'

interface ChatInputProps {
  onSubmit: (text: string) => void
  status: string
  selectedModel: string
  onModelChange: (model: string) => void
  placeholder?: string
  className?: string
  onFocus?: () => void
  initialValue?: string
  onModelSelectorOpenChange?: (isOpen: boolean) => void
}

export default function ChatInput({ 
  onSubmit, 
  status, 
  selectedModel, 
  onModelChange,
  placeholder = "Enter your question or idea...",
  className = "",
  onFocus,
  initialValue = "",
  onModelSelectorOpenChange
}: ChatInputProps) {
  const [input, setInput] = useState(initialValue)

  // Listen to initialValue changes, update input content
  useEffect(() => {
    setInput(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative mx-auto ${className}`} style={{ maxWidth: '720px' }}>
      <textarea
        className="w-full p-4 pr-20 border border-gray-600 rounded-2xl focus:outline-none focus:border-gray-600 bg-gray-800 text-white placeholder-gray-400 placeholder:text-sm resize-none shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] focus:shadow-[0_0_100px_rgba(255,255,255,0.6)] transition-all duration-300"
        style={{
          boxShadow: 'none',
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 0 25px rgba(255,255,255,0.3)'
          onFocus?.()
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none'
        }}
        rows={4}
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        disabled={status !== 'ready'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <button
        type="submit"
        disabled={status !== 'ready' || !input.trim() || !selectedModel}
        className="absolute bottom-4 right-4 w-10 h-10 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
      >
        {status !== 'ready' ? '...' : '↑'}
      </button>
      
      {/* Model selector - bottom left corner */}
      <div className="absolute bottom-4 left-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={status !== 'ready'}
          onOpenChange={onModelSelectorOpenChange}
        />
      </div>
    </form>
  )
}
