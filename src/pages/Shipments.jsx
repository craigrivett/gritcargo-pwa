import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { shipments } from '../data/shipments.js'
import ShipmentCard from '../components/ShipmentCard.jsx'

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createDotIcon(status) {
  const colorClass = status === 'delayed' ? 'delayed' : status === 'at-port' ? 'at-port' : ''
  return L.divIcon({
    className: '',
    html: `<div class="shipment-dot ${colorClass}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    tooltipAnchor: [8, -4],
  })
}

const statusOrder = { delayed: 0, 'at-port': 1, 'in-transit': 2 }

export default function Shipments() {
  const sorted = useMemo(
    () => [...shipments].sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3)),
    []
  )

  const stats = useMemo(() => ({
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in-transit').length,
    atPort: shipments.filter((s) => s.status === 'at-port').length,
    delayed: shipments.filter((s) => s.status === 'delayed').length,
  }), [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none px-4 pt-4 pb-3 border-b border-border">
        <h1 className="text-base font-semibold text-white">Shipments</h1>
        <div className="flex gap-4 mt-2">
          <Stat label="Total" value={stats.total} color="text-white" />
          <Stat label="Transit" value={stats.inTransit} color="text-accent" />
          <Stat label="Port" value={stats.atPort} color="text-status-yellow" />
          <Stat label="Delayed" value={stats.delayed} color="text-status-red" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Map */}
        <div style={{ height: '45vh' }} className="relative">
          <MapContainer
            center={[20, 60]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={false}
            attributionControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {shipments.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={createDotIcon(s.status)}
              >
                <Tooltip permanent={false} direction="top">
                  <div>
                    <span className="font-semibold">{s.id}</span>
                    <span className="ml-1 opacity-60">
                      {s.status === 'in-transit' ? '⚡ Transit' : s.status === 'at-port' ? '⚓ Port' : '⚠ Delayed'}
                    </span>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Cards */}
        <div className="px-4 py-4 space-y-3 pb-6">
          {sorted.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  )
}
