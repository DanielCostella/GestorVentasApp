import { QueryClient } from '@tanstack/react-query'

/**
 * Configuración de React Query
 * 
 * VENTAJAS sobre fetch/axios manual:
 * ✅ Cache inteligente: No vuelve a pedir datos innecesariamente
 * ✅ Auto-revalidación: Actualiza datos cuando vuelves a la pestaña
 * ✅ Loading/Error automáticos: No necesitas useState para cada cosa
 * ✅ Optimistic updates: UI instantánea
 * ✅ Retry automático: Si falla, reintenta
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (no vuelve a pedir)
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Tiempo que los datos se mantienen en cache
      cacheTime: 10 * 60 * 1000, // 10 minutos
      
      // Reintentar 3 veces si falla
      retry: 3,
      
      // Delay entre reintentos (exponencial)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch cuando la ventana recupera el foco
      refetchOnWindowFocus: true,
      
      // Refetch cuando se reconecta internet
      refetchOnReconnect: true,
      
      // Mostrar errores en consola
      onError: (error) => {
        console.error('React Query Error:', error)
      }
    },
    mutations: {
      // Reintentar mutaciones fallidas
      retry: 1,
      
      onError: (error) => {
        console.error('Mutation Error:', error)
      }
    }
  }
})
