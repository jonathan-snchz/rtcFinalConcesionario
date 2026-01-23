import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogInForm from './LogInForm';
import './LogIn.css';

const LogIn = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <div className="logInContainer">
      <LogInForm onSubmit={handleLogin} />
    </div>
  );
};

export default LogIn;
