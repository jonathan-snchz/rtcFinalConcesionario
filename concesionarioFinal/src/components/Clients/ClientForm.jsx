import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import FormInput from '../FormComponents/FormInput';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import './Clients.css';

const ClientForm = ({ client, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const isEditMode = !!client;
  
  const { loading, error: serverError, get, post, put } = useApi();
  const [nextId, setNextId] = useState(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchNextId = async () => {
      if (!isEditMode) {
        try {
          const clients = await get('/clients');
          if (isMounted) {
            const maxId = clients.length > 0 
              ? Math.max(...clients.map(c => c.id))
              : 0;
            setNextId(maxId + 1);
            setFetchError('');
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching next ID:', error);
            setNextId(1);
            setFetchError('Error al generar ID');
          }
        }
      }
    };

    fetchNextId();
    
    return () => {
      isMounted = false;
    };
  }, [isEditMode, get]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: client || {
      id: 1,
      name: '',
      email: '',
      preferences: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!isEditMode && nextId) {
      setValue('id', nextId);
    }
  }, [nextId, isEditMode, setValue]);

  const onSubmit = async (formData) => {
    try {
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
      setFetchError(error.message || 'Error al guardar el cliente');
    }
  };

  const displayError = fetchError || serverError;

  return (
    <div className="clientFormContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="clientForm">
        
        {displayError && (
          <Alert type="error" message={displayError} />
        )}

        <div className="formSection">
          <h3>Información del Cliente</h3>
          
          <div className="formRow">
            <FormInput
              label="ID Cliente"
              type="number"
              register={register}
              name="id"
              errors={errors}
              placeholder="Auto-generado"
              required={true}
              readOnly={true}
              disabled={loading || !nextId}
            />

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
                required: 'Nombre es requerido',
                minLength: { value: 2, message: 'Nombre debe tener al menos 2 caracteres' }
              }}
            />
          </div>

          <div className="formRow">
            <div className="formGroup fullWidth">
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
                  required: 'Email es requerido',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido'
                  }
                }}
              />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup fullWidth">
              <label>Preferencias</label>
              <textarea
                {...register('preferences')}
                disabled={loading}
                placeholder="Preferencias del cliente"
                rows="4"
                className="formInput"
              />
            </div>
          </div>
        </div>

        <div className="formActions">
          <Button 
            type="submit" 
            variant="success"
            disabled={loading || (!isEditMode && !nextId)}
          >
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar Cliente' : 'Agregar Cliente'}
          </Button>
          
          {onCancel && (
            <Button 
              type="button" 
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClientForm;