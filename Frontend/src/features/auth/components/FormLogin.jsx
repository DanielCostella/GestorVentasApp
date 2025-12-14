import { useState, useEffect } from "react"
import { Form, Button } from "react-bootstrap"
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../../../css/session.css'

export const FormLogin = () => {
    const navigate = useNavigate()
    
    const [datos, setDatos] = useState({
        usuario: "",
        contraseña: "",
        sucursal: ""
    })
    
    const [sucursales, setSucursales] = useState([])

    useEffect(() => {
        const obtenerSucursales = async () => {
            try {
                const res = await axios.get('http://localhost:8000/sucursales')
                setSucursales(res.data)
            } catch (error) {
                console.error('Error al obtener sucursales:', error)
            }
        }
        obtenerSucursales()
    }, [])

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const res = await axios.post('http://localhost:8000/empleados/login', {
                Usuario: datos.usuario,
                Contraseña: datos.contraseña,
                id_Sucursal: datos.sucursal || null
            })

            console.log('Respuesta del backend:', res.data)

            if(res.data.error === false) {
                const { empleado, sucursal } = res.data
                
                Swal.fire({
                    icon:'success',
                    title: `¡Bienvenido ${empleado.Nombre}!`,
                    showConfirmButton: false,
                    timer: 1500
                })
                
                // Guardar en sessionStorage
                sessionStorage.setItem("idEmpleado", empleado.id_Empleado)
                sessionStorage.setItem("nombreEmpleado", `${empleado.Nombre} ${empleado.Apellido}`)
                sessionStorage.setItem("rolEmpleado", empleado.Rol)
                sessionStorage.setItem("idSucursal", sucursal.id_Sucursal)
                sessionStorage.setItem("nombreSucursal", sucursal.Nombre)
                
                // Redirigir
                setTimeout(() => {
                    navigate("/")
                }, 1500)
            }
        } catch (error) {
            console.error('Error en login:', error)
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: error.response?.data?.message || 'Credenciales incorrectas'
            })
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="sessionForm">
            <Form.Group controlId="name" className="mb-4">
                <Form.Label className="datosSession">Usuario</Form.Label>
                <Form.Control 
                    className="loginInputSession" 
                    type="text" 
                    placeholder="Ingrese su nombre de usuario" 
                    name="usuario" 
                    onChange={handleChange} 
                    required
                />
            </Form.Group>

            <Form.Group controlId="pass" className="mb-4">
                <Form.Label className="datosSession">Contraseña</Form.Label>
                <Form.Control 
                    className="loginInputSession" 
                    type="password" 
                    name="contraseña" 
                    placeholder="Ingrese su contraseña" 
                    onChange={handleChange} 
                    required
                />
            </Form.Group>

            <Form.Group controlId="sucursal" className="mb-4">
                <Form.Label className="datosSession">Sucursal (solo empleados)</Form.Label>
                <Form.Select 
                    className="loginInputSession" 
                    name="sucursal" 
                    onChange={handleChange}
                >
                    <option value="">
                        Admin: todas las sucursales | Empleado: selecciona tu sucursal
                    </option>
                    {sucursales.map(sucursal => (
                        <option key={sucursal.id_Sucursal} value={sucursal.id_Sucursal}>
                            {sucursal.Nombre} - {sucursal.Ciudad}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Button 
                    type="submit" 
                    className="mt-2 mb-2 botonSession"
                >
                    Iniciar sesión
                </Button>
            </Form.Group>

            <h6 className='refer mt-3 text-center'>
                <Link className="text-light" to={"/register"}>
                    ¿Aún no tienes una cuenta?
                </Link>
            </h6>
        </Form>
    )
}
