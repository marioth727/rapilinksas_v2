// ============================================================
// wispHubFunctions.ts
// Ejecuta las funciones de WispHub a través de los webhooks N8N
// La API Key de WispHub NUNCA se expone aquí — vive en N8N
// ============================================================

const N8N_BASE = import.meta.env.VITE_N8N_WEBHOOK_BASE || 'https://n8n.rapilinksas.co/webhook';

export interface ClienteWispHub {
  encontrado: boolean;
  id_servicio?: number;
  nombre?: string;
  cedula?: string;
  estado?: string;
  plan?: string;
  saldo_pendiente?: number;
  precio_plan?: number;
  fecha_corte?: string;
  estado_facturas?: string;
  ip?: string;
  router_falla?: boolean;
  router_falla_descripcion?: string;
  mensaje?: string;
}

export interface TicketResult {
  exito: boolean;
  mensaje: string;
  ticket?: Record<string, unknown>;
}

export type WispHubAsunto =
  | 'Internet Lento'
  | 'No Tiene Internet'
  | 'Internet Intermitente'
  | 'Cambio de Contraseña en Router Wifi'
  | 'Router Wifi Reseteado(Valores de Fabrica)'
  | 'Cable Fibra Dañado'
  | 'Reconexión'
  | 'Cambio de Domicilio';

// ─── Función 1: Consultar cliente por cédula ─────────────────
export async function consultarCliente(cedula: string): Promise<ClienteWispHub> {
  console.log('[WISPHUB] [REQUEST] consultarCliente:', cedula);
  try {
    const res = await fetch(`${N8N_BASE}/rapilink-cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula }),
      signal: AbortSignal.timeout(10000),
    });

    const data: ClienteWispHub = await res.json();
    console.log('[WISPHUB] [RESPONSE] consultarCliente:', data);
    return data;
  } catch (err) {
    console.error('[WISPHUB] Error consultarCliente:', err);
    return {
      encontrado: false,
      mensaje: 'No se pudo consultar el sistema en este momento. Por favor intenta de nuevo.',
    };
  }
}

// ─── Función 2: Crear ticket de soporte ──────────────────────
export async function crearTicket(
  cedula: string,
  asunto: WispHubAsunto | string,
  descripcion: string,
  tecnico: number
): Promise<TicketResult> {
  console.log('[WISPHUB] [REQUEST] crearTicket:', { cedula, asunto, descripcion, tecnico });
  try {
    const res = await fetch(`${N8N_BASE}/rapilink-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula, asunto, descripcion, tecnico }),
      signal: AbortSignal.timeout(10000),
    });

    const data: TicketResult = await res.json();
    console.log('[WISPHUB] [RESPONSE] crearTicket:', data);
    return data;
  } catch (err) {
    console.error('[WISPHUB] Error crearTicket:', err);
    return {
      exito: false,
      mensaje: 'No se pudo crear el ticket en este momento. Por favor llama al soporte técnico.',
    };
  }
}

// ─── Dispatcher: recibe el nombre de función y args de Gemini ─
export async function ejecutarFuncionGemini(
  nombre: string,
  args: Record<string, unknown>
): Promise<Record<string, unknown>> {
  console.log('[WISPHUB] [MAPPING] Función Gemini:', nombre, args);

  switch (nombre) {
    case 'consultar_cliente': {
      const cedula = String(args.cedula || '');
      const resultado = await consultarCliente(cedula);
      return resultado as unknown as Record<string, unknown>;
    }

    case 'crear_ticket': {
      const cedula = String(args.cedula || '');
      const asunto = String(args.asunto || 'No Tiene Internet');
      const descripcion = String(args.descripcion || 'Sin descripción adicional');
      const tecnico = 1408762; // ID de admin@rapilink-sas obtenido de WispHub API
      const resultado = await crearTicket(cedula, asunto, descripcion, tecnico);
      return resultado as unknown as Record<string, unknown>;
    }

    default:
      console.warn('[WISPHUB] Función desconocida:', nombre);
      return { error: `Función desconocida: ${nombre}` };
  }
}

// ─── Declaraciones de tools para Gemini (Function Calling) ────
export const WISPHUB_TOOLS = [
  {
    function_declarations: [
      {
        name: 'consultar_cliente',
        description:
          'Consulta la información del cliente en WispHub usando su número de cédula. ' +
          'Devuelve: nombre, estado del servicio (Activo/Suspendido/Moroso), plan de internet, ' +
          'saldo pendiente, fecha de corte, y si el router tiene una falla general reportada. ' +
          'Usa esta función cuando el cliente quiera saber su saldo, estado de cuenta, plan o fecha de pago.',
        parameters: {
          type: 'object',
          properties: {
            cedula: {
              type: 'string',
              description:
                'Número de cédula o documento de identidad del titular del servicio (solo dígitos)',
            },
          },
          required: ['cedula'],
        },
      },
      {
        name: 'crear_ticket',
        description:
          'Crea un ticket de soporte técnico en WispHub cuando el cliente ya pasó por los ' +
          'pasos básicos de diagnóstico (reinicio del router, verificación de luces) y el ' +
          'problema persiste. NO uses esta función sin antes haber guiado al cliente por un ' +
          'diagnóstico básico. ',
        parameters: {
          type: 'object',
          properties: {
            cedula: {
              type: 'string',
              description: 'Número de cédula del titular del servicio',
            },
            asunto: {
              type: 'string',
              enum: ['Internet Lento', 'No Tiene Internet', 'Internet Intermitente', 'Cambio de Contraseña en Router Wifi', 'Cable Fibra Dañado', 'Reconexión', 'Cambio de Domicilio'],
              description: 'El asunto exacto predefinido del problema reportado por el cliente, escoge de la lista',
            },
            descripcion: {
              type: 'string',
              description:
                'Descripción detallada del problema incluyendo: síntomas, pasos de diagnóstico ya realizados y resultado de esos pasos.',
            },
          },
          required: ['cedula', 'asunto', 'descripcion'],
        },
      },
    ],
  },
];
