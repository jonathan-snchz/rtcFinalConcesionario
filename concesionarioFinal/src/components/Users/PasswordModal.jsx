import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../Modal/Modal';
import FormInput from '../FormComponents/FormInput';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';

const PasswordModal = ({ 
  onSave, 
  onCancel, 
  loading = false,
  error = null 
}) => {
  const [formError, setFormError] = useState(error);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      await onSave(data.oldPassword, data.newPassword);
      reset();
    } catch (err) {
      setFormError(err.message || 'Error al cambiar la contraseña');
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title="Cambiar Contraseña"
      onClose={handleCancel}
      size="small"
    >
      {formError && (
        <Alert type="error" message={formError} dismissible />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="passwordForm">
        <div className="formSection">
          <h3>Credenciales</h3>
          
          <div className="formRow fullWidth">
            <FormInput
              label="Contraseña Actual"
              type="password"
              register={register}
              name="oldPassword"
              errors={errors}
              placeholder="Ingresa tu contraseña actual"
              required={true}
              disabled={loading}
              rules={{
                required: 'La contraseña actual es requerida',
                minLength: {
                  value: 4,
                  message: 'La contraseña debe tener al menos 4 caracteres'
                }
              }}
            />
          </div>

          <div className="formRow fullWidth">
            <FormInput
              label="Nueva Contraseña"
              type="password"
              register={register}
              name="newPassword"
              errors={errors}
              placeholder="Ingresa tu nueva contraseña"
              required={true}
              disabled={loading}
              rules={{
                required: 'La nueva contraseña es requerida',
                minLength: {
                  value: 4,
                  message: 'La contraseña debe tener al menos 4 caracteres'
                }
              }}
            />
          </div>

          <div className="formRow fullWidth">
            <FormInput
              label="Confirmar Nueva Contraseña"
              type="password"
              register={register}
              name="confirmPassword"
              errors={errors}
              placeholder="Confirma tu nueva contraseña"
              required={true}
              disabled={loading}
              rules={{
                required: 'Por favor confirma tu contraseña',
                validate: value => 
                  value === getValues('newPassword') || 'Las contraseñas no coinciden'
              }}
            />
          </div>
        </div>

        <FormActions
          loading={loading}
          isEditMode={false}
          onCancel={handleCancel}
          submitText={loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        />
      </form>
    </Modal>
  );
};

export default PasswordModal;