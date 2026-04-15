import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Descarga una URL y la comprime/redimensiona en un canvas antes de devolver JPEG base64 */
async function urlToCompressedBase64(
  url: string,
  maxWidth = 900,
  quality = 0.7,
  background: string | null = null
): Promise<string | null> {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const bitmap = await createImageBitmap(blob)

    const scale = Math.min(1, maxWidth / bitmap.width)
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, w, h)
    }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    return canvas.toDataURL('image/jpeg', quality)
  } catch {
    return null
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

function imgType(_base64: string): 'JPEG' {
  return 'JPEG'
}

// ─── Colores corporativos ─────────────────────────────────────────────────────
const BLUE_DARK = [10, 36, 99] as [number, number, number]
const BLUE_MID  = [14, 165, 233] as [number, number, number]
const BLUE_LIGHT= [240, 249, 255] as [number, number, number]
const GRAY_TEXT = [71, 85, 105] as [number, number, number]
const WHITE     = [255, 255, 255] as [number, number, number]

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface SolicitudPDFData {
  solicitudId: string
  nombre: string
  apellido: string
  edad: string
  correo: string
  telefono: string
  tipoDoc: string
  numeroDoc: string
  tipoSolicitud: string
  planInteresado: string
  corteFacturacion: string
  medioContacto: string
  direccion: string
  barrio: string
  latitud: string
  longitud: string
  aceptaCentrales: boolean
  aceptaHabeasData: boolean
  urlCedula: string
  urlRecibo: string
  urlSolicitante: string
  urlFirma: string
}

// ─── Generador principal ──────────────────────────────────────────────────────

export async function generateSolicitudPDF(data: SolicitudPDFData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const PW = doc.internal.pageSize.getWidth()
  const PH = doc.internal.pageSize.getHeight()
  const MARGIN = 15
  const CONTENT_W = PW - MARGIN * 2
  let y = 0

  // ── Logo blanco sobre fondo oscuro — background = azul del header ────────
  const logoBase64 = await urlToCompressedBase64('/recursos/LOGO RAPILINK S BLANCO.png', 600, 0.9, 'rgb(10, 36, 99)')

  // ── Imágenes del formulario (comprimidas a JPEG 70%) ─────────────────────
  const [imgCedula, imgRecibo, imgSolicitante, imgFirma] = await Promise.all([
    urlToCompressedBase64(data.urlCedula, 900, 0.7),
    urlToCompressedBase64(data.urlRecibo, 900, 0.7),
    urlToCompressedBase64(data.urlSolicitante, 900, 0.7),
    urlToCompressedBase64(data.urlFirma, 600, 0.8, '#ffffff'),
  ])

  // ═══════════════════════════════════════════════════════════════════════════
  // ENCABEZADO
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...BLUE_DARK)
  doc.rect(0, 0, PW, 38, 'F')

  // Franja azul claro inferior del header
  doc.setFillColor(...BLUE_MID)
  doc.rect(0, 33, PW, 5, 'F')

  // Logo
  if (logoBase64) {
    doc.addImage(logoBase64, imgType(logoBase64), MARGIN, 6, 42, 22)
  } else {
    doc.setTextColor(...WHITE)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Rapilink SAS', MARGIN, 20)
  }

  // Título
  doc.setTextColor(...WHITE)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('SOLICITUD DE SERVICIO DE INTERNET', PW - MARGIN, 15, { align: 'right' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`N° ${data.solicitudId}  |  ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}`, PW - MARGIN, 22, { align: 'right' })

  y = 46

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: DATOS PERSONALES
  // ═══════════════════════════════════════════════════════════════════════════
  const sectionHeader = (title: string) => {
    doc.setFillColor(...BLUE_MID)
    doc.roundedRect(MARGIN, y, CONTENT_W, 7, 2, 2, 'F')
    doc.setTextColor(...WHITE)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(title.toUpperCase(), MARGIN + 3, y + 5)
    y += 9
  }

  sectionHeader('1. Datos Personales')

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: CONTENT_W,
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: GRAY_TEXT },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: [
      ['Nombre', data.nombre, 'Apellido', data.apellido],
      ['Edad', `${data.edad} años`, 'Correo electrónico', data.correo],
      ['Teléfono', data.telefono, 'Tipo de documento', data.tipoDoc],
      ['Número de documento', data.numeroDoc, '', ''],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
      2: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
    },
  })
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: INFORMACIÓN DEL SERVICIO
  // ═══════════════════════════════════════════════════════════════════════════
  sectionHeader('2. Información del Servicio')

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: CONTENT_W,
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: GRAY_TEXT },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: [
      ['Tipo de solicitud', data.tipoSolicitud, 'Plan interesado', data.planInteresado],
      ['Corte de facturación', data.corteFacturacion, 'Medio de contacto', data.medioContacto],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
      2: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
    },
  })
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: UBICACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  sectionHeader('3. Ubicación')

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: CONTENT_W,
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: GRAY_TEXT },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: [
      ['Dirección', data.direccion, 'Barrio', data.barrio],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
      2: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
    },
  })
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: OZMAP
  // ═══════════════════════════════════════════════════════════════════════════
  sectionHeader('4. OZMAP')

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: CONTENT_W,
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: GRAY_TEXT },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: [
      ['OZMAP', `${data.latitud},${data.longitud}`],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: BLUE_LIGHT, textColor: BLUE_DARK, cellWidth: 38 },
    },
  })
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: DOCUMENTOS FOTOGRÁFICOS
  // ═══════════════════════════════════════════════════════════════════════════
  sectionHeader('5. Documentos Fotográficos')

  const IMG_W = (CONTENT_W - 8) / 3
  const IMG_H = 42
  const labels = ['Foto Cédula', 'Foto Recibo', 'Foto Solicitante']
  const imgs = [imgCedula, imgRecibo, imgSolicitante]

  // Verificar si hay espacio suficiente en la página
  if (y + IMG_H + 10 > PH - 20) {
    doc.addPage()
    y = 15
  }

  imgs.forEach((img, i) => {
    const x = MARGIN + i * (IMG_W + 4)
    // Marco
    doc.setFillColor(...BLUE_LIGHT)
    doc.setDrawColor(...BLUE_MID)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, IMG_W, IMG_H + 7, 2, 2, 'FD')
    // Etiqueta
    doc.setTextColor(...BLUE_DARK)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.text(labels[i], x + IMG_W / 2, y + 4.5, { align: 'center' })
    // Imagen
    if (img) {
      try {
        doc.addImage(img, imgType(img), x + 1, y + 6, IMG_W - 2, IMG_H - 1)
      } catch {
        doc.setTextColor(...GRAY_TEXT)
        doc.setFontSize(7)
        doc.text('Imagen no disponible', x + IMG_W / 2, y + IMG_H / 2 + 6, { align: 'center' })
      }
    } else {
      doc.setTextColor(...GRAY_TEXT)
      doc.setFontSize(7)
      doc.text('Imagen no disponible', x + IMG_W / 2, y + IMG_H / 2 + 6, { align: 'center' })
    }
  })
  y += IMG_H + 12

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: FIRMA DIGITAL
  // ═══════════════════════════════════════════════════════════════════════════
  sectionHeader('6. Firma Digital del Solicitante')

  const SIG_W = 90
  const SIG_H = 30

  if (y + SIG_H + 10 > PH - 20) {
    doc.addPage()
    y = 15
  }

  doc.setFillColor(...BLUE_LIGHT)
  doc.setDrawColor(...BLUE_MID)
  doc.setLineWidth(0.3)
  doc.roundedRect(MARGIN, y, SIG_W, SIG_H + 6, 2, 2, 'FD')

  if (imgFirma) {
    try {
      doc.addImage(imgFirma, imgType(imgFirma), MARGIN + 1, y + 1, SIG_W - 2, SIG_H + 3)
    } catch {
      doc.setTextColor(...GRAY_TEXT)
      doc.setFontSize(8)
      doc.text('Firma no disponible', MARGIN + SIG_W / 2, y + SIG_H / 2, { align: 'center' })
    }
  }

  // Bloque de firma centrado verticalmente junto a la caja (caja: y → y+36, centro: y+18)
  const lineX = MARGIN + SIG_W + 10
  const lineW = CONTENT_W - SIG_W - 10
  doc.setDrawColor(...BLUE_MID)
  doc.setLineWidth(0.5)
  doc.line(lineX, y + 12, lineX + lineW, y + 12)
  doc.setTextColor(...GRAY_TEXT)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text('Firma del Solicitante', lineX + lineW / 2, y + 16, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text(`${data.nombre} ${data.apellido}`, lineX + lineW / 2, y + 20, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text(`${data.tipoDoc} ${data.numeroDoc}`, lineX + lineW / 2, y + 24, { align: 'center' })

  y += SIG_H + 22

  // ═══════════════════════════════════════════════════════════════════════════
  // SECCIÓN: AUTORIZACIONES
  // ═══════════════════════════════════════════════════════════════════════════
  if (y + 28 > PH - 20) {
    doc.addPage()
    y = 15
  }

  sectionHeader('7. Autorizaciones y Consentimientos')

  const checkMark = (checked: boolean, label: string, desc: string, yPos: number) => {
    doc.setFillColor(checked ? 14 : 200, checked ? 165 : 200, checked ? 233 : 200)
    doc.roundedRect(MARGIN, yPos, 5, 5, 1, 1, 'F')
    doc.setTextColor(...WHITE)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(checked ? '✓' : '✗', MARGIN + 2.5, yPos + 3.8, { align: 'center' })
    doc.setTextColor(...BLUE_DARK)
    doc.setFontSize(8)
    doc.text(label, MARGIN + 7, yPos + 3.8)
    doc.setTextColor(...GRAY_TEXT)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(desc, CONTENT_W - 8)
    doc.text(lines, MARGIN + 7, yPos + 7.5)
  }

  checkMark(
    data.aceptaCentrales,
    'Autorización Centrales de Riesgo (Ley 1266 de 2008)',
    'Autoriza a Rapilink SAS a consultar, reportar y actualizar su información en las bases de datos de centrales de riesgo crediticio.',
    y
  )
  y += 16

  checkMark(
    data.aceptaHabeasData,
    'Habeas Data — Tratamiento de datos personales (Ley 1581 de 2012)',
    'Autoriza el tratamiento de sus datos personales por parte de Rapilink SAS para las finalidades descritas en su Política de Privacidad.',
    y
  )
  y += 16

  // ═══════════════════════════════════════════════════════════════════════════
  // PIE DE PÁGINA en todas las páginas
  // ═══════════════════════════════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFillColor(...BLUE_DARK)
    doc.rect(0, PH - 12, PW, 12, 'F')
    doc.setTextColor(...WHITE)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Rapilink SAS — Siempre Conectados', MARGIN, PH - 5)
    doc.text(
      `Página ${p} de ${totalPages}  |  Solicitud N° ${data.solicitudId}  |  ${new Date().toLocaleDateString('es-CO')}`,
      PW - MARGIN,
      PH - 5,
      { align: 'right' }
    )
  }

  return doc.output('blob')
}

// ─── Convierte Blob a base64 (util exportado) ─────────────────────────────────
export { blobToBase64 }
