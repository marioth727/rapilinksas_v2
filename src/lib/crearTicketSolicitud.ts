// ============================================================
// crearTicketSolicitud.ts
// Crea un ticket de instalación nueva en WispHub vía N8N.
// Workflow dedicado (/rapilink-solicitud-ticket) — el cliente
// aún no existe en WispHub, por eso se envían sus datos directamente.
// ============================================================

const N8N_BASE =
  import.meta.env.VITE_N8N_WEBHOOK_BASE || 'https://n8n.rapilinksas.co/webhook'

export interface SolicitudTicketPayload {
  asunto: string
  descripcion: string
  nombre: string
  correo: string
  cedula: string
  direccion: string
  barrio: string
  telefono: string
  urlPdf?: string
}

export async function crearTicketSolicitud(payload: SolicitudTicketPayload): Promise<void> {
  await fetch(`${N8N_BASE}/rapilink-solicitud-ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  })
}
