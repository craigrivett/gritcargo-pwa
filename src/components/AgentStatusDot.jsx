export default function AgentStatusDot({ status }) {
  if (status === 'active') {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
      </span>
    )
  }
  return (
    <span className="w-2.5 h-2.5 rounded-full bg-status-gray flex-shrink-0" />
  )
}
