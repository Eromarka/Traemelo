-- Migración para control de solicitudes y periodo de prueba
-- 1. Asegurar que el estado por defecto sea 'pending'
ALTER TABLE stores ALTER COLUMN status SET DEFAULT 'pending';

-- 2. Agregar campos para periodo de prueba y aprobación
ALTER TABLE stores ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 3. (Opcional) Si quieres que los negocios actuales sigan activos:
UPDATE stores SET status = 'active' WHERE status IS NULL OR status = 'active';

-- Comentario: El periodo de prueba se calculará en el frontend al registrarse (15 días).
