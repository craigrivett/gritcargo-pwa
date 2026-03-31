export const initialActiveAgents = [
  {
    id: 'thermowatch',
    name: 'ThermoWatch',
    emoji: '🌡️',
    status: 'active',
    description: 'Cold-chain temperature monitor',
    lastEvent: 'GC-2033 temp nominal -18.4°C',
    uptime: '99.2%',
    alertCount: 1,
  },
  {
    id: 'dwellalert',
    name: 'DwellAlert',
    emoji: '⏱️',
    status: 'active',
    description: 'Port dwell time monitor',
    lastEvent: 'GC-2035 dwell 14h at Santos',
    uptime: '100%',
    alertCount: 0,
  },
  {
    id: 'etaoracle',
    name: 'ETAOracle',
    emoji: '🔮',
    status: 'active',
    description: 'Predictive ETA engine',
    lastEvent: 'GC-2029 ETA revised +6h',
    uptime: '97.8%',
    alertCount: 2,
  },
  {
    id: 'carrierscorer',
    name: 'CarrierScore',
    emoji: '📊',
    status: 'paused',
    description: 'Carrier KPI tracker',
    lastEvent: 'Weekly report generated',
    uptime: '100%',
    alertCount: 0,
  },
]

export const availableAgents = [
  {
    id: 'routeiq',
    name: 'RouteIQ',
    emoji: '🗺️',
    tagline: 'Optimises routes for cost & transit time',
    description:
      'Analyses lane data, carrier schedules, and port congestion to recommend the most cost-effective routing for each shipment.',
    price: 'Free',
    category: 'Optimisation',
  },
  {
    id: 'docucheck',
    name: 'DocuCheck',
    emoji: '📋',
    tagline: 'Customs & compliance gap scanner',
    description:
      'Scans shipment documents before departure and flags missing or incorrect fields that could cause customs delays.',
    price: 'Free',
    category: 'Compliance',
  },
  {
    id: 'commsbot',
    name: 'CommsBot',
    emoji: '💬',
    tagline: 'Auto-drafts customer status updates',
    description:
      'Generates professional shipment status updates for your customers based on real-time tracking events.',
    price: 'Free',
    category: 'Communication',
  },
  {
    id: 'riskradar',
    name: 'RiskRadar',
    emoji: '🛡️',
    tagline: 'Geopolitical & weather risk scanner',
    description:
      'Monitors routes for geopolitical events, weather disruptions, and port strikes that could impact your shipments.',
    price: 'Free',
    category: 'Risk',
  },
  {
    id: 'invoicer',
    name: 'Invoicer',
    emoji: '🧾',
    tagline: 'Auto-generates freight invoices',
    description:
      'Pulls shipment data and generates accurate freight invoices, reducing manual admin and billing errors.',
    price: 'Free',
    category: 'Finance',
  },
]
