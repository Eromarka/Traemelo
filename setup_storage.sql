-- EJECUTA ESTO EN EL SQL EDITOR DE SUPABASE PARA ACTIVAR LAS FOTOS

-- 1. Crear buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('stores', 'stores', true),
  ('profiles', 'profiles', true),
  ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Lectura (Público)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Stores') THEN
        CREATE POLICY "Public Access Stores" ON storage.objects FOR SELECT USING (bucket_id = 'stores');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Profiles') THEN
        CREATE POLICY "Public Access Profiles" ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Products') THEN
        CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
    END IF;
END $$;

-- 3. Políticas de Subida (Usuarios registrados)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Upload Stores') THEN
        CREATE POLICY "Auth Upload Stores" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stores' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Upload Profiles') THEN
        CREATE POLICY "Auth Upload Profiles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Upload Products') THEN
        CREATE POLICY "Auth Upload Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- 4. Políticas de Actualización
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Update Stores') THEN
        CREATE POLICY "Auth Update Stores" ON storage.objects FOR UPDATE USING (bucket_id = 'stores' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Update Profiles') THEN
        CREATE POLICY "Auth Update Profiles" ON storage.objects FOR UPDATE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth Update Products') THEN
        CREATE POLICY "Auth Update Products" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
    END IF;
END $$;
