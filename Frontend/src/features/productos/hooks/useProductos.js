/**
 * USE PRODUCTOS HOOK
 * ==================
 * Hook para gestionar productos con React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getProductos, 
  getProducto, 
  createProducto, 
  updateProducto, 
  deleteProducto,
  importarProductosExcel 
} from '../api/productosApi'
import Swal from 'sweetalert2'

/**
 * Hook para obtener todos los productos
 */
export const useProductos = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

/**
 * Hook para obtener un producto específico
 */
export const useProducto = (id) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProducto(id),
    enabled: !!id, // Solo ejecuta si hay id
  })
}

/**
 * Hook para crear un producto
 */
export const useCreateProducto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      // Invalida el cache de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      
      Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        text: 'El producto se agregó correctamente',
        timer: 2000,
        showConfirmButton: false
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: error.response?.data?.message || 'No se pudo crear el producto'
      })
    }
  })
}

/**
 * Hook para actualizar un producto
 */
export const useUpdateProducto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado',
        text: 'Los cambios se guardaron correctamente',
        timer: 2000,
        showConfirmButton: false
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'No se pudo actualizar el producto'
      })
    }
  })
}

/**
 * Hook para eliminar un producto
 */
export const useDeleteProducto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      
      Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        timer: 1500,
        showConfirmButton: false
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text: error.response?.data?.message || 'No se pudo eliminar el producto'
      })
    }
  })
}

/**
 * Hook para importar productos desde Excel
 */
export const useImportarProductos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importarProductosExcel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      
      Swal.fire({
        icon: 'success',
        title: 'Importación exitosa',
        text: `Se importaron ${data.count || 0} productos`,
        timer: 2000
      })
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al importar',
        text: error.response?.data?.message || 'No se pudo importar el archivo'
      })
    }
  })
}
