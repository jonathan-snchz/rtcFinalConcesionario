import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="footerSection">
          <h4>Concesionario</h4>
          <p>Tu concesionario de confianza</p>
        </div>
        
        <div className="footerSection">
          <h4>Quick Links</h4>
          <ul className="footerLinks">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cars">Vehículos</Link></li>
            <li><Link to="/clients">Clientes</Link></li>
            <li><Link to="/sales">Ventas</Link></li>
            <li><Link to="/users">Usuarios</Link></li>
            <li><Link to="/profile">Perfil</Link></li>
          </ul>
        </div>
        
        <div className="footerSection">
          <h4>Contacto</h4>
          <p>soporte@concesionario.com</p>
          <p>+34 985 00 00 00</p>
        </div>
      </div>
      
      <div className="footerBottom">
        <p>© {currentYear} Concesionario.</p>
      </div>
    </footer>
  );
};

export default Footer;