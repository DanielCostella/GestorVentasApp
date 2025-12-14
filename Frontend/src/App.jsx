import { Routes, Route } from 'react-router-dom'
import { Ventas } from './Pages/Ventas'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { AdminProductos } from './Pages/AdminProductos'
import { AdminProveedores } from './Pages/AdminProveedores'
import { AdminCategorias } from './Pages/AdminCategorias'
import { AdminEmpleados } from './Pages/AdminEmpleados'
import { AdminSucursales } from './Pages/AdminSucursales'
import { Cocina } from './Pages/Cocina'
import { Error } from './Pages/Error'
import 'bootstrap/dist/css/bootstrap.css'

//declarando las rutas hacia la distintas pages
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element = {<Ventas />}/>
        <Route path='/login' element = {<Login />}/>
        <Route path='/register' element = {<Register />}/>
        <Route path='/cocina' element = {<Cocina />}/>
        <Route path='/administracion'>
          <Route path = 'productos' element = {<AdminProductos/>}/>
          <Route path = 'proveedores' element = {<AdminProveedores/>}/>
          <Route path = 'categorias' element = {<AdminCategorias/>}/>
          <Route path = 'empleados' element = {<AdminEmpleados/>}/>
          <Route path = 'sucursales' element = {<AdminSucursales/>}/>
        </Route>
        <Route path='*' element = {<Error />}/>
      </Routes> 
    </>
  )
}

export default App