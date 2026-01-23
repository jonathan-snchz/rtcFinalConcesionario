import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../NavBar/NavBar';
import Button from '../Buttons/Button';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="header">
      <Navbar />
      
      {isAuthenticated && user && (
        <div className="userSection">
          <span className="userGreeting">
            Hola, <strong>{user.name || user.username || 'Usuario'}</strong>!
            {user.email && ` (${user.email})`}
          </span>
          <Button 
            variant="danger"
            onClick={handleLogout}
            size="small"
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;