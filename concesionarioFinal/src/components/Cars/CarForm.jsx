import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import FormInput from '../FormComponents/FormInput';
import FormSelect from '../FormComponents/FormSelect';
import ImageUploader from '../FormComponents/ImageUploader';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';
import { CAR_BRAND_OPTIONS, CAR_TYPE_OPTIONS, CAR_CONDITION_OPTIONS, CAR_AVAILABILITY_OPTIONS, formatDateForInput } from '../../utils/data';
import './Cars.css';

const CarForm = ({ car, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditMode = !!car;
  
  const { loading, error: serverError, post, put } = useApi();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(car?.img || '');
  const [formError, setFormError] = useState('');

  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: car ? {
      ...car,
      buyedWhen: formatDateForInput(car.buyedWhen)
    } : {
      vin: '',
      brand: '',
      model: '',
      type: 'turismo',
      year: currentYear,
      condition: 'usado',
      km: 0,
      price: 0,
      buyedWhen: formatDateForInput(new Date()),
      availability: 'disponible',
      color: '',
    },
    mode: 'onBlur',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar el archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormError('Formato de imagen no válido. Use JPG, PNG, GIF o WebP');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setValue('img', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (formData) => {
    try {
      setFormError('');
      
      const url = isEditMode 
        ? `/cars/${car.vin}`
        : '/cars';
      
      const method = isEditMode ? put : post;

      const formDataToSend = new FormData();
      
      const fieldsToSend = [
        'vin', 'brand', 'model', 'type', 'year', 'condition',
        'km', 'price', 'buyedWhen', 'availability', 'color'
      ];
      
      fieldsToSend.forEach(field => {
        const value = formData[field];
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(field, value);
        }
      });
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
      else if (isEditMode && !selectedFile && !imagePreview) {
        formDataToSend.append('img', '');
      }

      const result = await method(url, formDataToSend);

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/cars');
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      setFormError(error.message || 'Error al guardar el vehículo');
    }
  };

  const displayError = formError || serverError;

  return (
    <div className="carFormContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="carForm">
        
        {displayError && (
          <Alert type="error" message={displayError} dismissible />
        )}

        <ImageUploader
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          onRemove={handleRemoveImage}
          disabled={loading}
          label="Imagen del Vehículo"
        />

        <div className="formSection">
          <h3>Información del Vehículo</h3>
          
          <div className="formRow">
            <FormInput
              label="VIN"
              type="text"
              register={register}
              name="vin"
              errors={errors}
              placeholder="Ingresar VIN de 17 caracteres"
              required={true}
              readOnly={isEditMode}
              disabled={loading}
              rules={{
                minLength: { value: 17, message: 'VIN debe tener 17 caracteres' },
                maxLength: { value: 17, message: 'VIN debe tener 17 caracteres' }
              }}
            />

            <FormSelect
              label="Marca"
              register={register}
              name="brand"
              errors={errors}
              options={CAR_BRAND_OPTIONS}
              required={true}
              disabled={loading}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Modelo"
              type="text"
              register={register}
              name="model"
              errors={errors}
              placeholder="Modelo del vehículo"
              disabled={loading}
            />

            <FormSelect
              label="Tipo"
              register={register}
              name="type"
              errors={errors}
              options={CAR_TYPE_OPTIONS}
              required={true}
              disabled={loading}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Año"
              type="number"
              register={register}
              name="year"
              errors={errors}
              required={true}
              disabled={loading}
              rules={{
                min: { value: 1900, message: 'Año debe ser posterior a 1900' },
                max: { value: currentYear + 1, message: `Año no puede ser posterior a ${currentYear + 1}` }
              }}
            />

            <FormSelect
              label="Condición"
              register={register}
              name="condition"
              errors={errors}
              options={CAR_CONDITION_OPTIONS}
              required={true}
              disabled={loading}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Kilómetros"
              type="number"
              register={register}
              name="km"
              errors={errors}
              required={true}
              disabled={loading}
              rules={{
                min: { value: 0, message: 'Kilómetros no pueden ser negativos' }
              }}
            />

            <FormInput
              label="Precio"
              type="number"
              register={register}
              name="price"
              errors={errors}
              required={true}
              disabled={loading}
              rules={{
                min: { value: 0, message: 'Precio no puede ser negativo' }
              }}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Fecha de Compra"
              type="date"
              register={register}
              name="buyedWhen"
              errors={errors}
              required={true}
              disabled={loading}
              rules={{
                validate: value => {
                  const date = new Date(value);
                  return !isNaN(date.getTime()) || 'Fecha inválida';
                }
              }}
            />

            <FormSelect
              label="Disponibilidad"
              register={register}
              name="availability"
              errors={errors}
              options={CAR_AVAILABILITY_OPTIONS}
              required={true}
              disabled={loading}
            />
          </div>

          <div className="formRow fullWidth">
            <FormInput
              label="Color"
              type="text"
              register={register}
              name="color"
              errors={errors}
              placeholder="Ingresar color"
              disabled={loading}
            />
          </div>
        </div>

        <FormActions
          loading={loading}
          isEditMode={isEditMode}
          onCancel={onCancel}
          submitText={isEditMode ? 'Actualizar Vehículo' : 'Agregar Vehículo'}
        />
      </form>
    </div>
  );
};

export default CarForm;