import { deepseek } from '@ai-sdk/deepseek'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { streamText, convertToModelMessages, UIMessage } from 'ai'

// Provider configuration
const PROVIDERS = {
  anthropic: { provider: anthropic, envKey: 'ANTHROPIC_API_KEY', prefixes: ['claude-'] },
  google: { provider: google, envKey: 'GOOGLE_GENERATIVE_AI_API_KEY', prefixes: ['gemini-', 'gemma-'] },
  deepseek: { provider: deepseek, envKey: 'DEEPSEEK_API_KEY', prefixes: ['deepseek-'] },
  openai: { provider: openai, envKey: 'OPENAI_API_KEY', prefixes: ['gpt-', 'o1', 'o3'] },
  xai: { provider: xai, envKey: 'XAI_API_KEY', prefixes: ['grok-'] }
}

// Helper functions
const createErrorResponse = (error: string, message: string, provider: string, model: string, suggestion: string) => 
  new Response(JSON.stringify({ error, message, provider, model, suggestion }), { 
    status: 400, headers: { 'Content-Type': 'application/json' } 
  })

const findProvider = (model: string) => {
  for (const [name, config] of Object.entries(PROVIDERS)) {
    if (config.prefixes.some(prefix => model.startsWith(prefix))) {
      return { name, ...config }
    }
  }
  return null
}

const validateRequest = (req: Request) => {
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return new Response('Content-Type must be application/json', { status: 400 })
  }
}

const validateMessages = (messages: any[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Messages array cannot be empty', { status: 400 })
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (!msg?.role || !['user', 'assistant', 'system'].includes(msg.role)) {
      return new Response(`Message at index ${i} must have a valid role`, { status: 400 })
    }
    
    const hasContent = msg.content || msg.text || (msg.parts?.length > 0)
    if (!hasContent) {
      return new Response(`Message at index ${i} must have content`, { status: 400 })
    }
  }
}

export async function POST(req: Request) {

  const selectedModel = req.headers.get('X-Model') || '';
  
  try {
    // Validate request
    const validationError = validateRequest(req)
    if (validationError) return validationError

    // Parse and validate body
    const body = await req.json()
    if (!body.messages) return new Response('Messages parameter is required', { status: 400 })
    
    const messagesError = validateMessages(body.messages)
    if (messagesError) return messagesError

    // Convert messages to UI format
    const uiMessages: UIMessage[] = body.messages.map((msg: any) => ({
      id: msg.id || Math.random().toString(36).substr(2, 9),
      role: msg.role,
      parts: msg.parts || [{ type: 'text', text: msg.content || msg.text || '' }]
    }))

    // Find provider
    const providerConfig = findProvider(selectedModel);
    if (!providerConfig) {
      return createErrorResponse(
        'UNSUPPORTED_MODEL',
        `${selectedModel} model is not supported, please try using other models or contact the website developer for feedback`,
        'Unknown',
        selectedModel,
        'Please select a supported model'
      )
    }

    // Check API key - Environment variables need to be configured
    // For local development: create a .env.local file with the required API keys
    // For EdgeOne Pages: configure environment variables in the EdgeOne Pages console
    const apiKey = process.env[providerConfig.envKey]
    if (!apiKey) {
      return createErrorResponse(
        'API_KEY_NOT_CONFIGURED',
        `API key for ${providerConfig.name} is not configured, please try using other models or contact the website developer for feedback`,
        providerConfig.name,
        selectedModel,
        `Please set ${providerConfig.envKey} in environment variables`
      )
    }

    // Stream response
    const result = streamText({
      model: providerConfig.provider(selectedModel),
      system: 'You are an intelligent AI assistant dedicated to helping users. Please follow these principles:\n1. Provide accurate, useful, and concise answers\n2. Maintain a friendly and professional tone\n3. Be honest when uncertain about answers\n4. Support both Chinese and English communication\n5. Provide practical advice and solutions',
      messages: convertToModelMessages(uiMessages),
      maxOutputTokens: 1000,
      temperature: 0.7,
    });
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    
    // Handle API key errors
    if (error?.error?.error?.code === 'invalid_api_key' || 
        error?.message?.includes('invalid_api_key') ||
        error?.message?.includes('authentication') ||
        error?.message?.includes('unauthorized') ||
        error?.message?.includes('API key')) {
      
      return createErrorResponse(
        'INVALID_API_KEY',
        'API key is invalid or expired. Please check your API key configuration.',
        'Unknown',
        selectedModel,
        'Please verify your API key is correct and not expired'
      )
    }
    
    // Handle quota/balance errors
    if (error?.error?.error?.code === 'insufficient_quota' || 
        error?.message?.includes('quota') || 
        error?.error?.message === 'Insufficient Balance' ||
        error?.message?.includes('Insufficient Balance')) {
      
      const mockResponse = new ReadableStream({
        start(controller) {
          const mockText = "Sorry, your AI API account has insufficient balance. Please recharge your account to continue using the service."
          const words = mockText.split('')
          let index = 0
          
          const interval = setInterval(() => {
            if (index < words.length) {
              controller.enqueue(new TextEncoder().encode(`data: {"type":"text-delta","id":"0","delta":"${words[index]}"}\n\n`))
              index++
            } else {
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
              controller.close()
              clearInterval(interval)
            }
          }, 50)
        }
      })
      
      return new Response(mockResponse, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    }
    
    // Handle rate limit errors
    if (error?.error?.error?.code === 'rate_limit_exceeded' || 
        error?.message?.includes('rate_limit') ||
        error?.message?.includes('too many requests')) {
      
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'API rate limit exceeded. Please try again later.',
        'Unknown',
        selectedModel,
        'Please wait a moment before making another request'
      )
    }
    
    return new Response('Internal Server Error', { status: 500 })
  }
}