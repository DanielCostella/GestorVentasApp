import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de autenticación con Zustand
 * 
 * VENTAJAS sobre sessionStorage directo:
 * ✅ Reactivo: Los componentes se actualizan automáticamente
 * ✅ Persistente: Se guarda en sessionStorage automáticamente
 * ✅ Simple: Un solo hook para acceder a todo
 * ✅ TypeScript friendly: Fácil de tipar
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ESTADO
      empleado: null,
      sucursal: null,
      isAuthenticated: false,
      
      // ACCIONES
      login: (empleadoData, sucursalData) => {
        set({
          empleado: empleadoData,
          sucursal: sucursalData,
          isAuthenticated: true
        })
      },
      
      logout: () => {
        set({
          empleado: null,
          sucursal: null,
          isAuthenticated: false
        })
      },
      
      updateEmpleado: (data) => {
        set((state) => ({
          empleado: { ...state.empleado, ...data }
        }))
      },
      
      updateSucursal: (data) => {
        set((state) => ({
          sucursal: { ...state.sucursal, ...data }
        }))
      },
      
      // GETTERS (funciones de ayuda)
      isAdmin: () => {
        const { empleado } = get()
        return empleado?.Rol === 'Administrador'
      },
      
      isEmpleado: () => {
        const { empleado } = get()
        return empleado?.Rol === 'Empleado'
      }
    }),
    {
      name: 'auth-storage', // Nombre en sessionStorage
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        }
      }
    }
  )
)
