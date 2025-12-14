import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../api/proveedoresApi'
import Swal from 'sweetalert2'

export const useProveedores = () => {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: getProveedores,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      Swal.fire({
        icon: 'success',
        title: 'Proveedor creado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateProveedor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      Swal.fire({
        icon: 'success',
        title: 'Proveedor actualizado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useDeleteProveedor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      Swal.fire({
        icon: 'success',
        title: 'Proveedor eliminado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}
