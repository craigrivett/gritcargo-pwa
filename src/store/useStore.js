import { create } from 'zustand'
import { initialActiveAgents } from '../data/agents.js'

// OpenClaw gateway config
const GATEWAY_URL = 'https://0mfa14wrnr9vpej.gritcargo.verascient.com'
const GATEWAY_TOKEN = '18f955e874699caa3262dc286471b511249453a1622cbd5a2cf4d65893888d93'

const initialMessages = []

export const useStore = create((set, get) => ({
  // Chat
  messages: initialMessages,
  isTyping: false,

  addMessage: async (text) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      ts: Date.now(),
    }

    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }))

    // Build message history for context (last 20 messages)
    const history = get().messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }))
    history.push({ role: 'user', content: text })

    const botId = Date.now() + 1
    const botMsg = { id: botId, role: 'gritclaw', text: '', ts: Date.now() }

    try {
      const resp = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GATEWAY_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'openclaw/default',
          stream: true,
          messages: history,
        }),
      })

      if (!resp.ok) throw new Error(`Gateway error ${resp.status}`)

      // Add empty bot message and start streaming into it
      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }))

      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content
            if (delta) {
              set((state) => ({
                messages: state.messages.map((m) =>
                  m.id === botId ? { ...m, text: m.text + delta } : m
                ),
              }))
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      // On error, show a fallback message
      set((state) => ({
        messages: state.messages.some((m) => m.id === botId)
          ? state.messages.map((m) =>
              m.id === botId
                ? { ...m, text: "Sorry, I couldn't reach the gateway right now. Try again in a moment." }
                : m
            )
          : [
              ...state.messages,
              { id: botId, role: 'gritclaw', text: "Sorry, I couldn't reach the gateway right now. Try again in a moment.", ts: Date.now() },
            ],
        isTyping: false,
      }))
    }
  },

  // Agents
  activeAgents: initialActiveAgents,
  hiredIds: new Set(initialActiveAgents.map((a) => a.id)),
  toast: null,

  hireAgent: (agent) => {
    set((state) => {
      if (state.hiredIds.has(agent.id)) return state
      const newAgent = {
        ...agent,
        status: 'active',
        lastEvent: 'Just activated',
        uptime: '100%',
        alertCount: 0,
      }
      const newHiredIds = new Set(state.hiredIds)
      newHiredIds.add(agent.id)
      return {
        activeAgents: [...state.activeAgents, newAgent],
        hiredIds: newHiredIds,
        toast: `${agent.emoji} ${agent.name} is now active`,
      }
    })
    setTimeout(() => set({ toast: null }), 3000)
  },

  toggleAgentStatus: (id) => {
    set((state) => ({
      activeAgents: state.activeAgents.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
          : a
      ),
    }))
  },

  clearToast: () => set({ toast: null }),
}))
