import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'
import { URL_GET_CATEGORIAS } from '../constants/constants'
import axios from 'axios'
import { BotonEliminarCategoria } from './BotonEliminarCategoria'
import { BotonEditarCategoria } from './BotonEditarCategoria'

//componente tablacategoria
export const TablaCategorias = () => {
  //uso del estado
  const [categorias, setCategorias] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const itemsPorPagina = 5

  useEffect(() => {
    const obtenerCategorias = async () => {
      const res = await axios.get(URL_GET_CATEGORIAS)
      setCategorias(res.data)
    }
    obtenerCategorias()
  }, [])

  const handleInputChange = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1)
  }

  // Filtrado y Paginación
  let categoriasFiltradas = []
  if (!busqueda) {
    categoriasFiltradas = categorias
  } else {
    categoriasFiltradas = categorias.filter((cat) => 
      cat.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cat.Descripcion.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  const indiceUltimo = paginaActual * itemsPorPagina
  const indicePrimero = indiceUltimo - itemsPorPagina
  const categoriasActuales = categoriasFiltradas.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(categoriasFiltradas.length / itemsPorPagina)

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina)

  //tabla que contendra los datos de las categorias
  return (
    <>
      <div className='mt-4 mb-4 d-flex justify-content-center'>
        <input 
          type="text" 
          className='px-2 py-1 w-25' 
          onChange={handleInputChange} 
          value={busqueda} 
          placeholder='Buscar categoría...'
        />
      </div>
      <div className="d-flex justify-content-center">
        <Table striped bordered hover className='w-75 align-middle text-center'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              categoriasActuales.length > 0 ?
              categoriasActuales.map(categoria => (
                <tr key={categoria.id_Categoria}>
                  <td>{categoria.Nombre}</td>
                  <td>{categoria.Descripcion}</td>
                  <td>
                    <BotonEditarCategoria id = {categoria.id_Categoria}/>
                    <BotonEliminarCategoria id = {categoria.id_Categoria} 
                    nombre = {categoria.id_Categoria}/>
                  </td>
                </tr>
              ))
              :
              <tr colSpan='5'>No existen categorias</tr>
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
