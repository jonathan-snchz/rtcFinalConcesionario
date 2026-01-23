import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';

const RegisterForm = ({ onSubmit, serverError, isSubmitting }) => {
  const { isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.name, data.email, data.password);
  };

  const title = isAuthenticated ? 'Add New User' : 'Register';
  const submitText = isAuthenticated ? 'Add User' : 'Register';

  return (
    <div className="registerCard">
      <div className="registerHeader">
        <h2>{title}</h2>
        <p>{isAuthenticated ? 'Create a new user account' : 'Create a new account'}</p>
      </div>

      {serverError && (
        <Alert type="error" message={serverError} />
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="registerForm">
        <div className="formGroup">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter name"
            className={`formInput ${errors.name ? 'error' : ''}`}
            {...register('name', {
              required: 'Name is required',
            })}
            disabled={isSubmitting}
          />
          {errors.name && <span className="errorMessage">{errors.name.message}</span>}
        </div>

        <div className="formGroup">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className={`formInput ${errors.email ? 'error' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            disabled={isSubmitting}
          />
          {errors.email && <span className="errorMessage">{errors.email.message}</span>}
        </div>

        <div className="formGroup">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className={`formInput ${errors.password ? 'error' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 4,
                message: 'Password must be at least 4 characters',
              },
            })}
            disabled={isSubmitting}
          />
          {errors.password && <span className="errorMessage">{errors.password.message}</span>}
        </div>

        <Button 
          type="submit" 
          variant="success"
          disabled={isSubmitting}
          className="registerButton"
        >
          {isSubmitting ? 'Processing...' : submitText}
        </Button>
      </form>

      {!isAuthenticated && (
        <div className="registerFooter">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="registerLink">
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;