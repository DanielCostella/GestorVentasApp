/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { BotonEditarProducto } from './BotonEditarProducto';
import { BotonEliminarProducto } from './BotonEliminarProducto'
import { URL_GET_PRODUCTOS } from '../constants/constants';
import axios from 'axios'

//componente de tablaProductos recibiendo datos por props
export const TablaProductos = ({productos, setProductos}) => {
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const itemsPorPagina = 10

   //haciendo uso del useEffect
  useEffect(() => {
    const obtenerProductos = async () => {
      const idSucursal = sessionStorage.getItem('idSucursal')
      const url = idSucursal ? `${URL_GET_PRODUCTOS}?id_Sucursal=${idSucursal}` : URL_GET_PRODUCTOS
      const respuesta = await axios.get(url)
      setProductos(respuesta.data[0])
    }

    obtenerProductos()
  }, [])

  const handleInputChange = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1)
  }

  // Filtrado y Paginación
  let productosFiltrados = []
  if (!busqueda) {
    productosFiltrados = productos.sort((a,b) => a.id_Producto - b.id_Producto)
  } else {
    productosFiltrados = productos.filter((prod) => 
      prod.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.Categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.Proveedor.toLowerCase().includes(busqueda.toLowerCase())
    ).sort((a,b) => a.id_Producto - b.id_Producto)
  }

  const indiceUltimo = paginaActual * itemsPorPagina
  const indicePrimero = indiceUltimo - itemsPorPagina
  const productosActuales = productosFiltrados.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina)

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina)

  //tabla que contendra los datos de las productos
  return (
    <>
      <div className='mt-4 mb-4 d-flex justify-content-center'>
        <input 
          type="text" 
          className='px-2 py-1 w-25' 
          onChange={handleInputChange} 
          value={busqueda} 
          placeholder='Buscar producto, categoría o proveedor...'
        />
      </div>
      <Table striped bordered hover className='gralTablas text-center align-middle'>
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Nombre del Producto</th>
            <th>Categoria</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {
            productosActuales.length > 0 ?
            productosActuales.map(producto => {
              const stockBajo = producto.Stock && producto.Stock < 10
              return (
                <tr key={producto.id_Producto} className={stockBajo ? 'table-warning' : ''}>
                  <td>{producto.id_Producto}</td>
                  <td>
                    {producto.Nombre}
                    {stockBajo && <span className="badge bg-danger ms-2">⚠️ Stock Bajo</span>}
                  </td>
                  <td>{producto.Categoria}</td>
                  <td>{producto.Proveedor}</td>
                  <td className='text-danger fw-bold'>${producto.Precio}</td>
                  <td>
                    <span className={stockBajo ? 'text-danger fw-bold' : ''}>
                      {producto.Stock || 0}
                    </span>
                  </td>
                  <td>
                    <BotonEditarProducto id = {producto.id_Producto}/>
                    <BotonEliminarProducto 
                      id = {producto.id_Producto}
                      nombre = {producto.Nombre}
                    />
                  </td>
                </tr>
              )
            })
            :
            <tr>
              <td colSpan='7' className='text-center'>No se pudieron recuperar los datos en este momento. Intentelo más tarde</td>
            </tr>
          }
        </tbody>
      </Table>
      
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