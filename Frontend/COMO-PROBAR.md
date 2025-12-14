# ⚡ CÓMO PROBAR LA NUEVA ARQUITECTURA

## 🔧 PASO 1: Instalar dependencias

```powershell
cd Frontend
npm install
```

Esto instalará:
- `zustand` → Estado global
- `@tanstack/react-query` → Server state
- `@tanstack/react-query-devtools` → Herramienta de debugging
- `date-fns` → Manejo de fechas
- `axios` → Ya lo tenías

---

## 🚀 PASO 2: Iniciar el servidor

```powershell
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend
cd Frontend
npm run dev
```

---

## 🧪 PASO 3: Probar el login

1. **Abre:** http://localhost:5173/login

2. **Observa** la esquina inferior derecha: verás el ícono de React Query DevTools (una flor roja/verde)

3. **Ingresa** tus credenciales:
   - Usuario: tu usuario
   - Contraseña: tu contraseña
   - Sucursal: selecciona una (si eres empleado)

4. **Click** en "Iniciar sesión"

5. **Observa:**
   - Loading spinner en el botón
   - SweetAlert de éxito
   - Redirección a "/"

---

## 🔍 PASO 4: Verificar Zustand

**Abre la consola del navegador** (F12) y escribe:

```javascript
// Ver el estado actual
JSON.parse(sessionStorage.getItem('auth-storage'))
```

Deberías ver:
```json
{
  "state": {
    "empleado": { "id_Empleado": 1, "Nombre": "Juan", ... },
    "sucursal": { "id_Sucursal": 1, "Nombre": "Sucursal Norte" }
  },
  "version": 0
}
```

✅ **Zustand está guardando automáticamente en sessionStorage con el middleware `persist`**

---

## 🔍 PASO 5: Verificar React Query DevTools

1. **Click en el ícono de React Query** (esquina inferior derecha)

2. **Verás:**
   - `['sucursales']` → Query de sucursales
   - Estado: `success` (verde)
   - `dataUpdatedAt`: timestamp de cuándo se cargó
   - `staleTime`: 600000ms (10 minutos)

3. **Recarga la página** (F5)

4. **Observa:**
   - Las sucursales NO se vuelven a pedir al servidor
   - Se usan desde el cache (instantáneo)
   - El DevTool muestra "cached"

✅ **React Query está cacheando correctamente**

---

## 🔍 PASO 6: Verificar interceptores de Axios

**Abre la consola del navegador** y busca:

```
[API Request] POST /empleados/login
[API Response] POST /empleados/login - 200 OK in 150ms
```

✅ **Los interceptores están logueando todas las peticiones**

---

## 🧪 PASO 7: Probar manejo de errores

1. **Ingresa credenciales incorrectas**
2. **Click en "Iniciar sesión"**
3. **Observa:**
   - SweetAlert de error
   - No se guarda nada en sessionStorage
   - No redirige

✅ **El manejo de errores funciona correctamente**

---

## 🔄 PASO 8: Probar reactividad de Zustand

**En la consola del navegador:**

```javascript
// 1. Importar el store (solo para testing)
// Abre cualquier componente y agrega temporalmente:
import { useAuthStore } from '@/stores/authStore'

// 2. Dentro del componente:
const { empleado, updateEmpleado } = useAuthStore()

// 3. Actualiza el nombre
updateEmpleado({ ...empleado, Nombre: 'Nuevo Nombre' })
```

**Observa:**
- El componente se re-renderiza automáticamente
- El nuevo nombre aparece en la UI
- sessionStorage se actualiza automáticamente

✅ **Zustand es reactivo y persiste automáticamente**

---

## 📊 PASO 9: Comparar con versión anterior

### ANTES (Components/FormLogin.jsx)

```javascript
// Líneas: 127
// useEffect manual
// axios.post directo
// sessionStorage.setItem manual
// if/else para manejo de respuesta
```

### AHORA (features/auth/components/FormLogin.jsx)

```javascript
// Líneas: ~120 (más limpio)
// useAuth() hook
// React Query automático
// Zustand reactivo
// Manejo de errores centralizado
```

---

## 🐛 POSIBLES ERRORES Y SOLUCIONES

### Error: "Cannot find module '@/stores/authStore'"

**Causa:** El alias `@` no está configurado.

**Solución:** Ya creé `jsconfig.json` y actualicé `vite.config.js`. Reinicia el servidor:

```powershell
# Ctrl+C en la terminal del frontend
npm run dev
```

---

### Error: "queryClient is not defined"

**Causa:** Falta envolver la app con `QueryClientProvider`.

**Solución:** Ya actualicé `main.jsx`. Verifica que tenga:

```javascript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

### Error: "Cannot read properties of undefined (reading 'Nombre')"

**Causa:** `empleado` es `null` al inicio.

**Solución:** Usa optional chaining:

```javascript
// ❌ empleado.Nombre
// ✅ empleado?.Nombre
```

O verifica antes:

```javascript
{empleado && <p>Hola, {empleado.Nombre}</p>}
```

---

### Error: Backend no responde

**Causa:** Backend no está corriendo.

**Solución:**

```powershell
cd Backend
npm start
```

Verifica que esté en http://localhost:8000

---

## 🎯 QUÉ ESPERAR

### ✅ FUNCIONA:
- Login con Zustand + React Query
- Cache de sucursales
- Persistencia automática en sessionStorage
- Interceptores de Axios
- Manejo de errores global
- React Query DevTools

### ⏳ PENDIENTE:
- Migrar resto de componentes (Productos, Ventas, etc.)
- Eliminar código legacy
- Usar el nuevo FormLogin en Login.jsx

---

## 📝 PRÓXIMOS PASOS

Una vez que verifiques que el login funciona:

1. ✅ Auth está completo
2. ⏳ Migrar Productos
3. ⏳ Migrar Ventas
4. ⏳ Resto de features

---

## 💡 TIPS

### React Query DevTools

- Click en una query para ver detalles
- "Refetch" → Forzar recarga
- "Invalidate" → Marcar como stale
- "Remove" → Borrar del cache

### Zustand DevTools

Instala la extensión de Redux DevTools en Chrome. Zustand es compatible:

```javascript
// Ya está configurado en authStore.js
{ name: 'auth-store', devtools: true }
```

### Debugging

```javascript
// Ver todas las queries activas
console.log(queryClient.getQueryCache().getAll())

// Ver estado de auth
console.log(useAuthStore.getState())
```

---

## 🆘 SI ALGO NO FUNCIONA

1. **Verifica que Backend esté corriendo** en http://localhost:8000
2. **Verifica que Frontend esté corriendo** en http://localhost:5173
3. **Abre la consola del navegador** (F12) y busca errores
4. **Abre React Query DevTools** y verifica el estado de las queries
5. **Verifica sessionStorage** con `JSON.parse(sessionStorage.getItem('auth-storage'))`
6. **Pregúntame** con el error específico

