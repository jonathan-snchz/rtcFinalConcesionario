import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import RegisterForm from './RegisterForm';
import './Register.css';

const Register = () => {
  const [formError, setFormError] = useState('');
  const { isAuthenticated } = useAuth();
  const { post, loading } = useApi();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleRegister = async (name, email, password) => {
    try {
      setFormError('');
      await post('/users/register', { name, email, password });
      
      navigate('/users', { 
        state: { message: 'Usuario registrado exitosamente' }
      });

    } catch (error) {
      setFormError(error.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="registerContainer">
      <RegisterForm
        onSubmit={handleRegister}
        serverError={formError}
        loading={loading}
      />
    </div>
  );
};

export default Register;