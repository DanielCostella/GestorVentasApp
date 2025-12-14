import { useState, useEffect } from 'react'
import { Container, Card, Row, Col, Badge, Button, ListGroup } from 'react-bootstrap'
import { NavbarPagina } from '../Components/NavbarPagina'
import { Footer } from '../Components/Footer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

const socket = io('http://localhost:8000')

export const Cocina = () => {
  const [pedidos, setPedidos] = useState([])
  const navigate = useNavigate()
  const idSucursal = sessionStorage.getItem('idSucursal')
  const idEmpleado = sessionStorage.getItem('idEmpleado')

  // Verificar que sea un empleado válido
  useEffect(() => {
    if (!idEmpleado) {
      navigate('/login')
    }
  }, [idEmpleado, navigate])

  // Función para cargar pedidos
  const cargarPedidos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pedidos-cocina/pendientes/${idSucursal}`)
      setPedidos(response.data)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    }
  }

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos()
  }, [idSucursal])

  // Escuchar evento de nuevo pedido en tiempo real
  useEffect(() => {
    socket.on('nuevoPedido', (data) => {
      console.log('🔔 Nuevo pedido recibido:', data)
      
      // Mostrar notificación
      Swal.fire({
        icon: 'info',
        title: '¡Nuevo Pedido!',
        text: 'Pedido #' + data.id_pedido + ' recibido',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: 'top-end'
      })

      // Recargar pedidos
      cargarPedidos()
    })

    // Limpiar el listener al desmontar
    return () => {
      socket.off('nuevoPedido')
    }
  }, [idSucursal])

  // Marcar pedido como entregado
  const marcarEntregado = async (idPedido) => {
    try {
      await axios.put(`http://localhost:8000/pedidos-cocina/${idPedido}/entregado`)
      
      Swal.fire({
        icon: 'success',
        title: 'Pedido Entregado',
        showConfirmButton: false,
        timer: 1500
      })

      cargarPedidos()
    } catch (error) {
      console.error('Error al marcar pedido:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo marcar el pedido como entregado'
      })
    }
  }

  // Cambiar estado del pedido
  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:8000/pedidos-cocina/${idPedido}/estado`, {
        estado: nuevoEstado
      })
      
      cargarPedidos()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
    }
  }

  const getEstadoBadge = (estado) => {
    const estilos = {
      'Pendiente': 'danger',
      'En Preparacion': 'warning',
      'Listo': 'success',
      'Entregado': 'secondary'
    }
    return estilos[estado] || 'secondary'
  }

  return (
    <>
      <NavbarPagina />
      <Container className="mt-4 mb-5">
        <h1 className="text-center mb-4">🍳 COCINA - Pedidos en Tiempo Real</h1>
        
        <Row className="mb-3">
          <Col>
            <Button variant="primary" onClick={cargarPedidos}>
              🔄 Actualizar Pedidos
            </Button>
          </Col>
        </Row>

        {pedidos.length === 0 ? (
          <Card className="text-center p-5">
            <h3>✅ No hay pedidos pendientes</h3>
          </Card>
        ) : (
          <Row>
            {pedidos.map((pedido) => (
              <Col md={6} lg={4} key={pedido.id_Pedido} className="mb-4">
                <Card border={pedido.Estado === 'Pendiente' ? 'danger' : 'warning'}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <strong>Pedido #{pedido.id_Pedido}</strong>
                    <Badge bg={getEstadoBadge(pedido.Estado)}>
                      {pedido.Estado}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Cajero:</strong> {pedido.Cajero} {pedido.Apellido_Cajero}</p>
                    <p><strong>Hora:</strong> {new Date(pedido.created_at).toLocaleTimeString('es-AR')}</p>
                    
                    {pedido.Observaciones && (
                      <p className="text-muted"><em>{pedido.Observaciones}</em></p>
                    )}

                    <hr />
                    <h6>Productos:</h6>
                    <ListGroup variant="flush">
                      {pedido.productos && pedido.productos.map((prod, idx) => (
                        <ListGroup.Item key={idx} className="d-flex justify-content-between">
                          <span>{prod.Nombre_Producto}</span>
                          <Badge bg="primary" pill>x{prod.Cantidad}</Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <div className="mt-3 d-grid gap-2">
                      {pedido.Estado === 'Pendiente' && (
                        <Button 
                          variant="warning" 
                          onClick={() => cambiarEstado(pedido.id_Pedido, 'En Preparacion')}
                        >
                          👨‍🍳 Iniciar Preparación
                        </Button>
                      )}
                      
                      {pedido.Estado === 'En Preparacion' && (
                        <Button 
                          variant="success" 
                          onClick={() => cambiarEstado(pedido.id_Pedido, 'Listo')}
                        >
                          ✅ Marcar Listo
                        </Button>
                      )}

                      {pedido.Estado === 'Listo' && (
                        <Button 
                          variant="primary" 
                          onClick={() => marcarEntregado(pedido.id_Pedido)}
                        >
                          🚀 Entregar
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  )
}
