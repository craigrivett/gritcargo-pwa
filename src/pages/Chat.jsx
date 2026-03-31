import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.js'

const WELCOME = {
  id: 'welcome',
  role: 'gritclaw',
  text: "Hey 👋 I'm GritClaw — your cargo monitoring agent. Ask me about any active shipment, exceptions, ETAs, or agent alerts.",
  ts: Date.now(),
}

export default function Chat() {
  const messages = useStore((s) => s.messages)
  const isTyping = useStore((s) => s.isTyping)
  const addMessage = useStore((s) => s.addMessage)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isTyping) return
    addMessage(text)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const allMessages = messages.length === 0 ? [WELCOME] : messages

  return (
    <div className="flex flex-col" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-border bg-bg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-lg leading-none">
            🦞
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">GritClaw</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-secondary">Monitoring 8 shipments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages — scrollable middle area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {allMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-sm flex-shrink-0 leading-none">
              🦞
            </div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — pinned above bottom nav */}
      <div className="flex-none px-4 py-3 border-t border-border bg-bg">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-full pl-4 pr-2 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message GritClaw..."
            className="flex-1 bg-transparent text-sm text-white placeholder-text-secondary outline-none min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center transition-opacity disabled:opacity-30 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] bg-accent text-black rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed">
          {msg.text}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-sm flex-shrink-0 leading-none">
        🦞
      </div>
      <div className="max-w-[78%] bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-white leading-relaxed whitespace-pre-wrap">
        {msg.text || <span className="opacity-40">...</span>}
      </div>
    </div>
  )
}
