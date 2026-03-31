import { create } from 'zustand'
import { initialActiveAgents } from '../data/agents.js'

const initialMessages = [
  {
    id: 1,
    role: 'user',
    text: "What's the status on GC-2041?",
    ts: Date.now() - 120000,
  },
  {
    id: 2,
    role: 'gritclaw',
    text: '🔵 GC-2041 is in transit — currently 62% through the Shanghai → Rotterdam leg. ETA April 8. Temp reading nominal at 4.2°C. No exceptions flagged. Carrier is Evergreen.',
    ts: Date.now() - 118000,
  },
  {
    id: 3,
    role: 'user',
    text: 'Any alerts I should know about?',
    ts: Date.now() - 60000,
  },
  {
    id: 4,
    role: 'gritclaw',
    text: '🟡 One active item: GC-2029 (Mumbai → Jebel Ali) is showing a delay — ETA revised forward by 6 hours. This is likely routing around the Hormuz situation. I\'ll flag anything else as it comes in.',
    ts: Date.now() - 58000,
  },
]

const cannedResponses = [
  "I'm monitoring all 8 active shipments. No critical exceptions right now.",
  '🔴 ThermoWatch flagged GC-2033 earlier — temp holding at -18.4°C, within tolerance.',
  'Want me to pull the full exception report for any specific shipment?',
  'ETAOracle is predicting smooth transit for the Rotterdam-bound cargo. Should arrive on schedule.',
  "I'm on it. Give me a moment to check the latest telemetry...",
]

let cannedIndex = 0

export const useStore = create((set, get) => ({
  // Chat
  messages: initialMessages,
  isTyping: false,
  addMessage: (text) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      ts: Date.now(),
    }
    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }))

    setTimeout(() => {
      const response = cannedResponses[cannedIndex % cannedResponses.length]
      cannedIndex++
      const botMsg = {
        id: Date.now() + 1,
        role: 'gritclaw',
        text: response,
        ts: Date.now(),
      }
      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }))
    }, 1000)
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
