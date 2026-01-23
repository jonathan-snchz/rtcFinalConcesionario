import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import RegisterForm from './RegisterForm';
import './Register.css';

const Register = () => {
  const [serverError, setServerError] = useState('');
  const { isAuthenticated } = useAuth();
  const { post, loading } = useApi();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleRegister = async (name, email, password) => {
    setServerError('');
    
    try {
      await post('/users/register', { name, email, password });
      
      navigate('/users', { 
        state: { message: 'Usuario registrado exitosamente' }
      });

    } catch (error) {
      setServerError(error.message || 'Registration failed');
    }
  };

  return (
    <div className="registerContainer">
      <RegisterForm
        onSubmit={handleRegister}
        serverError={serverError}
        isSubmitting={loading}
      />
    </div>
  );
};

export default Register;