import { useForm } from 'react-hook-form';
import FormInput from '../FormComponents/FormInput';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';

const ProfileEditForm = ({ 
  user, 
  onSave, 
  onCancel, 
  loading = false,
  serverError = ''
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: user || {
      name: '',
      email: '',
    }
  });

  const onSubmit = async (data) => {
    await onSave(data);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="profileEditForm">
      {serverError && (
        <Alert type="error" message={serverError} dismissible />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formSection">
          <h3>Editar Perfil</h3>
          
          <div className="formRow">
            <FormInput
              label="Nombre"
              type="text"
              register={register}
              name="name"
              errors={errors}
              placeholder="Ingresa tu nombre"
              required={true}
              disabled={loading}
              rules={{
                required: 'El nombre es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              }}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Email"
              type="email"
              register={register}
              name="email"
              errors={errors}
              placeholder="Ingresa tu email"
              required={true}
              disabled={loading}
              rules={{
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido'
                }
              }}
            />
          </div>
        </div>

        <FormActions
          loading={loading}
          isEditMode={true}
          onCancel={handleCancel}
          submitText={loading ? 'Guardando...' : 'Guardar Cambios'}
        />
      </form>
    </div>
  );
};

export default ProfileEditForm;