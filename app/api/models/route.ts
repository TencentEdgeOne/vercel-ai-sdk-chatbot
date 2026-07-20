import { NextResponse } from 'next/server'

// Keep consistent with PROVIDERS configuration in chat/route.ts
const PROVIDERS_CONFIG = {
  anthropic: { envKey: 'ANTHROPIC_API_KEY', prefixes: ['claude-'], providerName: 'Anthropic' },
  google: { envKey: 'GOOGLE_GENERATIVE_AI_API_KEY', prefixes: ['gemini-', 'gemma-'], providerName: 'Google' },
  deepseek: { envKey: 'DEEPSEEK_API_KEY', prefixes: ['deepseek-'], providerName: 'DeepSeek' },
  openai: { envKey: 'OPENAI_API_KEY', prefixes: ['gpt-', 'o1', 'o3'], providerName: 'OpenAI' },
  xai: { envKey: 'XAI_API_KEY', prefixes: ['grok-'], providerName: 'xAI' }
}

// Model definitions matching prefix rules in chat/route.ts
type ModelDefinition = {
  id: string
  name: string
  provider: string
  description: string
  envKey: string
}

// Model definitions consistent with the original list in components/ModelSelector.tsx
const MODEL_DEFINITIONS: ModelDefinition[] = [
  // DeepSeek Models
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    description: 'Fast, lightweight, low-latency',
    envKey: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    description: 'Stronger reasoning, higher-quality output',
    envKey: 'DEEPSEEK_API_KEY'
  },
  // Anthropic Models
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus 4.8',
    provider: 'Anthropic',
    description: 'Ideal for complex agentic coding and enterprise work',
    envKey: 'ANTHROPIC_API_KEY'
  },
  // Google Models
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    description: 'Higher speed and lower cost',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY'
  },
  // OpenAI Models
  {
    id: 'gpt-5.5',
    name: 'GPT 5.5',
    provider: 'OpenAI',
    description: 'A new class of intelligence for coding and professional work.',
    envKey: 'OPENAI_API_KEY'
  },
  // xAI Models
  {
    id: 'grok-4.5',
    name: 'Grok 4.5',
    provider: 'xAI',
    description: 'Agentic tool calling, minimal hallucinations, configurable reasoning.',
    envKey: 'XAI_API_KEY'
  }
]

// Check if model ID matches provider prefix rules
function matchesProviderPrefix(modelId: string, prefixes: string[]): boolean {
  return prefixes.some(prefix => modelId.startsWith(prefix))
}

// Return available models based on configured environment variables
export async function GET() {
  // 1. Check which environment variables are configured
  const configuredEnvKeys = new Set<string>()
  for (const [providerName, config] of Object.entries(PROVIDERS_CONFIG)) {
    if (Boolean(process.env[config.envKey])) {
      configuredEnvKeys.add(config.envKey)
    }
  }

  // 2. Filter models based on configured environment variables
  const availableModels = MODEL_DEFINITIONS.filter((model) => {
    // Check if the model's environment variable is configured
    if (!configuredEnvKeys.has(model.envKey)) {
      return false
    }

    // Verify model ID matches corresponding provider prefix rules (consistent with chat/route.ts logic)
    const providerConfig = Object.values(PROVIDERS_CONFIG).find(
      config => config.envKey === model.envKey
    )
    
    if (!providerConfig) {
      return false
    }

    return matchesProviderPrefix(model.id, providerConfig.prefixes)
  })

  // 3. Return model list (remove envKey field)
  const models = availableModels.map(({ envKey, ...rest }) => rest)

  return NextResponse.json({ models })
}
