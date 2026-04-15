import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Upload, Pen, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabaseClient'
import { generateSolicitudPDF } from '../lib/generateSolicitudPDF'
import { crearTicketSolicitud } from '../lib/crearTicketSolicitud'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface FormData {
  nombre: string
  apellido: string
  edad: string
  correo: string
  telefono: string
  tipoDoc: string
  numeroDoc: string
  direccion: string
  barrio: string
  latitud: string
  longitud: string
  tipoSolicitud: string
  planInteresado: string
  corteFacturacion: string
  medioContacto: string
  aceptaCentrales: boolean
  aceptaHabeasData: boolean
}

interface Archivos {
  cedula: File | null
  recibo: File | null
  solicitante: File | null
}

interface FieldErrors {
  [key: string]: string
}

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const BUCKET = 'documentos'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFileExt(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
}

// ─── Componente de campo de formulario ───────────────────────────────────────

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

const Field: React.FC<FieldProps> = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
)

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 placeholder:text-gray-400'

const inputErrorClass =
  'w-full rounded-xl border border-red-400 bg-red-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 placeholder:text-gray-400'

// ─── Componente FileUpload ────────────────────────────────────────────────────

interface FileUploadProps {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({ label, file, onChange, error }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    if (selected && selected.size > MAX_FILE_BYTES) {
      alert(`El archivo supera los ${MAX_FILE_SIZE_MB} MB permitidos.`)
      e.target.value = ''
      return
    }
    onChange(selected)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 transition
          ${error ? 'border-red-400 bg-red-50' : file ? 'border-brand-action bg-sky-50' : 'border-gray-200 bg-gray-50 hover:border-brand-action hover:bg-sky-50'}`}
      >
        <Upload size={20} className={file ? 'text-brand-action' : 'text-gray-400'} />
        <div className="min-w-0 flex-1">
          {file ? (
            <p className="truncate text-sm font-medium text-brand-action">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Toca para seleccionar <span className="font-medium text-gray-700">imagen</span> (máx. {MAX_FILE_SIZE_MB} MB)
            </p>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = '' }}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Canvas de Firma ──────────────────────────────────────────────────────────

interface SignatureCanvasProps {
  onSignatureChange: (blob: Blob | null) => void
  error?: string
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasSig, setHasSig] = useState(false)

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top }
  }

  const exportBlob = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => onSignatureChange(blob), 'image/png')
  }, [onSignatureChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const startDraw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      drawing.current = true
      const pos = getPos(e, canvas)
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      if (!drawing.current) return
      const pos = getPos(e, canvas)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = '#0ea5e9'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      setHasSig(true)
    }

    const stopDraw = () => {
      if (drawing.current) {
        drawing.current = false
        exportBlob()
      }
    }

    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
    canvas.addEventListener('mouseleave', stopDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)

    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDraw)
      canvas.removeEventListener('mouseleave', stopDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDraw)
    }
  }, [exportBlob])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
    onSignatureChange(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          Firma digital <span className="text-red-500">*</span>
        </label>
        {hasSig && (
          <button type="button" onClick={clearCanvas} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
      <div className={`overflow-hidden rounded-xl border-2 ${error ? 'border-red-400' : hasSig ? 'border-brand-action' : 'border-dashed border-gray-200'}`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full cursor-crosshair bg-gray-50 touch-none"
          style={{ height: '160px' }}
        />
      </div>
      {!hasSig && (
        <p className="flex items-center gap-1 text-xs text-gray-400">
          <Pen size={12} /> Dibuja tu firma en el recuadro de arriba
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  nombre: '',
  apellido: '',
  edad: '',
  correo: '',
  telefono: '',
  tipoDoc: '',
  numeroDoc: '',
  direccion: '',
  barrio: '',
  latitud: '',
  longitud: '',
  tipoSolicitud: '',
  planInteresado: 'FAMILIA 200MB - $89.900',
  corteFacturacion: '',
  medioContacto: '',
  aceptaCentrales: false,
  aceptaHabeasData: false,
}

const Solicitud: React.FC = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [archivos, setArchivos] = useState<Archivos>({ cedula: null, recibo: null, solicitante: null })
  const [firma, setFirma] = useState<Blob | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [solicitudId, setSolicitudId] = useState('')
  const [submitError, setSubmitError] = useState('')

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  // Geolocalización
  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.')
      return
    }
    setGeoLoading(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitud: pos.coords.latitude.toFixed(7),
          longitud: pos.coords.longitude.toFixed(7),
        }))
        setErrors((prev) => ({ ...prev, latitud: '', longitud: '' }))
        setGeoLoading(false)
      },
      (err) => {
        setGeoError(`Error de geolocalización: ${err.message}`)
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Validación
  const validate = (): boolean => {
    const e: FieldErrors = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.apellido.trim()) e.apellido = 'Requerido'
    const edad = parseInt(form.edad)
    if (!form.edad || isNaN(edad)) e.edad = 'Requerido'
    else if (edad < 18) e.edad = 'Debes ser mayor de 18 años'
    if (!form.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = 'Correo inválido'
    if (!form.telefono.trim() || !/^\d{7,15}$/.test(form.telefono.replace(/\s/g, ''))) e.telefono = 'Teléfono inválido'
    if (!form.tipoDoc) e.tipoDoc = 'Selecciona un tipo'
    if (!form.numeroDoc.trim()) e.numeroDoc = 'Requerido'
    if (!form.tipoSolicitud) e.tipoSolicitud = 'Selecciona un tipo de solicitud'
    if (!form.planInteresado) e.planInteresado = 'Selecciona un plan'
    if (!form.corteFacturacion) e.corteFacturacion = 'Selecciona una fecha de corte'
    if (!form.medioContacto) e.medioContacto = 'Selecciona cómo te enteraste'
    if (!form.direccion.trim()) e.direccion = 'Requerido'
    if (!form.barrio.trim()) e.barrio = 'Requerido'
    if (!form.latitud || !form.longitud) e.latitud = 'Obtén tu ubicación primero'
    if (!archivos.cedula) e.cedula = 'Requerido'
    if (!archivos.recibo) e.recibo = 'Requerido'
    if (!archivos.solicitante) e.solicitante = 'Requerido'
    if (!firma) e.firma = 'La firma es obligatoria'
    if (!form.aceptaCentrales) e.aceptaCentrales = 'Debes aceptar para continuar'
    if (!form.aceptaHabeasData) e.aceptaHabeasData = 'Debes aceptar para continuar'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Subida atómica de archivos
  const uploadFiles = async (uuid: string): Promise<{ urls: Record<string, string>; paths: string[] }> => {
    const uploads: Array<{ key: string; path: string; file: File | Blob; contentType: string }> = [
      { key: 'url_cedula', path: `${uuid}/cedula.${getFileExt(archivos.cedula!)}`, file: archivos.cedula!, contentType: archivos.cedula!.type },
      { key: 'url_recibo', path: `${uuid}/recibo.${getFileExt(archivos.recibo!)}`, file: archivos.recibo!, contentType: archivos.recibo!.type },
      { key: 'url_solicitante', path: `${uuid}/solicitante.${getFileExt(archivos.solicitante!)}`, file: archivos.solicitante!, contentType: archivos.solicitante!.type },
      { key: 'url_firma', path: `${uuid}/firma.png`, file: firma!, contentType: 'image/png' },
    ]

    const uploadedPaths: string[] = []
    const urls: Record<string, string> = {}

    for (const u of uploads) {
      const { error } = await supabase.storage.from(BUCKET).upload(u.path, u.file, { contentType: u.contentType })
      if (error) {
        // Rollback: eliminar los ya subidos
        if (uploadedPaths.length > 0) {
          await supabase.storage.from(BUCKET).remove(uploadedPaths)
        }
        throw new Error(`Error subiendo ${u.key}: ${error.message}`)
      }
      uploadedPaths.push(u.path)
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(u.path)
      urls[u.key] = pub.publicUrl
    }

    return { urls, paths: uploadedPaths }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setSubmitError('')
    const uuid = crypto.randomUUID()

    try {
      // 1. Subir archivos (atómico)
      const { urls, paths } = await uploadFiles(uuid)

      // 2. Insertar en DB
      const { error: dbError } = await supabase.from('solicitudes').insert({
        id: uuid,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: parseInt(form.edad),
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        tipo_doc: form.tipoDoc,
        numero_doc: form.numeroDoc.trim(),
        tipo_solicitud: form.tipoSolicitud,
        plan_interesado: form.planInteresado,
        corte_facturacion: form.corteFacturacion,
        medio_contacto: form.medioContacto,
        direccion: form.direccion.trim(),
        barrio: form.barrio.trim(),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        ...urls,
        acepta_centrales_riesgo: form.aceptaCentrales,
        acepta_habeas_data: form.aceptaHabeasData,
      })

      if (dbError) {
        // Rollback archivos
        await supabase.storage.from(BUCKET).remove(paths)
        throw new Error(`Error guardando solicitud: ${dbError.message}`)
      }

      // Obtener número secuencial vía RPC (evita requerir SELECT en RLS anon)
      const { data: numeroData } = await supabase.rpc('get_solicitud_numero', { solicitud_id: uuid })
      const shortId = String(numeroData ?? 0).padStart(6, '0')

      // 3. Generar PDF corporativo y subirlo a Storage
      let urlPdf = ''
      try {
        const pdfBlob = await generateSolicitudPDF({
          solicitudId: shortId,
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          edad: form.edad,
          correo: form.correo.trim().toLowerCase(),
          telefono: form.telefono.trim(),
          tipoDoc: form.tipoDoc,
          numeroDoc: form.numeroDoc.trim(),
          tipoSolicitud: form.tipoSolicitud,
          planInteresado: form.planInteresado,
          corteFacturacion: form.corteFacturacion,
          medioContacto: form.medioContacto,
          direccion: form.direccion.trim(),
          barrio: form.barrio.trim(),
          latitud: form.latitud,
          longitud: form.longitud,
          aceptaCentrales: form.aceptaCentrales,
          aceptaHabeasData: form.aceptaHabeasData,
          urlCedula: urls.url_cedula,
          urlRecibo: urls.url_recibo,
          urlSolicitante: urls.url_solicitante,
          urlFirma: urls.url_firma,
        })
        const pdfPath = `${uuid}/solicitud.pdf`
        await supabase.storage.from(BUCKET).upload(pdfPath, pdfBlob, { contentType: 'application/pdf' })
        const { data: pdfPub } = supabase.storage.from(BUCKET).getPublicUrl(pdfPath)
        urlPdf = pdfPub.publicUrl
      } catch {
        console.warn('No se pudo generar o subir el PDF, pero la solicitud fue guardada.')
      }

      // 4. Crear ticket en WispHub vía N8N — cliente nuevo sin ID previo
      try {
        const descripcionTicket =
          `${form.tipoSolicitud} — ${form.nombre.trim()} ${form.apellido.trim()} | ` +
          `Tel: ${form.telefono.trim()} | ${form.correo.trim().toLowerCase()} | ` +
          `${form.direccion.trim()}, ${form.barrio.trim()} | ` +
          `GPS: ${form.latitud}, ${form.longitud} | ` +
          `Doc: ${form.tipoDoc} ${form.numeroDoc.trim()} | ` +
          `Plan: ${form.planInteresado} | Corte: ${form.corteFacturacion} | ` +
          `Medio: ${form.medioContacto} | Solicitud N° ${shortId}` +
          (urlPdf ? ` | PDF: ${urlPdf}` : '')
        await crearTicketSolicitud({
          asunto: form.tipoSolicitud,
          descripcion: descripcionTicket,
          nombre: `${form.nombre.trim()} ${form.apellido.trim()}`,
          correo: form.correo.trim().toLowerCase(),
          cedula: form.numeroDoc.trim(),
          direccion: form.direccion.trim(),
          barrio: form.barrio.trim(),
          telefono: form.telefono.trim(),
          urlPdf,
        })
      } catch {
        console.warn('No se pudo crear el ticket, pero la solicitud fue guardada.')
      }

      // 5. Enviar correo de confirmación vía N8N (no hace rollback si falla)
      try {
        await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_BASE}/solicitud-confirmacion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            correo: form.correo.trim().toLowerCase(),
            numeroSolicitud: shortId,
          }),
        })
      } catch {
        console.warn('El correo no pudo enviarse, pero la solicitud fue guardada.')
      }

      setSolicitudId(shortId)
      setSubmitStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error desconocido')
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Éxito ──
  if (submitStatus === 'success') {
    return (
      <Layout>
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl shadow-brand-dark/5"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="mb-2 text-3xl font-black text-brand-dark">¡Solicitud enviada!</h2>
            <p className="mb-6 text-gray-500">Tu solicitud fue recibida correctamente. Pronto nos contactaremos contigo.</p>
            <div className="mb-8 rounded-2xl bg-sky-50 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Número de solicitud</p>
              <p className="mt-1 text-3xl font-black tracking-widest text-brand-action">#{solicitudId}</p>
            </div>
            <p className="text-sm text-gray-400">Revisa tu correo electrónico para la confirmación. Guarda este número como referencia.</p>
            <button
              onClick={() => { setSubmitStatus('idle'); setForm(INITIAL_FORM); setArchivos({ cedula: null, recibo: null, solicitante: null }); setFirma(null) }}
              className="mt-8 rounded-xl bg-brand-action px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Nueva solicitud
            </button>
          </motion.div>
        </section>
      </Layout>
    )
  }

  // ── Formulario ──
  return (
    <Layout>
      <section className="bg-gray-50 pt-28 pb-20 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Cabecera */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-3">
              Solicitud de Servicio
            </h1>
            <p className="text-lg text-gray-500">Completa el formulario para solicitar tu conexión a internet de fibra óptica + TV</p>
            <div className="mx-auto mt-5 h-1.5 w-20 rounded-full bg-brand-action" />
          </motion.div>

          {/* Error global */}
          <AnimatePresence>
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">Error al enviar la solicitud</p>
                  <p className="text-sm text-red-500">{submitError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8"
          >


            {/* ── 1. Datos personales ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">1</span>
                Datos Personales
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Nombre" required error={errors.nombre}>
                  <input className={errors.nombre ? inputErrorClass : inputClass} value={form.nombre} onChange={set('nombre')} placeholder="Ej. María" />
                </Field>
                <Field label="Apellido" required error={errors.apellido}>
                  <input className={errors.apellido ? inputErrorClass : inputClass} value={form.apellido} onChange={set('apellido')} placeholder="Ej. González" />
                </Field>
                <Field label="Edad" required error={errors.edad}>
                  <input type="number" min={18} className={errors.edad ? inputErrorClass : inputClass} value={form.edad} onChange={set('edad')} placeholder="Mínimo 18 años" />
                </Field>
                <Field label="Correo electrónico" required error={errors.correo}>
                  <input type="email" className={errors.correo ? inputErrorClass : inputClass} value={form.correo} onChange={set('correo')} placeholder="ejemplo@correo.com" />
                </Field>
                <Field label="Teléfono / Celular" required error={errors.telefono}>
                  <input type="tel" className={errors.telefono ? inputErrorClass : inputClass} value={form.telefono} onChange={set('telefono')} placeholder="Ej. 3001234567" />
                </Field>
                <Field label="Tipo de documento" required error={errors.tipoDoc}>
                  <select className={errors.tipoDoc ? inputErrorClass : inputClass} value={form.tipoDoc} onChange={set('tipoDoc')}>
                    <option value="">Selecciona una opción</option>
                    <option value="CC">Cedula de Ciudadania</option>
                    <option value="PPT">Permiso de Permanencia temporal</option>
                    <option value="PTP">Permiso de Protección Temporal</option>
                    <option value="CE">Cedula Extranjera</option>
                  </select>
                </Field>
                <Field label="Número de documento" required error={errors.numeroDoc}>
                  <input className={errors.numeroDoc ? inputErrorClass : inputClass} value={form.numeroDoc} onChange={set('numeroDoc')} placeholder="Ej. 1234567890" />
                </Field>
              </div>
            </div>

            {/* ── 2. Información del Servicio ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">2</span>
                Información del Servicio
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Tipo de solicitud" required error={errors.tipoSolicitud}>
                  <select className={errors.tipoSolicitud ? inputErrorClass : inputClass} value={form.tipoSolicitud} onChange={set('tipoSolicitud')}>
                    <option value="">Selecciona una opción</option>
                    <option value="Instalacion Nueva">Instalación Nueva</option>
                    <option value="Reconexion">Reconexión</option>
                    <option value="Cambio De Titular">Cambio de Titular</option>
                  </select>
                </Field>
                <div>
                  <Field label="Plan interesado" required error={errors.planInteresado}>
                    <select className={errors.planInteresado ? inputErrorClass : inputClass} value={form.planInteresado} onChange={set('planInteresado')}>
                      <option value="ELITE 700MB - $199.900">ELITE — 700 MB · $199.900/mes</option>
                      <option value="ULTRA 500MB - $159.900">ULTRA — 500 MB · $159.900/mes</option>
                      <option value="FAMILIA 200MB - $89.900">⭐ FAMILIA — 200 MB · $89.900/mes (Recomendado)</option>
                      <option value="HOGAR 100MB - $69.900">HOGAR — 100 MB · $69.900/mes</option>
                    </select>
                  </Field>
                  <p className="mt-1 text-xs text-sky-600">El plan FAMILIA es el más elegido por nuestros clientes nuevos — velocidad ideal para el hogar a un precio accesible.</p>
                </div>
                <Field label="Fecha de corte de facturación" required error={errors.corteFacturacion}>
                  <select className={errors.corteFacturacion ? inputErrorClass : inputClass} value={form.corteFacturacion} onChange={set('corteFacturacion')}>
                    <option value="">Selecciona una opción</option>
                    <option value="CORTE 15">CORTE 15</option>
                    <option value="CORTE 30">CORTE 30</option>
                  </select>
                </Field>
                <Field label="¿Cómo se enteró del servicio?" required error={errors.medioContacto}>
                  <select className={errors.medioContacto ? inputErrorClass : inputClass} value={form.medioContacto} onChange={set('medioContacto')}>
                    <option value="">Selecciona una opción</option>
                    <option value="RECOMENDACION DE UN VECINO O AMIGO">Recomendación de un vecino o amigo</option>
                    <option value="ASESORA DE VENTAS">Asesora de ventas</option>
                    <option value="TECNICO">Técnico</option>
                    <option value="REDES SOCIALES">Redes sociales</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* ── 3. Ubicación ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">3</span>
                Ubicación
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Dirección completa" required error={errors.direccion}>
                    <input className={errors.direccion ? inputErrorClass : inputClass} value={form.direccion} onChange={set('direccion')} placeholder="Ej. Calle 45 # 23-10, Casa 3" />
                  </Field>
                </div>
                <Field label="Barrio" required error={errors.barrio}>
                  <input className={errors.barrio ? inputErrorClass : inputClass} value={form.barrio} onChange={set('barrio')} placeholder="Ej. Renacer" />
                </Field>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Coordenadas GPS <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={geoLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-action px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 active:scale-95 transition disabled:opacity-60"
                  >
                    {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                    {geoLoading ? 'Obteniendo...' : 'Obtener mi ubicación'}
                  </button>
                  {geoError && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{geoError}</p>}
                  {errors.latitud && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.latitud}</p>}
                </div>
                {form.latitud && form.longitud && (
                  <div className="sm:col-span-2 flex gap-3">
                    <div className="flex-1 rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 text-sm">
                      <span className="text-xs text-sky-500 font-semibold block">Latitud</span>
                      <span className="font-mono text-sky-800">{form.latitud}</span>
                    </div>
                    <div className="flex-1 rounded-xl bg-sky-50 border border-sky-200 px-4 py-3 text-sm">
                      <span className="text-xs text-sky-500 font-semibold block">Longitud</span>
                      <span className="font-mono text-sky-800">{form.longitud}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── 4. Documentos ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">4</span>
                Documentos fotográficos
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <FileUpload
                  label="Foto de la cédula"
                  file={archivos.cedula}
                  onChange={(f) => { setArchivos((p) => ({ ...p, cedula: f })); setErrors((e) => ({ ...e, cedula: '' })) }}
                  error={errors.cedula}
                />
                <FileUpload
                  label="Foto del recibo de agua/luz"
                  file={archivos.recibo}
                  onChange={(f) => { setArchivos((p) => ({ ...p, recibo: f })); setErrors((e) => ({ ...e, recibo: '' })) }}
                  error={errors.recibo}
                />
                <FileUpload
                  label="Foto del solicitante"
                  file={archivos.solicitante}
                  onChange={(f) => { setArchivos((p) => ({ ...p, solicitante: f })); setErrors((e) => ({ ...e, solicitante: '' })) }}
                  error={errors.solicitante}
                />
              </div>
            </div>

            {/* ── 5. Firma ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">5</span>
                Firma digital
              </h2>
              <SignatureCanvas
                onSignatureChange={(blob) => { setFirma(blob); setErrors((e) => ({ ...e, firma: '' })) }}
                error={errors.firma}
              />
            </div>

            {/* ── 6. Autorizaciones ── */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="mb-6 text-lg font-bold text-brand-dark flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-action text-xs font-black text-white">6</span>
                Autorizaciones y consentimientos
              </h2>
              <div className="space-y-4">
                {/* Centrales de Riesgo */}
                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition
                  ${errors.aceptaCentrales ? 'border-red-400 bg-red-50' : form.aceptaCentrales ? 'border-brand-action bg-sky-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-brand-action"
                    checked={form.aceptaCentrales}
                    onChange={set('aceptaCentrales')}
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">Autorización Centrales de Riesgo:</strong> Autorizo a Rapilink SAS a consultar, reportar y actualizar mi información en las bases de datos de centrales de riesgo crediticio (DataCrédito, TransUnion, etc.) conforme a la Ley 1266 de 2008.
                  </span>
                </label>
                {errors.aceptaCentrales && (
                  <p className="flex items-center gap-1 text-xs text-red-500 -mt-2 ml-2">
                    <AlertCircle size={12} /> {errors.aceptaCentrales}
                  </p>
                )}

                {/* Habeas Data */}
                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition
                  ${errors.aceptaHabeasData ? 'border-red-400 bg-red-50' : form.aceptaHabeasData ? 'border-brand-action bg-sky-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-brand-action"
                    checked={form.aceptaHabeasData}
                    onChange={set('aceptaHabeasData')}
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">Habeas Data — Ley 1581 de 2012:</strong> Autorizo el tratamiento de mis datos personales por parte de Rapilink SAS para las finalidades descritas en su Política de Privacidad, incluyendo la prestación del servicio y el envío de comunicaciones relacionadas.
                  </span>
                </label>
                {errors.aceptaHabeasData && (
                  <p className="flex items-center gap-1 text-xs text-red-500 -mt-2 ml-2">
                    <AlertCircle size={12} /> {errors.aceptaHabeasData}
                  </p>
                )}
              </div>
            </div>

            {/* ── Botón de envío ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-brand-action py-5 text-lg font-black text-white shadow-lg shadow-brand-action/30 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Enviando solicitud...
                </>
              ) : (
                'Enviar mi solicitud'
              )}
            </button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>🔒</span> Tu información está protegida bajo la Ley 1581 de 2012 · Te contactamos a la brevedad posible
            </p>

          </motion.form>
        </div>
      </section>
    </Layout>
  )
}

export default Solicitud
