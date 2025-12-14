/**
 * USE AUTH HOOK
 * =============
 * Hook personalizado que combina:
 * - Zustand (estado global de autenticación)
 * - React Query (llamadas al servidor)
 * - Auth API (lógica de login/logout)
 * 
 * ANTES: 
 * - sessionStorage.setItem() en cada componente
 * - axios.post() directo
 * - useState para loading/error
 * 
 * AHORA:
 * - Estado reactivo centralizado
 * - Cache y revalidación automática
 * - Loading/error manejados automáticamente
 * 
 * USO:
 * const { empleado, loginMutation, logout } = useAuth()
 * loginMutation.mutate({ Email: '...', Password: '...' })
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { loginUser, logoutUser, registerUser } from '../api/authApi'
import Swal from 'sweetalert2'

export const useAuth = () => {
  const queryClient = useQueryClient()
  
  // Estado de Zustand
  const { 
    empleado, 
    sucursal, 
    login: setAuthData, 
    logout: clearAuthData,
    isAdmin,
    isEmpleado 
  } = useAuthStore()

  /**
   * Mutation de LOGIN
   * Ejecuta loginUser(), guarda en Zustand, muestra alerta
   */
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('✅ Login exitoso, data recibida:', data)
      
      // Guardar en Zustand (automáticamente persiste en sessionStorage)
      setAuthData(data.empleado, data.sucursal)
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${data.empleado.Nombre}`,
        timer: 1500,
        showConfirmButton: false
      })
    },
    onError: (error) => {
      console.error('❌ Error en login:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.response?.data?.message || 'Credenciales incorrectas'
      })
    }
  })

  /**
   * Mutation de LOGOUT
   * Limpia Zustand, limpia cache de React Query
   */
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Limpiar estado de Zustand
      clearAuthData()
      
      // Limpiar TODO el cache de React Query
      queryClient.clear()
      
      Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        timer: 1000,
        showConfirmButton: false
      })
    }
  })

  /**
   * Mutation de REGISTRO
   */
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión',
        timer: 2000
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.response?.data?.message || 'No se pudo completar el registro'
      })
    }
  })

  return {
    // Estado
    empleado,
    sucursal,
    isAuthenticated: !!empleado,
    isAdmin: isAdmin(),
    isEmpleado: isEmpleado(),
    
    // Mutations
    loginMutation,
    logoutMutation,
    registerMutation,
    
    // Funciones de conveniencia
    login: (credentials) => loginMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    register: (data) => registerMutation.mutate(data),
    
    // Estados de carga
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending
  }
}
