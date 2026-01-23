import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/">Inicio</NavLink>
      {isAuthenticated ? (
        <>
          <NavLink to="/cars">Vehículos</NavLink>
          <NavLink to="/clients">Clientes</NavLink>
          <NavLink to="/sales">Ventas</NavLink>
          <NavLink to="/users">Usuarios</NavLink>
          <NavLink to="/profile">Perfil</NavLink>
          <NavLink to="/register">Registrar nuevo usuario</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/cars">Vehículos</NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;