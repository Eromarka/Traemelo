# 🗺️ ROADMAP FASE 2 — Traemelo
**Última actualización:** 11 de Marzo 2026, 3:20 AM
**Enfoque:** Directorio Comercial Premium + Servicio Concierge "Te lo llevamos"

---

## ✅ COMPLETADO (Esta sesión — 10 Mar)

- [x] **Build sin errores** — `addToCart` corregido en `Concierge.tsx` (era `addItem`, nombre incorrecto)
- [x] **Mensaje WhatsApp dinámico** en `Checkout.tsx` — lista productos, subtotal, comisión y total
- [x] **Hook `useAnalytics`** — registra clics (call/whatsapp/view) en tabla `leads` de Supabase
- [x] **Hook `useBusinesses`** — conecta el Directorio a Supabase con fallback a datos locales
- [x] **Hook `useCategories`** — conecta categorías a Supabase con fallback a datos locales
- [x] **`BusinessDirectory.tsx`** — usa hooks reales, spinner de carga, filtro compatible Supabase+local
- [x] **`SearchResults.tsx`** — usa `useBusinesses` y `useCategories` en lugar de datos hardcodeados
- [x] **`database_schema.sql`** actualizado — tablas: `categories`, `stores`, `products`, `orders`, `leads`
- [x] **Catálogo Concierge** — 20+ productos en `localData.ts` (carnes, harinas, bebidas, construcción, farmacia)
- [x] **Métodos de pago** en `Concierge.tsx`: Zelle, Pago Móvil, Binance USDT, Efectivo, Transferencia

---

## 🔴 PENDIENTE — PRÓXIMAS TAREAS (en orden de prioridad)

- [x] **👤 Perfil Real con Clerk** — Muestra foto, nombre y email reales con botón logout funcional. Avatar en BottomNav corregido. Redirección protegida.
- [x] **🏪 Registro de Negocios B2B** — Formulario 3 pasos, banner en Home, conexión a Supabase y WhatsApp (+584247810500).
- [x] **🛍️ Catálogo Concierge — Arreglar Filtro Vacío** — Ahora usa `useCategories` y muestra todos los productos del catálogo.
- [x] **⚡ Optimización de Bundle** — Lazy loading y manualChunks en Vite están listos y redujeron el peso del JS principal.
- [x] **🔔 Notificaciones Reales** — Conectado a tabla `orders` en Supabase con actualizaciones en tiempo real y fallback de interfaz.
- [x] **📦 Historial de Pedidos Real** — Leer de `orders` filtrado por `user_id` listo en `Orders.tsx` y vinculado al Perfil.
- En `Concierge.tsx` línea 22: filtra por `store_name === 'Traemelo Concierge'`
- Los productos de `localData.ts` NO tienen ese `store_name` → catálogo vacío en pantalla
- **Fix:** Cambiar lógica del filtro para mostrar todos los productos locales,
  o añadir el campo `store_name: 'Traemelo Concierge'` a cada producto en `localData.ts`
- **Archivo:** `src/pages/Concierge.tsx` línea 22 + `src/data/localData.ts`

### 4. ⚡ Optimización de Bundle (Antes de lanzar)
- JS bundle pesa **696 KB** (warning en build)
- Implementar lazy loading con `React.lazy()` para rutas pesadas
- Separar chunks en `vite.config.ts` con `manualChunks`
- **Archivo:** `vite.config.ts`

### 5. 🔔 Notificaciones Reales
- Página `Notifications.tsx` tiene datos de ejemplo hardcodeados
- Conectar a tabla `orders` de Supabase para mostrar estado real de pedidos
- **Archivo:** `src/pages/Notifications.tsx`

### 6. 📦 Historial de Pedidos Real
- `Orders.tsx` muestra pedidos de ejemplo
- Leer de tabla `orders` filtrado por `user_id` del usuario Clerk logueado
- **Archivo:** `src/pages/Orders.tsx`

---

## 🧩 ARQUITECTURA ACTUAL

```
src/
├── pages/
│   ├── Home.tsx           ✅ Conectado
│   ├── BusinessDirectory  ✅ Conectado a Supabase
│   ├── SearchResults.tsx  ✅ Conectado a Supabase
│   ├── Concierge.tsx      ⚠️  Catálogo vacío (ver Tarea 3)
│   ├── Checkout.tsx       ✅ WhatsApp dinámico
│   ├── Cart.tsx           ✅ Funcional
│   ├── Profile.tsx        ✅ Datos reales de Clerk + Auth
│   ├── Orders.tsx         ✅ Conectado a Supabase
│   └── Notifications.tsx  ✅ Conectado a Supabase + DB Real
├── hooks/
│   ├── useProducts.ts     ✅ Supabase + fallback
│   ├── useBusinesses.ts   ✅ Supabase + fallback
│   ├── useCategories.ts   ✅ Supabase + fallback
│   └── useAnalytics.ts    ✅ Registra leads
└── store/
    └── useCartStore.ts    ✅ Zustand (addToCart, getTotal, clearCart)
```

---

## 💳 MÉTODOS DE PAGO CONFIRMADOS
1. **Zelle** — USD sin comisión
2. **Pago Móvil** — Bolívares a tasa BCV
3. **Binance Pay (USDT)** — Cripto estable 1:1
4. **Efectivo** — USD o Bs al recibir
5. **Transferencia** — Banesco o Mercantil

---

## 📞 CONTACTO WHATSAPP NEGOCIO
- Número actual en código: `+`
- **Cambiar antes de lanzar** por el número real en `Checkout.tsx` y `BusinessDirectory.tsx`

---

## 🗣️ CÓMO RECUPERAR EL CONTEXTO SI SE CORTA
Si trabajas con una nueva sesión, di:
> **"Lee el archivo ROADMAP_FASE2.md y continúa por la tarea pendiente más prioritaria"**

Y el asistente sabrá exactamente dónde estamos.
