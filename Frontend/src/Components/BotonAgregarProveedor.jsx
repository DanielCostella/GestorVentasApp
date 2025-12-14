import { useState } from 'react'
import { Button, Form, Modal} from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { URL_POST_PROVEEDOR } from '../constants/constants'
import Swal from 'sweetalert2'

//
export const BotonAgregarProveedor = () => {

  const [show, setShow] = useState (false);
  const navigate = useNavigate()

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //estado que contiene los valores almacenados en un objecto
  const initialState = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    cuit: ''
  }
  const [datos, setDatos] = useState (initialState);
  
  //contiene el valor ingresado
  const handleChange = (e) => {
    console.log(e.target.name)
    setDatos({
     ...datos,
      [e.target.name]: e.target.value
    })
  }

    //verifica que al enviar los datos no haya erorres.
    const handleSubmit = async (e) => {
      e.preventDefault()

      try {
          const res = await axios.post(URL_POST_PROVEEDOR,{
              Nombre: datos.nombre,
              Telefono: datos.telefono,
              Email: datos.email,
              Direccion: datos.direccion,
              CUIT: datos.cuit,
              
          })

          if(res.data.status === 200){
            Swal.fire({
              title: 'Proveedor agregado con éxito',
              icon:'success',
              showConfirmButton: false,
              timer: 1500,
            })
            navigate(0)
          }
      } catch (error) {
          console.error(error)
      }
    }
          

  return (
    <> 
      <Button className="boton_agregar mb-4 mx-4" variant="primary" onClick={handleShow}>Agregar Proveedor</Button>
  
      <Modal show={show} onHide={handleClose} className="modal-editar">
        <Modal.Header style={{backgroundColor: "#0D6EFD"}} closeButton>
          <Modal.Title>Agregar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre" className='mb-3'>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name='nombre' onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="telefono" className='mb-3'>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" name='telefono' onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="email" className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name='email' onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="cuit" className='mb-3'>
              <Form.Label>CUIT</Form.Label>
              <Form.Control type="text" name='cuit' onChange={handleChange} required />
            </Form.Group>       
            <Button type='submit'>Agregar Proveedor</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}