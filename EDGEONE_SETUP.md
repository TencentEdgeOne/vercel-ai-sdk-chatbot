# EdgeOne Pages Action Setup Guide

## Overview

This project has been configured to support EdgeOne Pages Action, using the `onRequest` entry function to handle AI chat API requests. This implementation uses `@ai-sdk/*` packages to call various AI services, maintaining the same functionality and error handling as the original Next.js API route.

## File Structure

```
functions/
└── api/
    └── chat/
        └── index.js          # EdgeOne Pages Action entry point
```

## Environment Variables Configuration

Set the following environment variables in the EdgeOne Pages console:

### Required Environment Variables

- `DEEPSEEK_API_KEY` - DeepSeek API key

### Optional Environment Variables

- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API key
- `OPENAI_API_KEY` - OpenAI API key
- `XAI_API_KEY` - xAI Grok API key

## Supported Models

### DeepSeek Models

- `deepseek-v4-flash` - Better suited for scenarios that prioritize low latency, high concurrency, and cost efficiency
- `deepseek-v4-pro` - Better suited for scenarios that prioritize reasoning capability, higher answer quality, and complex task performance

### Anthropic Models

- `claude-opus-4-8` -Ideal for complex agentic coding and enterprise work

### Google Models

- `gemini-3.5-flash` - Higher speed and lower cost

### OpenAI Models

- `gpt-5.5` - A new class of intelligence for coding and professional work.

### xAI Models

- `grok-4.5` - Agentic tool calling, minimal hallucinations, configurable reasoning.

## API Endpoint

**URL**: `/api/chat`

- **Method**: POST
- **Content-Type**: `application/json`

### Request Format

```json
{
  "messages": [
    {
      "id": "message-id",
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "Hello, how are you?"
        }
      ]
    }
  ]
}
```

### Request Headers

- `X-Model`: Specify the AI model to use (optional, defaults to `deepseek-v4-flash`)

## AI SDK Integration

This project uses the following Vercel AI SDK packages:

- `@ai-sdk/deepseek` - DeepSeek model support
- `@ai-sdk/anthropic` - Anthropic Claude model support
- `@ai-sdk/google` - Google Gemini model support
- `@ai-sdk/openai` - OpenAI GPT model support
- `@ai-sdk/xai` - xAI Grok model support
- `ai` - Core AI SDK functionality

EdgeOne Pages Action uses standard ES6 module imports to load these packages.

## Deployment Steps

1. Upload code to EdgeOne Pages
2. Configure environment variables in the console
3. Deploy the project
4. Access the frontend page to start using

## Error Handling

The API returns structured error information:

```json
{
  "error": "ERROR_TYPE",
  "message": "Error description",
  "provider": "Provider name",
  "model": "Model name",
  "suggestion": "Suggested action"
}
```

## Streaming Response

The API supports streaming responses, and the frontend will display AI responses in real-time.

## Notes

1. Ensure all necessary environment variables are properly set
2. API keys need to have sufficient quota
3. Some models may require specific API access permissions
4. It's recommended to set up appropriate error monitoring and logging in production environments
