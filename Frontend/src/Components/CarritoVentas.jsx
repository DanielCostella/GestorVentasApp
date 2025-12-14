import { useState, useEffect } from 'react'
import { Modal, Button, Table, Form } from 'react-bootstrap'
import axios from 'axios'
import { URL_GET_PRODUCTOS, URL_GET_TIPOSPAGOS, URL_POST_VENTA, URL_POST_PEDIDO_COCINA, URL_GET_EMPLEADOS } from '../constants/constants'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const CarritoVentas = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [productos, setProductos] = useState([])
  const [tiposPago, setTiposPago] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [carrito, setCarrito] = useState([])
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState('')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  
  const idEmpleadoLogueado = sessionStorage.getItem('idEmpleado')
  const idSucursal = sessionStorage.getItem('idSucursal')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get(URL_GET_PRODUCTOS)
        setProductos(res.data[0])
      } catch (error) {
        console.error('Error al obtener productos:', error)
      }
    }

    const obtenerTiposPago = async () => {
      try {
        const res = await axios.get(URL_GET_TIPOSPAGOS)
        setTiposPago(res.data)
      } catch (error) {
        console.error('Error al obtener tipos de pago:', error)
      }
    }

    const obtenerEmpleados = async () => {
      try {
        const res = await axios.get(URL_GET_EMPLEADOS)
        setEmpleados(res.data)
        // Preseleccionar el empleado logueado
        setEmpleadoSeleccionado(idEmpleadoLogueado)
      } catch (error) {
        console.error('Error al obtener empleados:', error)
      }
    }

    obtenerProductos()
    obtenerTiposPago()
    obtenerEmpleados()
  }, [])

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const productoExiste = carrito.find(item => item.id_Producto === producto.id_Producto)

    if (productoExiste) {
      setCarrito(carrito.map(item =>
        item.id_Producto === producto.id_Producto
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ))
    } else {
      setCarrito([...carrito, { ...producto, cantidad }])
    }
  }

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id_Producto) => {
    setCarrito(carrito.filter(item => item.id_Producto !== id_Producto))
  }

  // Cambiar cantidad manualmente
  const cambiarCantidad = (id_Producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id_Producto)
    } else {
      setCarrito(carrito.map(item =>
        item.id_Producto === id_Producto
          ? { ...item, cantidad: parseInt(nuevaCantidad) }
          : item
      ))
    }
  }

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.Precio * item.cantidad), 0).toFixed(2)
  }

  // Confirmar venta
  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agrega productos antes de confirmar la venta'
      })
      return
    }

    if (!tipoPagoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un tipo de pago'
      })
      return
    }

    if (!empleadoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona el vendedor',
        text: '¿Quién está atendiendo esta venta?'
      })
      return
    }

    try {
      // Registrar cada producto como una venta
      let ultimaVenta = null
      
      // Obtener fecha y hora local de Argentina (UTC-3)
      const ahora = new Date()
      const año = ahora.getFullYear()
      const mes = String(ahora.getMonth() + 1).padStart(2, '0')
      const dia = String(ahora.getDate()).padStart(2, '0')
      const horas = String(ahora.getHours()).padStart(2, '0')
      const minutos = String(ahora.getMinutes()).padStart(2, '0')
      const segundos = String(ahora.getSeconds()).padStart(2, '0')
      const fechaHoraActual = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`
      
      for (const item of carrito) {
        const response = await axios.post(URL_POST_VENTA, {
          id_Empleado: empleadoSeleccionado,
          id_TipoPago: tipoPagoSeleccionado,
          id_Producto: item.id_Producto,
          id_Sucursal: idSucursal,
          Cantidad: item.cantidad,
          Precio: item.Precio,
          Fecha: fechaHoraActual
        })
        ultimaVenta = response.data.id_Venta
      }

      // Enviar pedido a cocina
      const detallePedido = carrito.map(item => ({
        id_Producto: item.id_Producto,
        Cantidad: item.cantidad,
        Nombre: item.Nombre
      }))

      await axios.post(URL_POST_PEDIDO_COCINA, {
        id_venta: ultimaVenta,
        id_sucursal: idSucursal,
        id_empleado: empleadoSeleccionado,
        productos: detallePedido
      })

      Swal.fire({
        icon: 'success',
        title: 'Venta registrada',
        text: 'El pedido fue enviado a cocina',
        showConfirmButton: false,
        timer: 1500
      })

      setCarrito([])
      setTipoPagoSeleccionado('')
      setEmpleadoSeleccionado(idEmpleadoLogueado) // Volver al empleado logueado
      handleClose()
      navigate(0)

    } catch (error) {
      console.error('Error al registrar venta:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la venta'
      })
    }
  }

  // Verificar si es empanada
  const esEmpanada = (producto) => {
    return producto.Categoria.toLowerCase().includes('empanada')
  }

  return (
    <>
      <Button variant="success" size="lg" onClick={handleShow} className="mb-3 mx-4">
        🛒 Nueva Venta ({carrito.length})
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header style={{ backgroundColor: "#198754" }} className="text-white" closeButton>
          <Modal.Title>🛒 Carrito de Ventas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {/* COLUMNA IZQUIERDA: PRODUCTOS */}
            <div className="col-md-6">
              <h5 className="mb-3">Productos Disponibles</h5>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {productos.map(producto => (
                  <div key={producto.id_Producto} className="card mb-2">
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{producto.Nombre}</h6>
                          <small className="text-muted">${producto.Precio}</small>
                        </div>
                        <div>
                          {esEmpanada(producto) ? (
                            // Botones especiales para empanadas
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => agregarAlCarrito(producto, 1)}
                              >
                                +1
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => agregarAlCarrito(producto, 6)}
                              >
                                +6
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => agregarAlCarrito(producto, 12)}
                              >
                                +12
                              </button>
                            </div>
                          ) : (
                            // Botón normal para otros productos
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => agregarAlCarrito(producto, 1)}
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMNA DERECHA: CARRITO */}
            <div className="col-md-6">
              <h5 className="mb-3">Carrito ({carrito.length} items)</h5>
              {carrito.length === 0 ? (
                <p className="text-center text-muted">El carrito está vacío</p>
              ) : (
                <>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map(item => (
                        <tr key={item.id_Producto}>
                          <td>{item.Nombre}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '60px' }}
                              value={item.cantidad}
                              onChange={(e) => cambiarCantidad(item.id_Producto, e.target.value)}
                              min="1"
                            />
                          </td>
                          <td>${item.Precio}</td>
                          <td className="fw-bold">${(item.Precio * item.cantidad).toFixed(2)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => eliminarDelCarrito(item.id_Producto)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="mt-3">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">👤 Vendedor</Form.Label>
                      <Form.Select
                        value={empleadoSeleccionado}
                        onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                      >
                        <option value="">Selecciona el vendedor...</option>
                        {empleados.map(emp => (
                          <option key={emp.id_Empleado} value={emp.id_Empleado}>
                            {emp.Nombre} {emp.Apellido} ({emp.Rol})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">💳 Tipo de Pago</Form.Label>
                      <Form.Select
                        value={tipoPagoSeleccionado}
                        onChange={(e) => setTipoPagoSeleccionado(e.target.value)}
                      >
                        <option value="">Selecciona...</option>
                        {tiposPago.map(tp => (
                          <option key={tp.id_TipoPago} value={tp.id_TipoPago}>
                            {tp.Nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <h4 className="mb-0">TOTAL:</h4>
                      <h3 className="mb-0 text-success">${calcularTotal()}</h3>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCarrito([])}>
            Vaciar Carrito
          </Button>
          <Button variant="success" onClick={confirmarVenta}>
            Confirmar Venta
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
