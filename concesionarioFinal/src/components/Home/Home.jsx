import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="homeContainer">
      <div className="homeHero">
        <h1>Concesionario</h1>
        <p className="homeSubtitle">
          {isAuthenticated 
            ? `Bienvenido, ${user?.name || 'User'}!`
            : 'Recuerda iniciar sesión!'
          }
        </p>
      </div>

      {isAuthenticated ? (
        <div className="dashboardGrid">
          <div className="dashboardCard">
            <h3>Vehículos</h3>
            <p>Controla el stock.</p>
            <Link to="/cars" className="dashboardLink">Ir a vehículos →</Link>
          </div>
          
          <div className="dashboardCard">
            <h3>Clientes</h3>
            <p>Encuentra al próximo comprador!</p>
            <Link to="/clients" className="dashboardLink">View Clients →</Link>
          </div>
          
          <div className="dashboardCard">
            <h3>Ventas</h3>
            <p>Registra tu nueva venta o gestiona antiguas operaciones.</p>
            <Link to="/sales" className="dashboardLink">View Sales →</Link>
          </div>
          
          <div className="dashboardCard">
            <h3>Usuarios</h3>
            <p>Necesitas añadir un nuevo usuario?</p>
            <Link to="/users" className="dashboardLink">View Users →</Link>
          </div>
          
          <div className="dashboardCard">
            <h3>Acciones directas</h3>
            <ul className="quickActions">
              <li><Link to="/cars/new">Añade un vehículo</Link></li>
              <li><Link to="/clients/new">Registra un cliente</Link></li>
              <li><Link to="/sales/new">Registra una venta</Link></li>
              <li><Link to="/register">Añade un usuario</Link></li>
              <li><Link to="/profile">Mi perfil</Link></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="loginPrompt">
          <div className="loginCard">
            <h3>Login Required</h3>
            <p>Por favor inicia sesión para validar tu identidad!</p>
            <div className="loginActions">
              <Link to="/login" className="loginButton">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;