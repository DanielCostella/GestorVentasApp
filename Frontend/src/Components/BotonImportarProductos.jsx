import { useState } from 'react'
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_IMPORTAR_PRODUCTOS } from '../constants/constants'

export const BotonImportarProductos = () => {
  const [show, setShow] = useState(false)
  const [archivo, setArchivo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)

  const handleClose = () => {
    setShow(false)
    setArchivo(null)
    setResultado(null)
  }
  
  const handleShow = () => setShow(true)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea un archivo Excel
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setArchivo(file)
        setResultado(null)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Solo se aceptan archivos Excel (.xlsx, .xls)',
          timer: 2000
        })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!archivo) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un archivo',
        timer: 1500
      })
      return
    }

    setCargando(true)
    
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append('archivo', archivo)

      const response = await axios.post(URL_IMPORTAR_PRODUCTOS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResultado(response.data)
      setCargando(false)

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Importación exitosa!',
          html: `
            <p><strong>Productos creados:</strong> ${response.data.productosCreados}</p>
            <p><strong>Productos actualizados:</strong> ${response.data.productosActualizados}</p>
            <p><strong>Total procesados:</strong> ${response.data.totalProcesados}</p>
          `,
          timer: 3000
        }).then(() => {
          window.location.reload()
        })
      }

    } catch (error) {
      setCargando(false)
      console.error('Error al importar:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error en la importación',
        text: error.response?.data?.message || 'Error al procesar el archivo',
        timer: 2000
      })
    }
  }

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        📥 Importar desde Excel
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Importar Productos desde Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Formato del archivo Excel:</strong>
            <ul className="mb-0 mt-2">
              <li>Columnas requeridas: <code>Nombre, Categoria, Proveedor, Precio</code></li>
              <li>Columnas opcionales: <code>Stock, Imagen</code></li>
              <li>La primera fila debe contener los nombres de las columnas</li>
              <li>Si la categoría o proveedor no existen, se crearán automáticamente</li>
            </ul>
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="archivoExcel" className="mb-3">
              <Form.Label>Seleccionar archivo Excel</Form.Label>
              <Form.Control 
                type="file" 
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={cargando}
              />
              {archivo && (
                <Form.Text className="text-success">
                  Archivo seleccionado: <strong>{archivo.name}</strong>
                </Form.Text>
              )}
            </Form.Group>

            {resultado && resultado.errores && (
              <Alert variant="warning">
                <strong>Advertencias:</strong>
                <ul className="mb-0 mt-2">
                  {resultado.errores.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose} disabled={cargando}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={cargando || !archivo}>
                {cargando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      className="me-2"
                    />
                    Importando...
                  </>
                ) : (
                  'Importar'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
