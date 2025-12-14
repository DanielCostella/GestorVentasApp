import { useState, useEffect } from 'react'
import {Nav,Navbar, NavDropdown} from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import { URL_GET_EMPLEADO_ESPECIFICO } from './../constants/constants'; 
import logo from '../../public/logoFoodControl.svg'
import axios from 'axios'
import '../css/ventas.css'
import '../css/navbar.css'
//componente navbar 
export const NavbarPagina = () => {
  let idEmpleado = sessionStorage.getItem('idEmpleado')
  let nombreSucursal = sessionStorage.getItem('nombreSucursal') || 'Sucursal'
  let rolEmpleado = sessionStorage.getItem('rolEmpleado')
  const [empleado, setEmpleado] = useState({ Rol: rolEmpleado })

  //uso del hook navigate
  const navigate = useNavigate()

  useEffect(() => {
    if(idEmpleado){
      const obtenerEmpleadoEsp = async () => {
        const resp = await axios.get(`${URL_GET_EMPLEADO_ESPECIFICO}${idEmpleado}`) 
        setEmpleado(resp.data[0])
      }

      obtenerEmpleadoEsp()
    }
  }, [])

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Nav className="me-auto px-5">
          <NavLink className={"me-5 fs-4 text-decoration-none text-light"} to={"/"}>Ventas</NavLink>
          <NavLink className={"me-5 fs-4 text-decoration-none text-light"} to={"/cocina"}>🍳 Cocina</NavLink>
          {rolEmpleado === "Administrador" && (
            <NavLink className={"me-5 fs-4 text-decoration-none text-light"} to={"/administracion/productos"}>⚙️ Admin Productos</NavLink>
          )}
          <NavLink className={"me-5 fs-4 text-decoration-none text-light"} to={"/login"} onClick={() => {
            sessionStorage.removeItem('idEmpleado')
            sessionStorage.removeItem('idSucursal')
            sessionStorage.removeItem('nombreSucursal')
            sessionStorage.removeItem('rolEmpleado')
            sessionStorage.removeItem('nombreEmpleado')
          }}>Cerrar Sesión</NavLink>
        </Nav>
        <div className="me-2 px-5 d-flex align-items-center gap-3">
          <span className="text-light fw-bold fs-5">📍 {nombreSucursal}</span>
          <img className="local" src={logo} />
        </div>
      </Navbar>
    </>
  )
}