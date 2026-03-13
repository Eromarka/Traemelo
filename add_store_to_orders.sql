-- Ejecuta este comando en el SQL Editor de Supabase
-- para añadir la columna store_id a la tabla de pedidos y que las estadísticas funcionen 100%.

ALTER TABLE orders ADD COLUMN store_id UUID REFERENCES stores(id);
