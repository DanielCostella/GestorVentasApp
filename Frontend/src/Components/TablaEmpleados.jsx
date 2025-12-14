import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Pagination from 'react-bootstrap/Pagination'
import { URL_GET_EMPLEADOS } from '../constants/constants'
import axios from 'axios'
import { BotonEliminarEmpleado } from './BotonEliminarEmpleado'
import {BotonEditarEmpleado} from './BotonEditarEmpleado'

//componente de TablaEmpleados
export const TablaEmpleados = () => {
  //haciendo uso de estado y useEffect
  const [empleados, setEmpleados] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const itemsPorPagina = 5

  useEffect(() => {
    const obtenerEmpleados = async () => {
      const res = await axios.get(URL_GET_EMPLEADOS)
      setEmpleados(res.data)
    }
    obtenerEmpleados()
  }, [])

  const handleInputChange = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1)
  }

  // Filtrado y Paginación
  let empleadosFiltrados = []
  if (!busqueda) {
    empleadosFiltrados = empleados
  } else {
    empleadosFiltrados = empleados.filter((emp) => 
      emp.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.Apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.Usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      emp.Rol.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  const indiceUltimo = paginaActual * itemsPorPagina
  const indicePrimero = indiceUltimo - itemsPorPagina
  const empleadosActuales = empleadosFiltrados.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina)

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina)

  //tabla que contendra los datos de las empleados
  return (
    <>
      <div className='mt-4 mb-4 d-flex justify-content-center'>
        <input 
          type="text" 
          className='px-2 py-1 w-25' 
          onChange={handleInputChange} 
          value={busqueda} 
          placeholder='Buscar empleado...'
        />
      </div>
      <div className="d-flex justify-content-center">
        <Table striped bordered hover className='w-75 align-middle text-center'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Usuario</th>          
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              empleadosActuales.length > 0 ?
              empleadosActuales.map(empleado => (
                <tr key={empleado.id_Empleado}>
                  <td className='fw-bold'>{empleado.id_Empleado}</td>
                  <td>{empleado.Nombre}</td>
                  <td>{empleado.Apellido}</td>
                  <td>{empleado.Usuario}</td>
                  {
                    empleado.Rol === "Administrador" ?
                    <td className='text-danger fw-bold fst-italic'>{empleado.Rol}</td>
                    :
                    <td className='text-primary fw-bold fst-italic'>{empleado.Rol}</td>
                  }
                  <td>
                    <BotonEditarEmpleado id = {empleado.id_Empleado} nombre = {empleado.Nombre} apellido = {empleado.Apellido}/>
                    <BotonEliminarEmpleado 
                    id = {empleado.id_Empleado} 
                    nombre = {empleado.Nombre}
                    apellido = {empleado.Apellido}
                    />
                  </td>
                </tr>
              ))
              :
              <tr colSpan='5'>No existen empleados</tr>
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