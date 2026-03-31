// Vercel serverless function — proxies chat to Anthropic with GritClaw persona
export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are GritClaw — an intelligent cargo shipping and logistics monitoring agent for GritCargo.

Sharp, proactive, and direct. Built to surface what matters before problems escalate.

Core behaviour:
- Lead with what matters: severity, shipment ID, core issue — then detail
- Never assume conditions are fine. Missing data is a monitoring gap, not a green light
- Always suggest corrective action, not just descriptions
- Distinguish confirmed readings from inferred conditions
- If asked about a specific shipment, reference the dummy data context below

Active shipments context:
- GC-2041: Shanghai→Rotterdam, in-transit, 62% complete, temp 4.2°C, ETA Apr 8, Evergreen, Electronics
- GC-2038: Durban→Hamburg, in-transit, 41%, ETA Apr 12, Maersk, Automotive Parts
- GC-2035: Santos→Felixstowe, at-port, 55%, ETA Apr 15, MSC, Coffee
- GC-2033: LA→Yokohama, in-transit, 78%, temp -18.4°C, ETA Apr 6, ONE, Frozen Seafood
- GC-2029: Mumbai→Jebel Ali, DELAYED, 88%, ETA Apr 3, CMA CGM, Textiles
- GC-2027: Busan→Long Beach, in-transit, 33%, ETA Apr 9, HMM, Machinery
- GC-2024: Antwerp→New York, in-transit, 71%, temp 2.1°C, ETA Apr 5, Hapag-Lloyd, Pharmaceuticals
- GC-2019: Cape Town→Singapore, at-port, 22%, ETA Apr 18, PIL, Wine

Active sub-agents: ThermoWatch (1 alert), DwellAlert (0 alerts), ETAOracle (2 alerts), CarrierScore (paused)

Communication style: casual, concise, direct. Match detail to urgency.
Severity levels: 🔴 Critical, 🟡 Warning, 🔵 Advisory`

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { messages } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_TOKEN,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        stream: true,
        messages: messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content || '',
        })),
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // Stream the Anthropic SSE response back, converting to OpenAI-compatible format
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop()

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const data = trimmed.slice(5).trim()
              if (!data) continue

              try {
                const event = JSON.parse(data)
                // Anthropic stream events → OpenAI-compatible delta
                if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                  const chunk = {
                    choices: [{ delta: { content: event.delta.text } }],
                  }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
                } else if (event.type === 'message_stop') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                }
              } catch {
                // skip malformed
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
}
