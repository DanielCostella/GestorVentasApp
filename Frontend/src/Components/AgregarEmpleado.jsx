import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { URL_POST_EMPLEADO } from '../constants/constants'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../css/session.css'

//componente creado para agregarempleado
export const AgregarEmpleado = () => {
    const navigate = useNavigate()

    const initialState = {
        nombre: '',
        apellido: '',
        usuario: '',
        password: '',
        rol: 'Empleado'
    }

    const [datos, setDatos] = useState(initialState)
    
    const handleChange = (e) => {
        setDatos({
           ...datos,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(URL_POST_EMPLEADO,{
                Nombre: datos.nombre,
                Apellido: datos.apellido,
                Usuario: datos.usuario,
                Password: datos.password,
                Rol: datos.rol
            })
            
            if(res.data.status === 200){
                Swal.fire({
                    icon:'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })

                navigate('/login')
            }
            else if(res.data.status === 404){
                Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
  return (
    //formulario para agregar empleados
    <Form onSubmit={handleSubmit} className='sessionForm'>
            <Form.Group controlId="name" className='mb-3'>
                <Form.Label className='datosSession'>Nombre</Form.Label>
                <Form.Control className="loginInputSession" type="text" name='nombre' placeholder='Ingrese un nombre ' onChange={handleChange} required/>
            </Form.Group>
            <Form.Group controlId="apellido" className='mb-3'>
                <Form.Label className='datosSession'>Apellido</Form.Label>
                <Form.Control className="loginInputSession" type="text" name='apellido' placeholder='Ingrese un apellido' onChange={handleChange} required/>
            </Form.Group>
            <Form.Group controlId="usuario" className='mb-3'>
                <Form.Label className='datosSession'>Usuario</Form.Label>
                <Form.Control className="loginInputSession" type="text" name='usuario' placeholder='Ingrese un nombre de usuario' onChange={handleChange} required/>
            </Form.Group>
            <Form.Group controlId="password" className='mb-3'>
                <Form.Label className='datosSession'>Contraseña</Form.Label>
                <Form.Control className="loginInputSession" type="password" name='password' placeholder='Ingrese una contraseña' onChange={handleChange} required/>
            </Form.Group>
            <Form.Group controlId="rol" className='mb-3'>
                <Form.Label className='datosSession'>Rol</Form.Label>
                <Form.Select className="loginInputSession" name='rol' onChange={handleChange} value={datos.rol} required>
                    <option value="Empleado">Empleado</option>
                    <option value="Administrador">Administrador</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Button className='mt-2 mb-2 botonSession' type="submit">Registrarse</Button>
            </Form.Group>
            <h6 className='refer mt-3 text-center'><Link className='text-light' to={"/login"}>¿Ya tienes una cuenta?</Link></h6>
        </Form>
  )
}