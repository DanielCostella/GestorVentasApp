# 🏗️ REESTRUCTURACIÓN DEL FRONTEND - FOOD CONTROL POS

## 📁 NUEVA ESTRUCTURA

```
Frontend/src/
├── features/          # Funcionalidades organizadas por dominio
│   ├── auth/         # Todo lo relacionado con autenticación
│   ├── productos/    # Todo lo relacionado con productos
│   ├── ventas/       # Todo lo relacionado con ventas
│   ├── categorias/   # ...
│   ├── proveedores/  # ...
│   └── empleados/    # ...
├── stores/           # Estado global con Zustand
├── lib/              # Configuraciones y utilidades
├── hooks/            # Custom hooks compartidos
├── Components/       # Componentes legacy (migrar gradualmente)
├── Pages/            # Páginas legacy (migrar gradualmente)
└── constants/        # Constantes (migrar a features)
```

---

## 🎯 QUÉ HICIMOS HASTA AHORA

### ✅ PASO 1: Instalación de dependencias
```bash
npm install zustand @tanstack/react-query axios date-fns
npm install @tanstack/react-query-devtools --save-dev
```

### ✅ PASO 2: Creación de estructura de carpetas
- `features/` para organizar por funcionalidad
- `stores/` para estado global
- `lib/` para configuraciones

### ✅ PASO 3: Configuración de Zustand
**Archivo:** `src/stores/authStore.js`

**Qué hace:**
- Reemplaza `sessionStorage.getItem()` directo
- Estado reactivo (componentes se actualizan solos)
- Persiste automáticamente en sessionStorage
- Métodos: `login()`, `logout()`, `isAdmin()`, etc.

**Uso:**
```javascript
import { useAuthStore } from '@/stores/authStore'

function MiComponente() {
  const { empleado, sucursal, login, logout } = useAuthStore()
  
  return (
    <div>
      <p>Hola, {empleado?.Nombre}</p>
      <button onClick={logout}>Salir</button>
    </div>
  )
}
```

### ✅ PASO 4: Configuración de React Query
**Archivo:** `src/lib/queryClient.js`

**Qué hace:**
- Cache inteligente de datos del servidor
- Auto-revalidación cuando vuelves a la pestaña
- Retry automático si falla una petición
- Loading/Error manejados automáticamente

### ✅ PASO 5: API Client con Axios
**Archivo:** `src/lib/apiClient.js`

**Qué hace:**
- Base URL centralizada (`http://localhost:8000`)
- Interceptores para logging
- Manejo de errores global (401, 403, 404, 500)
- Timeout de 30 segundos

---

## 📚 PRÓXIMOS PASOS

### PASO 6: Migrar Auth (login/logout)
- Crear `features/auth/api/authApi.js`
- Crear `features/auth/hooks/useAuth.js`
- Mover `FormLogin.jsx` a `features/auth/components/`
- Actualizar para usar Zustand + React Query

### PASO 7: Migrar Productos
- Crear `features/productos/api/productosApi.js`
- Crear `features/productos/hooks/useProductos.js`
- Mover componentes a `features/productos/components/`

### PASO 8: Migrar Ventas
- Similar a productos

### PASO 9: Eliminar código legacy
- Borrar `constants/constants.js` (mover a API files)
- Borrar componentes duplicados

### PASO 10: Testing
- Probar todas las funcionalidades
- Verificar que no haya regresiones

---

## 🎓 CONCEPTOS CLAVE

### 1. FEATURE-BASED ARCHITECTURE
**ANTES (por tipo):**
```
components/
  FormLogin.jsx
  TablaProductos.jsx
  CarritoVentas.jsx
```

**AHORA (por funcionalidad):**
```
features/
  auth/
    components/FormLogin.jsx
  productos/
    components/TablaProductos.jsx
  ventas/
    components/CarritoVentas.jsx
```

**VENTAJA:** Todo relacionado está junto. Fácil de encontrar y mantener.

---

### 2. ZUSTAND vs sessionStorage

**ANTES (sessionStorage):**
```javascript
// NO reactivo ❌
sessionStorage.setItem('empleado', JSON.stringify(data))

// En otro componente (no se entera del cambio)
const empleado = JSON.parse(sessionStorage.getItem('empleado'))
```

**AHORA (Zustand):**
```javascript
// Reactivo ✅
const { empleado, login } = useAuthStore()
login(data) // Todos los componentes se actualizan automáticamente
```

---

### 3. REACT QUERY vs useEffect + axios

**ANTES (manual):**
```javascript
const [productos, setProductos] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const cargar = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/productos')
      setProductos(res.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  cargar()
}, [])
```

**AHORA (React Query):**
```javascript
const { data: productos, isLoading, error } = useQuery({
  queryKey: ['productos'],
  queryFn: () => apiClient.get('/productos').then(r => r.data)
})
```

**VENTAJAS:**
- ✅ Menos código
- ✅ Cache automático
- ✅ Revalidación inteligente
- ✅ Retry automático

---

## 🚀 CÓMO CONTINUAR

1. **Ejecutá:** `npm install` en `Frontend/`
2. **Lee este README** para entender los conceptos
3. **Esperá** a que termine de crear los archivos de Auth
4. **Compará** el código nuevo vs viejo
5. **Preguntame** cualquier duda

---

## 📖 RECURSOS

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Feature-Sliced Design](https://feature-sliced.design/)

