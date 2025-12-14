import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { URL_POST_PRODUCTO, URL_GET_CATEGORIAS, URL_GET_PROVEEDORES } from '../constants/constants'
import Swal from 'sweetalert2'

//componente que agrega los datos del productos x medio de estados 
export const BotonAgregarProducto = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate()
  
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const initialState = {
    categoria: 0,
    proveedor: 0,
    nombre: '',
    imagen: 'https://via.placeholder.com/150?text=Producto',
    precio: 0
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
        const res = await axios.post(URL_POST_PRODUCTO, {
            id_Categoria: datos.categoria,
            id_Proveedor: datos.proveedor,
            Nombre: datos.nombre,
            Imagen: datos.imagen,
            Precio: datos.precio
        })

        if(res.data.status === 200){
          Swal.fire({
            icon:'success',
            title: 'Producto agregado exitosamente',
            showConfirmButton: false,
            timer: 1500
          })
          navigate(0)
        }
    } catch (error) {
        console.error(error)
    }
  }

  const [categorias, setCategorias] = useState([])
  
  const obtenerCategorias = async () => {
    const res = await axios.get(URL_GET_CATEGORIAS)
    setCategorias(res.data)
  }
  useEffect(() => {
    obtenerCategorias()
  }, [])

  const [proveedores,setProveedores] = useState([])

  const obtenerProveedores = async () => {
      const res = await axios.get(URL_GET_PROVEEDORES)
      setProveedores(res.data)
  }
  useEffect (()=>{
    obtenerProveedores()
  },[])

  return (
    <>
      <Button className="boton_agregar" variant="primary" onClick={handleShow}>
        Agregar Producto
      </Button>

      <Modal show={show} onHide={handleClose} className="modal-editar">
        <Modal.Header style={{backgroundColor: "#0D6EFD"}} closeButton>
          <Modal.Title>Agregar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className='mb-3'>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" name='nombre' onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="categoria" className='mb-3'>
              <Form.Label>Categoria</Form.Label>
              <Form.Select name='categoria' onChange={handleChange}>
                <option selected disabled>Selecciona una categoria</option>
                {categorias.map(categoria =>(
                  <option key={categoria.id_Categoria} value={categoria.id_Categoria}>{categoria.Nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="proveedor" className='mb-3'>
              <Form.Label>Proveedor</Form.Label>
              <Form.Select name='proveedor' onChange={handleChange}>
                <option selected disabled>Selecciona un proveedor</option>
                {proveedores.map(proveedor =>(
                  <option key={proveedor.id_Proveedor} value={proveedor.id_Proveedor}>{proveedor.Proveedor}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="price" className='mb-3'>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" name='precio' onChange={handleChange} required />
            </Form.Group>
            <Button type='submit'>Agregar Producto</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}