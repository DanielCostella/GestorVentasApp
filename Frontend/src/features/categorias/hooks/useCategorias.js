import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/categoriasApi'
import Swal from 'sweetalert2'

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 10, // 10 minutos (no cambian seguido)
  })
}

export const useCreateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      Swal.fire({
        icon: 'success',
        title: 'Categoría creada',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      Swal.fire({
        icon: 'success',
        title: 'Categoría actualizada',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}
