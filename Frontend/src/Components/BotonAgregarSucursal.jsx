import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { URL_POST_SUCURSAL } from '../constants/constants'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const BotonAgregarSucursal = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  
  const initialState = {
    nombre: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    estado: 'Activa'
  }
  
  const [datos, setDatos] = useState(initialState)

  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setDatos(initialState)
  }

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(URL_POST_SUCURSAL, {
        Nombre: datos.nombre,
        Direccion: datos.direccion,
        Telefono: datos.telefono,
        Ciudad: datos.ciudad,
        Estado: datos.estado
      })

      if(res.data.status === 200){
        Swal.fire({
          icon:'success',
          title: 'Sucursal agregada exitosamente',
          showConfirmButton: false,
          timer: 1500
        })
        navigate(0)
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Error al agregar sucursal',
        text: error.response?.data?.error || 'Error desconocido'
      })
    }
  }

  return (
    <>
      <Button className="btn btn-primary mb-2 mx-4" onClick={handleShow}>
        Agregar Sucursal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header style={{backgroundColor: "#0D6EFD"}} closeButton>
          <Modal.Title>Agregar Sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre" className='mb-3'>
              <Form.Label>Nombre de la Sucursal</Form.Label>
              <Form.Control 
                type="text" 
                name='nombre' 
                onChange={handleChange} 
                placeholder="Ej: Sucursal Centro"
                required 
              />
            </Form.Group>
            
            <Form.Group controlId="ciudad" className='mb-3'>
              <Form.Label>Ciudad</Form.Label>
              <Form.Control 
                type="text" 
                name='ciudad' 
                onChange={handleChange}
                placeholder="Ej: Buenos Aires"
                required 
              />
            </Form.Group>

            <Form.Group controlId="direccion" className='mb-3'>
              <Form.Label>Dirección</Form.Label>
              <Form.Control 
                type="text" 
                name='direccion' 
                onChange={handleChange}
                placeholder="Ej: Av. Libertador 1234"
                required 
              />
            </Form.Group>
            
            <Form.Group controlId="telefono" className='mb-3'>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control 
                type="text" 
                name='telefono' 
                onChange={handleChange}
                placeholder="Ej: 011-4555-1234"
              />
            </Form.Group>

            <Form.Group controlId="estado" className='mb-3'>
              <Form.Label>Estado</Form.Label>
              <Form.Select name='estado' onChange={handleChange} value={datos.estado}>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </Form.Select>
            </Form.Group>

            <Button type='submit'>Agregar Sucursal</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
