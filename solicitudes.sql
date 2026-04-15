-- ============================================================
-- Tabla: solicitudes
-- Descripción: Registra las solicitudes de servicio de internet
-- ============================================================

CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Datos personales
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER NOT NULL CHECK (edad >= 18),
  correo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_doc TEXT NOT NULL CHECK (tipo_doc IN ('CC', 'CE', 'PPT', 'PTP')),
  numero_doc TEXT NOT NULL,

  -- Información del servicio
  tipo_solicitud TEXT NOT NULL DEFAULT 'Instalación Nueva',
  plan_interesado TEXT,
  corte_facturacion TEXT,
  medio_contacto TEXT,

  -- Ubicación
  direccion TEXT NOT NULL,
  barrio TEXT NOT NULL,
  latitud NUMERIC(10, 7),
  longitud NUMERIC(10, 7),

  -- Archivos (URLs públicas de Supabase Storage — bucket: documentos)
  url_cedula TEXT NOT NULL,
  url_recibo TEXT NOT NULL,
  url_solicitante TEXT NOT NULL,
  url_firma TEXT NOT NULL,

  -- Autorizaciones
  acepta_centrales_riesgo BOOLEAN NOT NULL DEFAULT false,
  acepta_habeas_data BOOLEAN NOT NULL DEFAULT false,

  -- Estado de la solicitud
  estado TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'en_revision', 'aprobada', 'rechazada'))
);

-- ============================================================
-- Row Level Security (RLS)
-- Solo permite INSERT con la anon key; lectura requiere autenticación.
-- ============================================================

ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Permite insertar a cualquier cliente (anon key)
CREATE POLICY "anon_insert" ON solicitudes
  FOR INSERT
  WITH CHECK (true);

-- Solo usuarios autenticados (admin) pueden leer
CREATE POLICY "auth_select" ON solicitudes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Índices útiles para consultas administrativas
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_solicitudes_created_at ON solicitudes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes (estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_correo ON solicitudes (correo);

-- ============================================================
-- MIGRACIÓN: Agregar columnas nuevas a tabla existente
-- Ejecutar en Supabase SQL Editor si la tabla ya existe
-- ============================================================

-- Actualizar constraint de tipo_doc (eliminar el viejo, crear el nuevo)
ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_tipo_doc_check;
ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_tipo_doc_check
  CHECK (tipo_doc IN ('CC', 'CE', 'PPT', 'PTP'));

-- Nuevas columnas de servicio
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS tipo_solicitud TEXT NOT NULL DEFAULT 'Instalación Nueva';
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS plan_interesado TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS corte_facturacion TEXT;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS medio_contacto TEXT;
