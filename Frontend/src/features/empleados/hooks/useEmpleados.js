import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../api/empleadosApi'
import Swal from 'sweetalert2'

export const useEmpleados = () => {
  return useQuery({
    queryKey: ['empleados'],
    queryFn: getEmpleados,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateEmpleado = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] })
      Swal.fire({
        icon: 'success',
        title: 'Empleado creado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useUpdateEmpleado = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateEmpleado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] })
      Swal.fire({
        icon: 'success',
        title: 'Empleado actualizado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}

export const useDeleteEmpleado = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEmpleado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] })
      Swal.fire({
        icon: 'success',
        title: 'Empleado eliminado',
        timer: 1500,
        showConfirmButton: false
      })
    }
  })
}
