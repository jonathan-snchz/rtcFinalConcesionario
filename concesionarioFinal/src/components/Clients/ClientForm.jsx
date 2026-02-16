import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import FormInput from '../FormComponents/FormInput';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';
import './Clients.css';

const ClientForm = ({ client, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const isEditMode = !!client;
  
  const { loading, error: serverError, post, put } = useApi();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: client || {
      name: '',
      email: '',
      preferences: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (formData) => {
    try {
      setFormError('');
      
      const url = isEditMode 
        ? `/clients/${client.id}`
        : '/clients';
      
      const method = isEditMode ? put : post;

      const result = await method(url, formData);

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/clients');
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      setFormError(error.message || 'Error al guardar el cliente');
    }
  };

  const displayError = formError || serverError;

  return (
    <div className="clientFormContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="clientForm">
        
        {displayError && (
          <Alert type="error" message={displayError} dismissible />
        )}

        <div className="formSection">
          <h3>Información del Cliente</h3>
          
          <div className="formRow">

            <FormInput
              label="Nombre"
              type="text"
              register={register}
              name="name"
              errors={errors}
              placeholder="Nombre del cliente"
              required={true}
              disabled={loading}
              rules={{
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
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
              placeholder="Email del cliente"
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

            <div className="formGroup">
              <label>
                Preferencias
              </label>
              <textarea
                {...register('preferences')}
                disabled={loading}
                placeholder="Preferencias del cliente"
                rows="4"
                className="formTextarea"
              />
            </div>
          </div>
        </div>

        <FormActions
          loading={loading}
          isEditMode={isEditMode}
          onCancel={onCancel}
          submitText={isEditMode ? 'Actualizar Cliente' : 'Agregar Cliente'}
        />
      </form>
    </div>
  );
};

export default ClientForm;