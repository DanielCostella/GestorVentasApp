import { useQuery } from '@tanstack/react-query'
import { getSucursales } from '../api/sucursalesApi'

export const useSucursales = () => {
  return useQuery({
    queryKey: ['sucursales'],
    queryFn: getSucursales,
    staleTime: 1000 * 60 * 10, // 10 minutos (las sucursales no cambian seguido)
  })
}
