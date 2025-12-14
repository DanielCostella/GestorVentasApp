import {Nav,Navbar,Container} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import '../css/footer.css'
//componente footer
export const Footer = () => {
  return (
    <>
      <Navbar className="footer">
        <Container className="d-flex flex-wrap justify-content-center">
            <Nav className="me-auto">
              <NavLink to="/" className={"text-decoration-none text-dark me-3"}>Volver al inicio</NavLink>
            </Nav>
            <div className="copy">
              <small className="">Copyright © 2025. Todos los derechos reservados | Contacto: dcostella93@gmail.com</small>  
            </div>
          </Container>
      </Navbar>
    </>
  )
}