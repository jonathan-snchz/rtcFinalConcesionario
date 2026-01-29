import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogInForm from './LogInForm';
import './LogIn.css';

const LogIn = () => {
  const [formError, setFormError] = useState('');
  const { isAuthenticated, isLoading, login } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (email, password) => {
    try {
      setFormError('');
      await login(email, password);
      return { success: true };
    } catch (error) {
      setFormError(error.message || 'Error al iniciar sesión');
      return { success: false, error };
    }
  };

  return (
    <div className="logInContainer">
      <LogInForm 
        onSubmit={handleLogin}
        serverError={formError}
        loading={isLoading}
      />
    </div>
  );
};

export default LogIn;