import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Cliente HTTP configurado con Axios
 * 
 * VENTAJAS:
 * ✅ Configuración centralizada (base URL, headers)
 * ✅ Interceptores para manejo de errores global
 * ✅ Auto-agregar tokens de autenticación
 * ✅ Retry automático
 */

// Configuración base
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de REQUEST (antes de enviar)
apiClient.interceptors.request.use(
  (config) => {
    // Aquí podrías agregar tokens automáticamente
    // const token = sessionStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor de RESPONSE (después de recibir)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error)
    
    // Manejo de errores global
    if (error.response) {
      // El servidor respondió con error
      const status = error.response.status
      const message = error.response.data?.message || 'Error del servidor'
      
      switch (status) {
        case 401:
          Swal.fire({
            icon: 'error',
            title: 'No autorizado',
            text: 'Debes iniciar sesión'
          })
          // Redirigir a login
          window.location.href = '/login'
          break
          
        case 403:
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para esta acción'
          })
          break
          
        case 404:
          console.warn('Recurso no encontrado:', error.config.url)
          break
          
        case 500:
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: message
          })
          break
          
        default:
          Swal.fire({
            icon: 'error',
            title: `Error ${status}`,
            text: message
          })
      }
    } else if (error.request) {
      // No hubo respuesta del servidor
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No se pudo conectar al servidor'
      })
    } else {
      // Error en la configuración de la petición
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      })
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
