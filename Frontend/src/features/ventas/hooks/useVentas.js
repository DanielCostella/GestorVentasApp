import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVentas, createVenta, deleteVenta } from '../api/ventasApi'
import Swal from 'sweetalert2'

export const useVentas = () => {
  return useQuery({
    queryKey: ['ventas'],
    queryFn: getVentas,
    staleTime: 1000 * 60 * 2, // 2 minutos (datos más dinámicos)
  })
}

export const useCreateVenta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // Actualiza stock
      
      Swal.fire({
        icon: 'success',
        title: 'Venta registrada',
        text: 'La venta se registró correctamente',
        timer: 2000,
        showConfirmButton: false
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar venta',
        text: error.response?.data?.message || 'No se pudo registrar la venta'
      })
    }
  })
}

export const useDeleteVenta = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      
      Swal.fire({
        icon: 'success',
        title: 'Venta eliminada',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}
