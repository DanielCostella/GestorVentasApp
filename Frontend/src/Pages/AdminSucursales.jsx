import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import { BotonAgregarSucursal } from '../Components/BotonAgregarSucursal'
import { NavbarPagina } from '../Components/NavbarPagina'
import { Footer } from '../Components/Footer'
import axios from 'axios'
import { URL_GET_SUCURSALES } from '../constants/constants'
import { useNavigate } from 'react-router-dom'
import { URL_GET_EMPLEADO_ESPECIFICO } from '../constants/constants'

export const AdminSucursales = () => {
  const [sucursales, setSucursales] = useState([])
  const [empleado, setEmpleado] = useState({})
  const navigate = useNavigate()
  const idEmpleado = sessionStorage.getItem('idEmpleado')

  useEffect(() => {
    if(idEmpleado) {
      const obtenerEmpleadoEsp = async () => {
        try {
          const response = await axios.get(`${URL_GET_EMPLEADO_ESPECIFICO}${idEmpleado}`)
          setEmpleado(response.data[0])
        } catch (error) {
          console.error('Error al obtener empleado específico:', error)
        }
      }

      obtenerEmpleadoEsp()
    }
  }, [])

  useEffect(() => {
    if(!idEmpleado || (idEmpleado && empleado.Rol === "Empleado")) {
      navigate("/", { replace: true })
    }
  }, [empleado.Rol])

  useEffect(() => {
    const obtenerSucursales = async () => {
      try {
        const res = await axios.get(URL_GET_SUCURSALES)
        setSucursales(res.data)
      } catch (error) {
        console.error('Error al obtener sucursales:', error)
      }
    }

    obtenerSucursales()
  }, [])

  return (
    <>
      <NavbarPagina />
      <h2 className='text-center mt-4'>Administración de Sucursales</h2>
      <BotonAgregarSucursal />
      
      <div className='d-flex justify-content-center mt-4'>
        <Table striped bordered hover className='w-75 text-center'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.length > 0 ? (
              sucursales.map(sucursal => (
                <tr key={sucursal.id_Sucursal}>
                  <td>{sucursal.id_Sucursal}</td>
                  <td>{sucursal.Nombre}</td>
                  <td>{sucursal.Ciudad}</td>
                  <td>{sucursal.Direccion}</td>
                  <td>{sucursal.Telefono}</td>
                  <td>
                    {sucursal.Estado === 'Activa' ? (
                      <span className="badge bg-success">Activa</span>
                    ) : (
                      <span className="badge bg-danger">Inactiva</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6'>No hay sucursales registradas</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      
      <Footer />
    </>
  )
}
