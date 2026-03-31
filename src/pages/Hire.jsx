import { useState } from 'react'
import { availableAgents } from '../data/agents.js'
import { useStore } from '../store/useStore.js'

const categoryColors = {
  Optimisation: 'bg-blue-950 text-blue-400',
  Compliance: 'bg-purple-950 text-purple-400',
  Communication: 'bg-green-950 text-accent',
  Risk: 'bg-orange-950 text-orange-400',
  Finance: 'bg-yellow-950 text-yellow-400',
}

export default function Hire() {
  const hiredIds = useStore((s) => s.hiredIds)
  const hireAgent = useStore((s) => s.hireAgent)
  const [pending, setPending] = useState(new Set())

  const handleHire = (agent) => {
    if (hiredIds.has(agent.id) || pending.has(agent.id)) return
    setPending((prev) => new Set([...prev, agent.id]))
    setTimeout(() => {
      hireAgent(agent)
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(agent.id)
        return next
      })
    }, 1200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-border">
        <h1 className="text-base font-semibold text-white">Hire Agents</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Expand your monitoring capabilities
        </p>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
        {availableAgents.map((agent) => {
          const isHired = hiredIds.has(agent.id)
          const isPending = pending.has(agent.id)
          const catClass = categoryColors[agent.category] || 'bg-gray-900 text-text-secondary'

          return (
            <div key={agent.id} className="bg-surface border border-border rounded-xl p-4 space-y-3">
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-border flex items-center justify-center text-2xl flex-shrink-0">
                  {agent.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{agent.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catClass}`}>
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{agent.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-text-secondary leading-relaxed">{agent.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-xs font-semibold text-accent">{agent.price}</span>
                <button
                  onClick={() => handleHire(agent)}
                  disabled={isHired || isPending}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    isHired
                      ? 'bg-green-950 text-accent cursor-default'
                      : isPending
                      ? 'bg-border text-text-secondary cursor-wait'
                      : 'bg-accent text-black hover:bg-green-400 active:scale-95'
                  }`}
                >
                  {isHired ? (
                    <>
                      <span>Active</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  ) : isPending ? (
                    <>
                      <Spinner />
                      <span>Hiring...</span>
                    </>
                  ) : (
                    'Hire'
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
