# Plan de Migración a Supabase Auth y Roles

Este documento guarda el plan acordado en caso de corte de energía, para migrar la autenticación de Clerk a Supabase Auth y manejar los roles de Usuario vs Comercio.

## Arquitectura de Login Dual (Usuarios vs Comercios)
Implementaremos **Un Solo Sistema de Auth, con Enrutamiento Basado en Roles**.

### 1. Tabla de Perfiles (`profiles`)
Todos los usuarios (clientes o comercios) que se registran crearán una fila en una tabla de tu base de datos que podemos llamar `profiles`.
Tendrán una columna `role` (con valores asignados, por ejemplo: `user` o `merchant`).

### 2. Flujo de Acceso Inteligente
- Cuando alguien entra a `/login` y se autentica con éxito.
- La aplicación hace una consulta rápida a su perfil para ver su `role`.
- Si `role === 'merchant'`, el sistema lo redirige instantáneamente y solo a él a `/business-dashboard`.
- Si `role === 'user'`, el sistema lo redirige a la pantalla principal `/home`.

### 3. Registro Diferenciado
Aunque el Login es el mismo formulario para todos, el **Registro sí será distinto**:
- `/register`: Registro para usuarios normales (clientes). Por defecto crea el rol `user`.
- `/register-business`: Un formulario especial donde el usuario crea su cuenta y simultáneamente registra los datos iniciales de su negocio. La aplicación le asignará automáticamente el rol `merchant`.

## Pasos de Implementación
1. Aprobar plan (Hecho - B).
2. Crear tabla `profiles` en Supabase dashboard (con SQL).
3. Eliminar Clerk de la aplicación (`npm uninstall @clerk/clerk-react`) y de `App.tsx`.
4. Crear un `AuthProvider` con Supabase (`src/contexts/AuthContext.tsx`).
5. Crear Componentes Protectores (`ProtectedRoute`, `MerchantRoute`).
6. Rehacer Pantallas de Auth (`Login`, `Register`, `RegisterBusiness`) utilizando React Hook Form y Supabase.
7. Conectar `/home` y `/business-dashboard` a las sesiones reales.

¡Si la luz se va, volveremos a este archivo para continuar desde donde lo dejamos!
