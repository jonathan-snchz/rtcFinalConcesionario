import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';

const LogInForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data.email, data.password);

    if (!result.success) {
      setError('root.serverError', {
        type: 'server',
        message: result.error?.message || 'Invalid email or password',
      });
    }
  };

  return (
    <div className="logInCard">
      <div className="logInHeader">
        <h2>Login</h2>
        <p>Introduce tus credenciales</p>
      </div>

      {errors.root?.serverError && (
        <Alert type="error" message={errors.root.serverError.message} />
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="logInForm">
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Introduce el correo"
            className={`formInput ${errors.email ? 'error' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            disabled={loading}
          />
          {errors.email && (
            <span className="errorMessage">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="formGroup">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce la contraseña"
            className={`formInput ${errors.password ? 'error' : ''}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 4,
                message: 'Password must be at least 4 characters',
              },
            })}
            disabled={loading}
          />
          {errors.password && (
            <span className="errorMessage">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="logInButton"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;