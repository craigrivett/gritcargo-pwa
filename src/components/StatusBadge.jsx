const statusConfig = {
  'in-transit': { label: 'In Transit', bg: 'bg-green-950', text: 'text-status-green', dot: 'bg-status-green' },
  'at-port': { label: 'At Port', bg: 'bg-yellow-950', text: 'text-status-yellow', dot: 'bg-status-yellow' },
  delayed: { label: 'Delayed', bg: 'bg-red-950', text: 'text-status-red', dot: 'bg-status-red' },
  delivered: { label: 'Delivered', bg: 'bg-gray-900', text: 'text-status-gray', dot: 'bg-status-gray' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.delivered
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
