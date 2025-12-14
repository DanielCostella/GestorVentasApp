import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'
import { URL_GET_PROVEEDORES } from '../constants/constants'
import axios from 'axios'
import { BotonEditarProveedor } from './BotonEditarProveedor'
import { BotonEliminarProveedor } from './BotonEliminarProveedor'
//componente que contendra la tablaprovedores
export const TablaProveedores = () => {
  //haciendo uso del estado
  const [proveedores, setProveedores] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const itemsPorPagina = 5

  useEffect(() => {
    const obtenerProveedores = async () => {
      const res = await axios.get(URL_GET_PROVEEDORES)
      setProveedores(res.data)
    }
    obtenerProveedores()
  }, [])

  const handleInputChange = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1)
  }

  // Filtrado y Paginación
  let proveedoresFiltrados = []
  if (!busqueda) {
    proveedoresFiltrados = proveedores
  } else {
    proveedoresFiltrados = proveedores.filter((prov) => 
      prov.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (prov.Telefono && prov.Telefono.toLowerCase().includes(busqueda.toLowerCase())) ||
      (prov.Email && prov.Email.toLowerCase().includes(busqueda.toLowerCase())) ||
      (prov.CUIT && prov.CUIT.toLowerCase().includes(busqueda.toLowerCase()))
    )
  }

  const indiceUltimo = paginaActual * itemsPorPagina
  const indicePrimero = indiceUltimo - itemsPorPagina
  const proveedoresActuales = proveedoresFiltrados.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina)

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina)

  //tabla que contendra los datos de las proveedores 
  return (
    <>
      <div className='mt-4 mb-4 d-flex justify-content-center'>
        <input 
          type="text" 
          className='px-2 py-1 w-25' 
          onChange={handleInputChange} 
          value={busqueda} 
          placeholder='Buscar proveedor...'
        />
      </div>
      <div className="d-flex justify-content-center">
        <Table striped bordered hover className='w-75 align-middle text-center'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>CUIT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              proveedoresActuales.length > 0 ?
              proveedoresActuales.map(proveedor => (
                <tr key={proveedor.id_Proveedor}>
                  <td>{proveedor.Nombre}</td>
                  <td>{proveedor.Telefono}</td>
                  <td>{proveedor.Email}</td>
                  <td>{proveedor.CUIT}</td>
                  <td>
                    <BotonEditarProveedor id = {proveedor.id_Proveedor} />
                    <BotonEliminarProveedor 
                    id = {proveedor.id_Proveedor}
                    nombre = {proveedor.Nombre}
                    />
                  </td>
                </tr>
              ))
              :
              <tr colSpan='5'>No existen proveedores</tr>
            }
            <tr>
              
            </tr>
          </tbody>
        </Table>
      </div>
      
      {totalPaginas > 1 && (
        <div className='d-flex justify-content-center mb-4'>
          <Pagination>
            <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
            <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
            
            {[...Array(totalPaginas)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === paginaActual}
                onClick={() => cambiarPagina(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            
            <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
            <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
          </Pagination>
        </div>
      )}
      <div style={{marginBottom: '100px'}}></div>
    </>
  )
}
