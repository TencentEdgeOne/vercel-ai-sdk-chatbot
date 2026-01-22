'use client'

import { Bot, User, RotateCcw, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { UIMessage } from 'ai'

interface MessageListProps {
  messages: any[]
  status: string
  onRegenerate: (messageId?: string) => void
}

export default function MessageList({ messages, status, onRegenerate }: MessageListProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  // Copy message content to clipboard
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      // Clear copy status after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
    } catch (err) {
      // Failed to copy text
    }
  }

  return (
    <div className="space-y-4 mb-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          <div
            className="flex items-start space-x-3 mx-auto"
            style={{ maxWidth: '720px' }}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800 border border-gray-700 flex-shrink-0 ${message.role === 'user'
                ? 'text-white'
                : 'text-white'
                }`}
            >
              {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div className="flex-1">
              {message.role === 'assistant' ? (
                <div className="text-sm text-white">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 ml-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 ml-4">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                        ) : (
                          <code className="block bg-gray-800 p-3 rounded text-xs font-mono overflow-x-auto my-2">{children}</code>
                        );
                      },
                      pre: ({ children }) => <pre className="bg-gray-800 p-3 rounded overflow-x-auto my-2">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-600 pl-3 italic my-2">{children}</blockquote>,
                      table: ({ children }) => <table className="border-collapse border border-gray-600 my-2">{children}</table>,
                      th: ({ children }) => <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-left">{children}</th>,
                      td: ({ children }) => <td className="border border-gray-600 px-2 py-1">{children}</td>,
                      a: ({ children, href }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    }}
                  >
                    {message.parts
                      ?.filter((part: any) => part.type === 'text')
                      ?.map((part: any) => part.text)
                      ?.join('') || ''}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap text-white">
                  {message.parts
                    ?.filter((part: any) => part.type === 'text')
                    ?.map((part: any) => part.text)
                    ?.join('') || ''}
                </p>
              )}

              {/* AI message action buttons */}
              {message.role === 'assistant' && (
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => copyToClipboard(
                      message.parts
                        ?.filter((part: any) => part.type === 'text')
                        ?.map((part: any) => part.text)
                        ?.join('') || '',
                      message.id
                    )}
                    className={`p-1.5 rounded-lg border transition-all duration-200 ${copiedMessageId === message.id
                      ? 'bg-green-800 border-green-600'
                      : 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                    title={copiedMessageId === message.id ? "Copied!" : "Copy message"}
                  >
                    <Copy
                      size={10}
                      className={`transition-colors duration-200 ${copiedMessageId === message.id
                        ? 'text-green-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => onRegenerate(message.id)}
                    disabled={status !== 'ready'}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerate response"
                  >
                    <RotateCcw size={10} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI loading state - below last user message */}
          {message.role === 'user' &&
            index === messages.length - 1 &&
            status !== 'ready' && (
              <div className="flex items-center space-x-3 mx-auto mt-2" style={{ maxWidth: '720px' }}>
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-800 border border-gray-700 flex-shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400 text-sm">AI is thinking</span>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  )
}
