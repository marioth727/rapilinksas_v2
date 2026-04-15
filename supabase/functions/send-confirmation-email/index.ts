import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import nodemailer from 'npm:nodemailer@6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { nombre, apellido, correo, numeroSolicitud } = await req.json()

    if (!nombre || !apellido || !correo || !numeroSolicitud) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const smtpHost = Deno.env.get('SMTP_HOST') ?? ''
    const smtpPort = Number(Deno.env.get('SMTP_PORT') ?? '465')
    const smtpUser = Deno.env.get('SMTP_USER') ?? ''
    const smtpPass = Deno.env.get('SMTP_PASS') ?? ''

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de solicitud — Rapilink</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#0ea5e9;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">Rapilink SAS</h1>
              <p style="color:#bae6fd;margin:8px 0 0;font-size:14px;">Conectividad que transforma</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#0f172a;font-size:22px;margin:0 0 16px;">¡Hola, ${nombre} ${apellido}!</h2>
              <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Tu solicitud de servicio de internet ha sido <strong>recibida exitosamente</strong>.
                Nuestro equipo la revisará y se pondrá en contacto contigo muy pronto.
              </p>
              <!-- Número de solicitud -->
              <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                <p style="color:#0369a1;font-size:13px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Número de solicitud</p>
                <p style="color:#0ea5e9;font-size:28px;font-weight:900;margin:0;letter-spacing:2px;">#${numeroSolicitud.toString().toUpperCase()}</p>
              </div>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Guarda este número como referencia. Si tienes alguna duda, contáctanos con él.
              </p>
              <!-- Pasos siguientes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#f8fafc;border-radius:10px;padding:20px;">
                    <p style="color:#0f172a;font-weight:700;margin:0 0 12px;font-size:15px;">¿Qué sigue?</p>
                    <p style="color:#64748b;font-size:14px;margin:0 0 8px;">✅ Revisión de documentos (1-2 días hábiles)</p>
                    <p style="color:#64748b;font-size:14px;margin:0 0 8px;">📞 Contacto de nuestro equipo de instalación</p>
                    <p style="color:#64748b;font-size:14px;margin:0;">🚀 Activación del servicio en tu hogar</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:13px;margin:0;">© ${new Date().getFullYear()} Rapilink SAS — Todos los derechos reservados</p>
              <p style="color:#94a3b8;font-size:12px;margin:6px 0 0;">Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    await transporter.sendMail({
      from: `"Rapilink SAS" <${smtpUser}>`,
      to: correo,
      subject: `Solicitud #${numeroSolicitud} recibida — Rapilink SAS`,
      html,
    })

    return new Response(
      JSON.stringify({ ok: true, message: 'Correo enviado correctamente' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error al enviar correo:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno al enviar el correo' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
