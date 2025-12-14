# 🎯 GUÍA RÁPIDA: CÓMO USAR LOS NUEVOS HOOKS

## 📚 TABLA DE CONTENIDOS

- [Auth](#auth)
- [Productos](#productos)
- [Ventas](#ventas)
- [Categorías](#categorias)
- [Proveedores](#proveedores)
- [Empleados](#empleados)
- [Sucursales](#sucursales)

---

## 🔐 AUTH

### Obtener usuario logueado

```javascript
import { useAuth } from '@/features/auth/hooks/useAuth'

function MiComponente() {
  const { empleado, sucursal, isAdmin, isEmpleado } = useAuth()
  
  return (
    <div>
      <p>Usuario: {empleado?.Nombre}</p>
      <p>Sucursal: {sucursal?.Nombre}</p>
      {isAdmin && <button>Solo Admin</button>}
    </div>
  )
}
```

### Login y Logout

```javascript
import { useAuth } from '@/features/auth/hooks/useAuth'

function LoginForm() {
  const { login, logout, isLoggingIn } = useAuth()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    login({
      Usuario: 'admin',
      Contraseña: 'password',
      id_Sucursal: 1
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos ... */}
      <button disabled={isLoggingIn}>
        {isLoggingIn ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
```

---

## 📦 PRODUCTOS

### Listar productos

```javascript
import { useProductos } from '@/features/productos/hooks/useProductos'

function TablaProductos() {
  const { data: productos, isLoading, error } = useProductos()
  
  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>
  
  return (
    <table>
      {productos.map(p => (
        <tr key={p.id_Producto}>
          <td>{p.Nombre}</td>
          <td>${p.Precio}</td>
        </tr>
      ))}
    </table>
  )
}
```

### Crear producto

```javascript
import { useCreateProducto } from '@/features/productos/hooks/useProductos'

function FormAgregarProducto() {
  const createMutation = useCreateProducto()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    createMutation.mutate({
      Nombre: 'Pizza',
      Precio: 1500,
      id_Categoria: 1,
      id_Proveedor: 1,
      Imagen: 'pizza.jpg'
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos ... */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
```

### Actualizar producto

```javascript
import { useUpdateProducto } from '@/features/productos/hooks/useProductos'

function EditarProducto({ idProducto }) {
  const updateMutation = useUpdateProducto()
  
  const handleUpdate = () => {
    updateMutation.mutate({
      id: idProducto,
      data: {
        Nombre: 'Pizza Grande',
        Precio: 2000
      }
    })
  }
  
  return <button onClick={handleUpdate}>Actualizar</button>
}
```

### Eliminar producto

```javascript
import { useDeleteProducto } from '@/features/productos/hooks/useProductos'

function BotonEliminar({ idProducto }) {
  const deleteMutation = useDeleteProducto()
  
  const handleDelete = () => {
    deleteMutation.mutate(idProducto)
  }
  
  return <button onClick={handleDelete}>Eliminar</button>
}
```

### Importar desde Excel

```javascript
import { useImportarProductos } from '@/features/productos/hooks/useProductos'

function ImportarExcel() {
  const importMutation = useImportarProductos()
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    importMutation.mutate(formData)
  }
  
  return (
    <input 
      type="file" 
      accept=".xlsx" 
      onChange={handleFileUpload}
      disabled={importMutation.isPending}
    />
  )
}
```

---

## 💰 VENTAS

### Listar ventas

```javascript
import { useVentas } from '@/features/ventas/hooks/useVentas'

function ListadoVentas() {
  const { data: ventas, isLoading } = useVentas()
  
  if (isLoading) return <p>Cargando ventas...</p>
  
  return (
    <ul>
      {ventas.map(v => (
        <li key={v.id_Venta}>
          Venta #{v.id_Venta} - ${v.Total}
        </li>
      ))}
    </ul>
  )
}
```

### Crear venta

```javascript
import { useCreateVenta } from '@/features/ventas/hooks/useVentas'
import { useAuth } from '@/features/auth/hooks/useAuth'

function CarritoVentas() {
  const createVenta = useCreateVenta()
  const { empleado, sucursal } = useAuth()
  
  const handleFinalizarVenta = () => {
    createVenta.mutate({
      id_Empleado: empleado.id_Empleado,
      id_Sucursal: sucursal.id_Sucursal,
      id_TipoPago: 1,
      Cantidad: 2,
      id_Producto: 5,
      Precio: 1500
    })
  }
  
  return (
    <button 
      onClick={handleFinalizarVenta}
      disabled={createVenta.isPending}
    >
      Finalizar Venta
    </button>
  )
}
```

---

## 🏷️ CATEGORÍAS

### Listar categorías

```javascript
import { useCategorias } from '@/features/categorias/hooks/useCategorias'

function SelectCategoria() {
  const { data: categorias, isLoading } = useCategorias()
  
  return (
    <select>
      {categorias?.map(c => (
        <option key={c.id_Categoria} value={c.id_Categoria}>
          {c.Nombre}
        </option>
      ))}
    </select>
  )
}
```

### Crear categoría

```javascript
import { useCreateCategoria } from '@/features/categorias/hooks/useCategorias'

function AgregarCategoria() {
  const createMutation = useCreateCategoria()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({ Nombre: 'Bebidas' })
  }
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

---

## 🏢 PROVEEDORES

### Listar proveedores

```javascript
import { useProveedores } from '@/features/proveedores/hooks/useProveedores'

function SelectProveedor() {
  const { data: proveedores, isLoading } = useProveedores()
  
  return (
    <select>
      {proveedores?.map(p => (
        <option key={p.id_Proveedor} value={p.id_Proveedor}>
          {p.Nombre}
        </option>
      ))}
    </select>
  )
}
```

---

## 👥 EMPLEADOS

### Listar empleados

```javascript
import { useEmpleados } from '@/features/empleados/hooks/useEmpleados'

function TablaEmpleados() {
  const { data: empleados, isLoading } = useEmpleados()
  
  if (isLoading) return <p>Cargando empleados...</p>
  
  return (
    <table>
      {empleados.map(e => (
        <tr key={e.id_Empleado}>
          <td>{e.Nombre} {e.Apellido}</td>
          <td>{e.Rol}</td>
        </tr>
      ))}
    </table>
  )
}
```

---

## 🏪 SUCURSALES

### Listar sucursales

```javascript
import { useSucursales } from '@/features/sucursales/hooks/useSucursales'

function SelectSucursal() {
  const { data: sucursales, isLoading } = useSucursales()
  
  return (
    <select>
      {sucursales?.map(s => (
        <option key={s.id_Sucursal} value={s.id_Sucursal}>
          {s.Nombre} - {s.Ciudad}
        </option>
      ))}
    </select>
  )
}
```

---

## 🎯 PATRONES COMUNES

### Loading State

```javascript
const { data, isLoading, error } = useProductos()

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />

return <Tabla data={data} />
```

### Mutación con confirmación

```javascript
const deleteMutation = useDeleteProducto()

const handleDelete = async () => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    icon: 'warning',
    showCancelButton: true
  })
  
  if (result.isConfirmed) {
    deleteMutation.mutate(idProducto)
  }
}
```

### Invalidar múltiples queries

```javascript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const handleAction = () => {
  // Invalida productos y ventas
  queryClient.invalidateQueries({ queryKey: ['productos'] })
  queryClient.invalidateQueries({ queryKey: ['ventas'] })
}
```

---

## 📊 REACT QUERY DEVTOOLS

Abre las DevTools para ver:
- Queries activas
- Estado de cache
- Tiempo de stale
- Refetch manual

**Ubicación:** Esquina inferior derecha (ícono de flor)

---

## 🚀 VENTAJAS

✅ **Cache automático** → Menos peticiones al servidor
✅ **Estado reactivo** → Componentes se actualizan solos
✅ **Código reutilizable** → Mismos hooks en múltiples componentes
✅ **Loading/Error automático** → Menos código boilerplate
✅ **Invalidación inteligente** → Actualiza lo necesario

---

## 💡 TIPS

1. **Usa React Query DevTools** para ver el estado del cache
2. **Invalida queries relacionadas** después de mutaciones
3. **Usa optional chaining** (`empleado?.Nombre`) para evitar errores
4. **Ajusta staleTime** según qué tan dinámicos son tus datos
5. **Lee la consola** para ver logs de API requests/responses

