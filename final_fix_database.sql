-- SOLUCIÓN "UNA VEZ POR TODAS" PARA EDUARDO
-- Este script limpia todo y lo configura para que NO dé errores de llaves foráneas.

-- 1. Limpiar todo lo actual (CUIDADO: Borra datos de prueba)
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Perfiles (Simplificado: id es TEXT para que acepte cualquier ID de Supabase sin pelear)
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Sigue siendo UUID porque viene de Auth
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    business_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Categorías (Usamos TEXT para el id para que coincida con '1', '2', '3' de tu app)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Negocios (Cambiamos category_id a TEXT para que no falle con los IDs de tu app)
CREATE TABLE stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_name TEXT,
    category_id TEXT REFERENCES categories(id), -- Ahora coincide con el frontend
    image_url TEXT,
    logo_url TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0,
    delivery_time TEXT DEFAULT '20-30 min',
    phone TEXT,
    whatsapp TEXT,
    description TEXT,
    address TEXT,
    opening_hours TEXT,
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id) -- Un dueño, una tienda
);

-- 5. Insertar TUS categorías exactas (Las que tienes en el código)
INSERT INTO categories (id, name, icon, "order") VALUES 
('1', 'Restaurantes', 'restaurant', 1),
('2', 'Licores', 'liquor', 2),
('3', 'Farmacia', 'medical_services', 3),
('4', 'Panadería', 'bakery_dining', 4),
('5', 'Frutas', 'eco', 5),
('6', 'Construcción', 'construction', 6),
('7', 'Repuestos', 'settings_input_component', 7),
('8', 'Agro', 'agriculture', 8)
ON CONFLICT (id) DO NOTHING;

-- 6. Productos (category_id a TEXT)
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_promo BOOLEAN DEFAULT false,
    rating DECIMAL(2,1) DEFAULT 5.0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Pedidos
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    store_id UUID REFERENCES stores(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivering', 'completed', 'cancelled')),
    total_price DECIMAL(10,2) NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Notificaciones
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Analytics / Leads
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. El TRIGGER "MÁGICO": Crea el perfil solo apenas alguien se registre en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario'), 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
