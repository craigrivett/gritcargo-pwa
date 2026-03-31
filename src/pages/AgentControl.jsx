import { useStore } from '../store/useStore.js'
import AgentStatusDot from '../components/AgentStatusDot.jsx'

export default function AgentControl() {
  const activeAgents = useStore((s) => s.activeAgents)
  const toggleAgentStatus = useStore((s) => s.toggleAgentStatus)

  const totalAlerts = activeAgents.reduce((sum, a) => sum + (a.alertCount || 0), 0)
  const activeCount = activeAgents.filter((a) => a.status === 'active').length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-border">
        <h1 className="text-base font-semibold text-white">Agent Control</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          {activeCount} active · {activeAgents.length} total
          {totalAlerts > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-950 text-status-red rounded text-xs font-medium">
              {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
        {activeAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onToggle={() => toggleAgentStatus(agent.id)} />
        ))}
      </div>
    </div>
  )
}

function AgentCard({ agent, onToggle }) {
  const isActive = agent.status === 'active'

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-border flex items-center justify-center text-xl flex-shrink-0">
            {agent.emoji}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{agent.name}</span>
              <AgentStatusDot status={agent.status} />
              {agent.alertCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-950 text-status-red text-xs font-medium rounded-full">
                  {agent.alertCount}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5 truncate">{agent.description}</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isActive
              ? 'bg-border text-text-secondary hover:bg-red-950 hover:text-status-red'
              : 'bg-green-950 text-accent hover:bg-accent hover:text-black'
          }`}
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 pt-1 border-t border-border">
        <div>
          <p className="text-xs text-text-secondary">Uptime</p>
          <p className="text-xs font-medium text-white">{agent.uptime}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-secondary">Last event</p>
          <p className="text-xs font-medium text-white truncate">{agent.lastEvent}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Status</p>
          <p className={`text-xs font-medium ${isActive ? 'text-accent' : 'text-status-gray'}`}>
            {isActive ? 'Active' : 'Paused'}
          </p>
        </div>
      </div>
    </div>
  )
}
