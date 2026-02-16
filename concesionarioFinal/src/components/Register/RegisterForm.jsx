import { useForm } from 'react-hook-form';
import FormInput from '../FormComponents/FormInput';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';
import './Register.css';

const RegisterForm = ({ onSubmit, serverError, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.name, data.email, data.password);
  };

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <div className="registerHeader">
          <h2>Registrar nuevo usuario</h2>
          <p>Añadir un nuevo compañero</p>
        </div>

        {serverError && (
          <Alert type="error" message={serverError} dismissible />
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="registerForm">
          <div className="formSection">
            <h3>Información del Usuario</h3>
            
            <div className="formRow fullWidth">
              <FormInput
                label="Nombre"
                type="text"
                register={register}
                name="name"
                errors={errors}
                placeholder="Introduce un nombre"
                required={true}
                disabled={isSubmitting}
                rules={{
                  required: 'Hace falta un nombre',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                }}
              />
            </div>

            <div className="formRow fullWidth">
              <FormInput
                label="Email"
                type="email"
                register={register}
                name="email"
                errors={errors}
                placeholder="Introduce un email"
                required={true}
                disabled={isSubmitting}
                rules={{
                  required: 'Hace falta un correo',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'El correo no es válido'
                  }
                }}
              />
            </div>

            <div className="formRow fullWidth">
              <FormInput
                label="Contraseña"
                type="password"
                register={register}
                name="password"
                errors={errors}
                placeholder="Introduce la contraseña"
                required={true}
                disabled={isSubmitting}
                rules={{
                  required: 'Hace falta una contraseña',
                  minLength: {
                    value: 4,
                    message: 'La contraseña debe tener al menos 4 caracteres'
                  }
                }}
              />
            </div>
          </div>

          <FormActions
            loading={isSubmitting}
            isEditMode={false}
            submitText={isSubmitting ? 'Añadiendo...' : 'Registrar'}
            showCancel={false}
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;