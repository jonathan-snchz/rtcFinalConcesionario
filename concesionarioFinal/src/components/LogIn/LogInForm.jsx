import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from '../FormComponents/FormInput';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';
import './LogIn.css';

const LogInForm = ({ onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data.email, data.password);

    if (!result.success) {
      setError('root.serverError', {
        type: 'server',
        message: result.error?.message || 'Correo o contraseña inválidos',
      });
    }
  };

  const displayError = errors.root?.serverError?.message;

  return (
    <div className="logInContainer">
      <div className="logInCard">
        <div className="logInHeader">
          <h2>Iniciar Sesión</h2>
          <p>Introduce tus credenciales</p>
        </div>

        {displayError && (
          <Alert type="error" message={displayError} dismissible />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="logInForm">
          <div className="formSection">
            <h3>Credenciales</h3>
            
            <div className="formRow">
              <FormInput
                label="Email"
                type="email"
                register={register}
                name="email"
                errors={errors}
                placeholder="Introduce el correo"
                required={true}
                disabled={loading}
                rules={{
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Por favor ingresa un correo válido',
                  },
                }}
              />
            </div>

            <div className="formRow">
              <FormInput
                label="Contraseña"
                type="password"
                register={register}
                name="password"
                errors={errors}
                placeholder="Introduce la contraseña"
                required={true}
                disabled={loading}
                rules={{
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 4,
                    message: 'La contraseña debe tener al menos 4 caracteres',
                  },
                }}
              />
            </div>
          </div>

          <FormActions
            loading={loading}
            isEditMode={false}
            onCancel={null}
            submitText={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            showCancel={false}
          />

          <div className="logInFooter">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogInForm;