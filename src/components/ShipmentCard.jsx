import StatusBadge from './StatusBadge.jsx'

export default function ShipmentCard({ shipment }) {
  const { id, origin, destination, status, temp, eta, carrier, commodity, progress } = shipment

  const etaDate = new Date(eta)
  const etaFormatted = etaDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white font-mono">{id}</span>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{commodity} · {carrier}</p>
        </div>
        {temp !== null && (
          <div className="flex-shrink-0 flex items-center gap-1 bg-blue-950 border border-blue-900 rounded-lg px-2 py-1">
            <span className="text-blue-400 text-xs">❄</span>
            <span className="text-xs text-blue-300 font-medium">{temp}°C</span>
          </div>
        )}
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white font-medium truncate">{origin}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-text-secondary flex-shrink-0">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-white font-medium truncate">{destination}</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>{progress}% complete</span>
          <span>ETA {etaFormatted}</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: status === 'delayed' ? '#ef4444' : status === 'at-port' ? '#f59e0b' : '#00C853',
            }}
          />
        </div>
      </div>
    </div>
  )
}
