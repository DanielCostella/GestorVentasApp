/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'
import { URL_PUT_PRODUCTO, URL_GET_PROVEEDORES, URL_GET_CATEGORIAS, URL_GET_PRODUCTO_ESPECIFICO } from '../constants/constants'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { FaPenClip } from "react-icons/fa6";
import Swal from 'sweetalert2'
//componente para editar producto recibiendo como dato el id
export const BotonEditarProducto = ({id}) => {
  const navigate = useNavigate()
  
 //haciendo uso del react-hook-form para el manejo de formularios
  const { register, handleSubmit } = useForm()
 //creando los estados 
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [productoEspecifico, setProductoEspecifico] = useState({})
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if(id){
      const obtenerProductoEsp = async () => {
        const res = await axios.get(URL_GET_PRODUCTO_ESPECIFICO + id)
        setProductoEspecifico(res.data[0])
      }

      obtenerProductoEsp()
    }
  }, [])

  useEffect(() => {
    const obtenerCategorias = async () => {
      const res = await axios.get(URL_GET_CATEGORIAS)
      setCategorias(res.data)
    }

    obtenerCategorias()
  }, [])

  useEffect(() => {
    const obtenerProveedores = async () => {
      const res = await axios.get(URL_GET_PROVEEDORES)
      setProveedores(res.data)
    }

    obtenerProveedores()
  }, [])

  const handleSubmitForm = (data) => {
    Swal.fire({
      title: '¿Estás seguro de querer editar este producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar!'
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(URL_PUT_PRODUCTO + id, {
            Nombre: data.nombre,
            id_Categoria: data.categoria,
            id_Proveedor: data.proveedor,
            Imagen: data.imagen,
            Precio: data.precio
          })
    
          if(res.data.status === 200){
            Swal.fire({
              title: 'Producto editado correctamente!',
              icon:'success',
              showConfirmButton: false,
              timer: 1500
            })
            navigate(0)
          }
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  return (
    <>
      <Button className="btn btn-primary me-2" onClick={handleShow}>
        <FaPenClip />
      </Button>

      <Modal show={show} onHide={handleClose} className="modal-editar">
        <Modal.Header style={{backgroundColor: "#0D6EFD"}} closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*Fomulario para editar el producto*/}
          <Form onSubmit={handleSubmit(handleSubmitForm)}>
            <Form.Group controlId="name" className='mb-3'>
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control defaultValue={productoEspecifico.Nombre} {...register("nombre")}  type="text"/>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Categoria</Form.Label>
              <Form.Select defaultValue={productoEspecifico.id_Categoria} {...register("categoria")} name="categoria"  className='form-select'>
                {categorias.map(categoria => (
                  <option key={categoria.id_Categoria} value={categoria.id_Categoria}>{categoria.Nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="proveedor" className='mb-3'>
              <Form.Label>Proveedor</Form.Label>
              <Form.Select defaultValue={productoEspecifico.id_Proveedor} {...register("proveedor")} name="proveedor"  className='form-select' >
                {
                  proveedores.map(proveedor => (
                    <option key={proveedor.id_Proveedor} value={proveedor.id_Proveedor}>{proveedor.Proveedor}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="price" className='mb-3'>
              <Form.Label>Precio</Form.Label>
              <Form.Control defaultValue={productoEspecifico.Precio} {...register("precio")} name='precio' type='text'/>
            </Form.Group>
            <Button type="submit">Editar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}