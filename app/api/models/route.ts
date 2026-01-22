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
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    description: 'Strong reasoning and coding abilities',
    envKey: 'DEEPSEEK_API_KEY'
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'DeepSeek',
    description: 'Enhanced reasoning capabilities',
    envKey: 'DEEPSEEK_API_KEY'
  },
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Most capable model for complex tasks',
    envKey: 'ANTHROPIC_API_KEY'
  },
  // Google Models
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Latest generation with enhanced capabilities',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY'
  },
  // OpenAI Models
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and cost-effective',
    envKey: 'OPENAI_API_KEY'
  },
  // xAI Models
  {
    id: 'grok-3',
    name: 'Grok-3',
    provider: 'xAI',
    description: 'Advanced reasoning and real-time knowledge',
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
