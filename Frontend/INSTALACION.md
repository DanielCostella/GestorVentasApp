# 🚀 INSTALACIÓN Y PUESTA EN MARCHA

## ⚠️ IMPORTANTE: LEE PRIMERO

Antes de empezar, asegúrate de:
1. ✅ Tener Node.js instalado (v16 o superior)
2. ✅ Tener MySQL corriendo
3. ✅ Backend funcionando en http://localhost:8000
4. ✅ Leer `RESUMEN-COMPLETO.md` para entender los cambios

---

## 📦 PASO 1: Instalar dependencias

```powershell
cd c:\Users\dcost\Documents\GESTOR-VENTAS\pos-system-react-node\Frontend
npm install
```

Esto instalará:
- ✅ `zustand` → Estado global reactivo
- ✅ `@tanstack/react-query` → Manejo de peticiones HTTP
- ✅ `@tanstack/react-query-devtools` → Herramienta de debugging
- ✅ `date-fns` → Manejo de fechas

**Tiempo estimado:** 1-2 minutos

---

## 🔧 PASO 2: Verificar configuración

### 2.1 Verifica que existan estos archivos:

```
Frontend/
├── src/
│   ├── stores/
│   │   └── authStore.js           ✅
│   ├── lib/
│   │   ├── queryClient.js         ✅
│   │   └── apiClient.js           ✅
│   └── features/
│       ├── auth/
│       │   ├── api/authApi.js     ✅
│       │   ├── hooks/useAuth.js   ✅
│       │   └── components/FormLogin.jsx ✅
│       └── sucursales/
│           ├── api/sucursalesApi.js     ✅
│           └── hooks/useSucursales.js   ✅
├── jsconfig.json                  ✅
└── vite.config.js                 ✅ (actualizado)
```

### 2.2 Verifica `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2.3 Verifica `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 🚀 PASO 3: Iniciar servidores

### 3.1 Terminal 1 - Backend

```powershell
cd c:\Users\dcost\Documents\GESTOR-VENTAS\pos-system-react-node\Backend
npm start
```

**Verifica que veas:**
```
Servidor corriendo en http://localhost:8000
Socket.IO iniciado
```

### 3.2 Terminal 2 - Frontend

```powershell
cd c:\Users\dcost\Documents\GESTOR-VENTAS\pos-system-react-node\Frontend
npm run dev
```

**Verifica que veas:**
```
VITE v5.x.x ready in 500 ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 PASO 4: Probar el login

### 4.1 Abrir navegador

1. Ve a: http://localhost:5173/login
2. Abre la consola del navegador (F12)

### 4.2 Observar React Query DevTools

- En la esquina inferior derecha verás un ícono de flor (rojo/verde)
- Es React Query DevTools
- Click para ver las queries activas

### 4.3 Ingresar credenciales

**Ejemplo:**
- Usuario: `admin`
- Contraseña: `admin123`
- Sucursal: (deja vacío si eres Admin)

### 4.4 Observar la consola

Deberías ver:
```
[API Request] POST /empleados/login
[API Response] POST /empleados/login - 200 OK in 150ms
```

### 4.5 Verificar sessionStorage

En la consola del navegador, escribe:

```javascript
JSON.parse(sessionStorage.getItem('auth-storage'))
```

Deberías ver:
```json
{
  "state": {
    "empleado": {
      "id_Empleado": 1,
      "Nombre": "Admin",
      "Apellido": "Sistema",
      "Usuario": "admin",
      "Rol": "Administrador"
    },
    "sucursal": {
      "id_Sucursal": 0,
      "Nombre": "Administración Central",
      "Ciudad": "Todas las sucursales"
    }
  },
  "version": 0
}
```

✅ **Si ves esto, Zustand está funcionando correctamente**

---

## 🔍 PASO 5: Verificar React Query

### 5.1 Abrir DevTools

Click en el ícono de flor (esquina inferior derecha)

### 5.2 Verificar query de sucursales

Deberías ver:
- Query Key: `['sucursales']`
- Status: `success` (verde)
- Data: Array de sucursales
- Stale Time: 600000ms (10 minutos)

### 5.3 Recargar la página (F5)

Observa que:
- Las sucursales NO se vuelven a pedir al servidor
- Se usan desde el cache
- DevTools muestra "from cache"

✅ **Si ves esto, React Query está cacheando correctamente**

---

## 📊 PASO 6: Verificar interceptores

### 6.1 Hacer login de nuevo

Cierra sesión y vuelve a hacer login

### 6.2 Observar la consola

Deberías ver logs de:
- `[API Request]` para cada petición
- `[API Response]` con el tiempo de respuesta

✅ **Si ves esto, los interceptores están funcionando**

---

## ❌ PASO 7: Probar manejo de errores

### 7.1 Ingresar credenciales incorrectas

- Usuario: `xxxxx`
- Contraseña: `xxxxx`

### 7.2 Observar

Deberías ver:
- SweetAlert con mensaje de error
- NO se guarda nada en sessionStorage
- NO redirige

✅ **Si ves esto, el manejo de errores funciona**

---

## 🔧 TROUBLESHOOTING

### Error: "Cannot find module '@/stores/authStore'"

**Causa:** Alias `@` no configurado o servidor no reiniciado

**Solución:**
1. Verifica que `vite.config.js` tenga el alias
2. Verifica que `jsconfig.json` exista
3. Reinicia el servidor:
   ```powershell
   # Ctrl+C en la terminal del frontend
   npm run dev
   ```

---

### Error: "queryClient is not defined"

**Causa:** `main.jsx` no tiene el QueryClientProvider

**Solución:**

Verifica que `src/main.jsx` tenga:

```javascript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

---

### Error: Backend no responde

**Causa:** Backend no está corriendo

**Solución:**

```powershell
cd Backend
npm start
```

Verifica que esté en http://localhost:8000

---

### Error: "Cannot read properties of undefined (reading 'Nombre')"

**Causa:** `empleado` es `null` al inicio

**Solución:**

Usa optional chaining:

```javascript
// ❌ empleado.Nombre
// ✅ empleado?.Nombre
```

O verifica antes:

```javascript
{empleado && <p>{empleado.Nombre}</p>}
```

---

## 📝 CHECKLIST FINAL

Verifica que TODO esto funcione:

- [ ] `npm install` sin errores
- [ ] Backend corriendo en http://localhost:8000
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Login exitoso muestra SweetAlert
- [ ] sessionStorage tiene `auth-storage`
- [ ] React Query DevTools visible
- [ ] Query de sucursales en cache
- [ ] Interceptores loguean en consola
- [ ] Login incorrecto muestra error
- [ ] No hay errores en consola

---

## 🎉 TODO LISTO!

Si todos los checks están ✅, la migración fue exitosa.

**Próximos pasos:**
1. Lee `RESUMEN-COMPLETO.md` para ver TODO lo que cambió
2. Lee `ANTES-DESPUES.md` para comparaciones
3. Lee `COMO-PROBAR.md` para más tests
4. Continúa con la migración de Productos (PASO 7)

---

## 📞 SOPORTE

Si algo no funciona:

1. Abre la consola del navegador (F12)
2. Busca el error exacto
3. Verifica el checklist de troubleshooting
4. Pregunta con el error específico

