import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import FormInput from '../FormComponents/FormInput';
import FormSelect from '../FormComponents/FormSelect';
import FormActions from '../FormComponents/FormActions';
import Alert from '../Alerts/Alert';
import { PAYMENT_METHOD_OPTIONS, formatDateForInput, formatText } from '../../utils/data';
import './Sales.css';

const SaleForm = ({ sale, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!sale;
  
  const { loading, error: serverError, get, post, put } = useApi();
  const [cars, setCars] = useState([]);
  const [clients, setClients] = useState([]);
  const [isFromCarDetail, setIsFromCarDetail] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [formError, setFormError] = useState('');

  const carFromState = location.state?.car;

  const getDefaultDeliveryDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 7);
    return formatDateForInput(delivery);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: sale ? {
      ...sale,
      date: formatDateForInput(sale.date),
      delivery: formatDateForInput(sale.delivery)
    } : {
      car: '',
      client: '',
      date: formatDateForInput(new Date()),
      delivery: getDefaultDeliveryDate(),
      payment: 'transacción bancaria',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsData = await get('/cars');
        const availableCars = isEditMode 
          ? carsData 
          : carsData.filter(car => car.availability === 'disponible');
        
        const clientsData = await get('/clients');
        
        setCars(availableCars);
        setClients(clientsData);
        setFormError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError('Error al cargar los datos necesarios');
      }
    };

    fetchData();
    
  }, [isEditMode, get]);

  useEffect(() => {
    if (carFromState?._id && cars.length > 0) {
      const matchingCar = cars.find(car => car._id === carFromState._id);
      if (matchingCar) {
        setIsFromCarDetail(true);
        setSelectedCarId(matchingCar._id);
        setValue('car', matchingCar._id);
      }
    }
  }, [carFromState, cars, setValue]);

  const onSubmit = async (formData) => {
    try {
      setFormError('');
      
      const url = isEditMode 
        ? `/sales/${sale.id}`
        : '/sales';
      
      const method = isEditMode ? put : post;

      const result = await method(url, formData);
      
      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/sales', {
          state: { 
            message: isEditMode 
              ? 'Venta actualizada exitosamente' 
              : 'Venta registrada exitosamente' 
          }
        });
      }
    } catch (error) {
      console.error('Error saving sale:', error);
      setFormError(error.message || 'Error al guardar la venta');
    }
  };

  const carOptions = cars
    .filter(car => car.availability !== 'vendido')
    .map(car => ({
      value: car._id,
      label: `${formatText(car.brand)} ${car.model} (${car.year}) - ${car.vin}`
  }));

  const clientOptions = clients.map(client => ({
    value: client._id,
    label: `${client.name} (ID: ${client.id}) - ${client.email}`
  }));

  const paymentOptions = PAYMENT_METHOD_OPTIONS;

  const displayError = formError || serverError;

  return (
    <div className="saleFormContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="saleForm">
        
        {displayError && (
          <Alert type="error" message={displayError} dismissible />
        )}

        <div className="formSection">
          <h3>Información de la Venta</h3>
          
          {isFromCarDetail && carFromState && (
            <div className="preselectedCarInfo">
              <h4>Vendiendo Este Vehículo:</h4>
              <p><strong>{formatText(carFromState.brand)} {carFromState.model} ({carFromState.year})</strong></p>
              <p>VIN: {carFromState.vin} • Precio: ${carFromState.price?.toLocaleString()}</p>
              <p className="preselectedNote">
                Este vehículo está preseleccionado. No puedes cambiarlo cuando inicias una venta desde la página de detalles del vehículo.
              </p>
              <input
                type="hidden"
                {...register('car', { required: 'Vehículo es obligatorio' })}
                value={selectedCarId}
              />
            </div>
          )}

          <div className="formRow">

            {!isFromCarDetail && (
              <FormSelect
                label="Vehículo"
                register={register}
                name="car"
                errors={errors}
                options={carOptions}
                required={true}
                disabled={loading}
              />
            )}
          </div>

          <div className="formRow">
            <FormSelect
              label="Cliente"
              register={register}
              name="client"
              errors={errors}
              options={clientOptions}
              required={true}
              disabled={loading}
            />

            <FormSelect
              label="Método de Pago"
              register={register}
              name="payment"
              errors={errors}
              options={paymentOptions}
              required={true}
              disabled={loading}
            />
          </div>

          <div className="formRow">
            <FormInput
              label="Fecha de Venta"
              type="date"
              register={register}
              name="date"
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

            <FormInput
              label="Fecha de Entrega"
              type="date"
              register={register}
              name="delivery"
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
          </div>
        </div>

        <FormActions
          loading={loading}
          isEditMode={isEditMode}
          onCancel={onCancel}
          submitText={isEditMode ? 'Actualizar Venta' : 'Registrar Venta'}
        />
      </form>
    </div>
  );
};

export default SaleForm;