'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export interface ModelOption {
  id: string
  name: string
  provider: string
  description: string
  disabled?: boolean
}

const fallbackModelOptions: ModelOption[] = [
  // DeepSeek Models (Priority display)
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    description: 'Fast, lightweight, low-latency',
    disabled: false
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    description: 'Stronger reasoning, higher-quality output',
    disabled: false
  },

  // Anthropic Models
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    provider: 'Anthropic',
    description: 'Ideal for complex agentic coding and enterprise work',
    disabled: false
  },

  // Google Models
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    description: 'Higher speed and lower cost',
    disabled: false
  },

  // OpenAI Models
  {
    id: 'gpt-5.5',
    name: 'GPT 5.5',
    provider: 'OpenAI',
    description: 'A new class of intelligence for coding and professional work.',
    disabled: false
  },

  // xAI Models
  {
    id: 'grok-4.5',
    name: 'Grok 4.5',
    provider: 'xAI',
    description: 'Agentic tool calling, minimal hallucinations, configurable reasoning.',
    disabled: false
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export default function ModelSelector({ selectedModel, onModelChange, disabled = false, onOpenChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = modelOptions.find(option => option.id === selectedModel) || modelOptions[0]
  const isDisabled = disabled || loading || modelOptions.length === 0
  const buttonLabel = loading
    ? 'Loading models...'
    : selectedOption?.name || 'No models available'

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId)
    setIsOpen(false)
    onOpenChange?.(false)
  }

  // Load available models from server and filter out those without env configuration
  useEffect(() => {
    let isMounted = true

    const fetchModels = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/models')
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`)
        }
        const data = await response.json()
        const fetchedOptions = Array.isArray(data?.models) ? data.models : []

        if (!isMounted) return
        setModelOptions(fetchedOptions)
        setError(fetchedOptions.length === 0 ? 'No models available. Please check environment variable configuration.' : null)
      } catch (err) {
        if (!isMounted) return
        setError('Failed to load model list, using default list')
        setModelOptions(fallbackModelOptions)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchModels()

    return () => {
      isMounted = false
    }
  }, [])

  // Ensure selected model is always one of the available options
  useEffect(() => {
    if (loading) return

    if (modelOptions.length === 0) {
      if (selectedModel) onModelChange('')
      return
    }

    const exists = modelOptions.some(option => option.id === selectedModel)
    if (!exists) {
      onModelChange(modelOptions[0].id)
    }
  }, [loading, modelOptions, onModelChange, selectedModel])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const newIsOpen = !isOpen
          setIsOpen(newIsOpen)
          onOpenChange?.(newIsOpen)
        }}
        disabled={isDisabled}
        className="flex items-center space-x-2 px-3 py-2 text-white text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-300"
      >
        <span className="font-medium">{buttonLabel}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && modelOptions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-black border border-gray-500 rounded-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Select AI Model</div>
            {modelOptions.map((option) => (
              <button
                key={option.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (option.disabled) return
                  handleModelSelect(option.id)
                }}
                disabled={option.disabled}
                className={`w-full text-left px-3 py-2 transition-colors duration-200 ${option.disabled
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : selectedModel === option.id
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                  }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{option.name}</span>
                    <span className="text-xs text-gray-500">{option.provider}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div className="mt-1 text-[10px] text-gray-400 px-1 max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}