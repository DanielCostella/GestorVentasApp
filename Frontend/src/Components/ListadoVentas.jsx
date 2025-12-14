import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Pagination from 'react-bootstrap/Pagination'
import { CarritoVentas } from './CarritoVentas'
import { BotonEditarVenta } from './BotonEditarVenta'
import { BotonEliminarVenta } from './BotonEliminarVenta'
import axios from 'axios'
import { URL_GET_VENTAS } from '../constants/constants'
//componte de listadoventas
export const ListadoVentas = () => {

  //estados independientes 
  const [ventas, setVentas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [total, setTotal] = useState(null)
  const [totalDiario, setTotalDiario] = useState(0)
  const [totalMensual, setTotalMensual] = useState(0)
  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 5

  useEffect(() => {
    const listarVentas = async () => {
      const idSucursal = sessionStorage.getItem('idSucursal')
      const url = idSucursal ? `${URL_GET_VENTAS}?id_Sucursal=${idSucursal}` : URL_GET_VENTAS
      const resp = await axios.get(url)
      if (resp.status === 200) {
        setVentas(resp.data.result[0])
        setTotal(resp.data.total)
        setTotalMensual(resp.data.totalMensual || 0)
        
        // Calcular total diario (hoy)
        const hoy = new Date().toISOString().split('T')[0]
        const ventasHoy = resp.data.result[0].filter(v => v.Fecha.includes(hoy))
        const sumaDiaria = ventasHoy.reduce((sum, v) => sum + parseFloat(v.Subtotal || 0), 0)
        setTotalDiario(sumaDiaria.toFixed(2))
      }
    }
    listarVentas()
  }, [])

  const handleInputChange = (e) => {
    setBusqueda(e.target.value)
    setPaginaActual(1)
  }

    
  let resultados = []

  if(!busqueda){
    resultados = ventas
  }
  else{
    resultados = ventas.filter((venta) => 
      venta.Producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.Empleado.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.TipoPago.toLowerCase().includes(busqueda.toLowerCase()) ||
      venta.id_Venta.toString().includes(busqueda)
    )
  }

  // Paginación
  const indiceUltimo = paginaActual * itemsPorPagina
  const indicePrimero = indiceUltimo - itemsPorPagina
  const ventasActuales = resultados.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(resultados.length / itemsPorPagina)

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina)

  // tabla que contiene la informacion de las ventas
  return (
    <>
      <h2 className="text-center mt-3">Listado de Ventas</h2>
      <CarritoVentas />
      <div className='mt-4'>
        <input type="text" className='px-2 py-1 w-25 mx-4 mb-4' onChange={handleInputChange} value={busqueda} placeholder='Buscar una venta...'/>
      </div>
      <div className='d-flex justify-content-center'> 
        <Table striped bordered hover className='w-75 text-center'>
        <thead>
          <tr>
            <th>ID de Venta</th>
            <th>Nombre del Producto</th>
            <th>Empleado</th>
            <th>Cantidad</th>
            <th>Tipo de Pago</th>
            <th>Subtotal</th>
            <th>Fecha de Venta</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {
            ventasActuales.map(venta => (
              <tr key={venta.id_Venta}>
                <td className='fw-bold'>{venta.id_Venta}</td>
                <td>{venta.Producto}</td>
                <td>{venta.Empleado}</td>
                <td>{venta.Cantidad}</td>
                {
                  venta.TipoPago === "Efectivo" ? 
                  <td className='text-success fw-bold'>{venta.TipoPago}</td>
                  :
                  venta.TipoPago === "Credito" ?
                  <td className='text-warning fw-bold'>{venta.TipoPago}</td>
                  :
                  venta.TipoPago === "Debito" ?
                  <td className='text-danger fw-bold'>{venta.TipoPago}</td>
                  :
                  <td className='text-primary fw-bold'>{venta.TipoPago}</td>
                }
                <td className='text-danger fw-bold'>${venta.Subtotal}</td>
                <td>
                  {new Date(venta.Fecha).toLocaleString('es-AR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </td>
                <td>
                  <BotonEditarVenta id = {venta.id_Venta}/>
                  <BotonEliminarVenta 
                  id = {venta.id_Venta}
                />
                </td>
              </tr>
            ))
          }
        </tbody>
        </Table>
      </div>
      
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className='d-flex justify-content-center mb-4'>
          <Pagination>
            <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
            <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
            
            {[...Array(totalPaginas)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === paginaActual}
                onClick={() => cambiarPagina(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            
            <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
            <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
          </Pagination>
        </div>
      )}

      <div className='text-center mb-4'>
        <div className='d-flex justify-content-center gap-5 mb-3'>
          <div className='p-3 bg-light border rounded'>
            <h5>📅 TOTAL HOY</h5>
            <h3 className='text-primary'>${totalDiario}</h3>
          </div>
          <div className='p-3 bg-light border rounded'>
            <h5>📆 TOTAL MES</h5>
            <h3 className='text-success'>${totalMensual}</h3>
          </div>
        </div>
        <h3 className='text-center'>💰 TOTAL GENERAL: <strong className='text-danger'>${total}</strong></h3>
      </div>
      
      <div className="d-flex justify-content-center mb-5">
        <button className='btn btn-outline-primary' onClick={() => print()}>Imprimir Venta</button>
      </div>
      <div style={{marginBottom: '100px'}}></div>
    </>
  )
}