import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import FormInput from '../FormComponents/FormInput';
import FormSelect from '../FormComponents/FormSelect';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import { PAYMENT_METHOD_OPTIONS, formatDateForInput, formatText } from '../../utils/data';
import './Sales.css';

const SaleForm = ({ sale, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!sale;
  
  const { loading, error: serverError, get, post, put, setError } = useApi();
  const [cars, setCars] = useState([]);
  const [clients, setClients] = useState([]);
  const [nextId, setNextId] = useState(null);
  const [isFromCarDetail, setIsFromCarDetail] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [fetchError, setFetchError] = useState('');

  const carFromState = location.state?.car;

  const getDefaultDeliveryDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 7);
    return delivery.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: sale || {
      id: '',
      car: '',
      client: '',
      date: formatDateForInput(new Date()),
      delivery: getDefaultDeliveryDate(),
      payment: 'transacción bancaria',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        if (!isEditMode) {
          const salesData = await get('/sales');
          if (isMounted) {
            const maxId = salesData.length > 0 
              ? Math.max(...salesData.map(s => s.id))
              : 0;
            setNextId(maxId + 1);
          }
        }

        const carsData = await get('/cars');
        const availableCars = isEditMode 
          ? carsData 
          : carsData.filter(car => car.availability === 'disponible');
        
        const clientsData = await get('/clients');
        
        if (isMounted) {
          setCars(availableCars);
          setClients(clientsData);
          setFetchError('');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setFetchError('Error al cargar los datos necesarios');
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
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

  useEffect(() => {
    if (!isEditMode && nextId) {
      setValue('id', nextId);
    }
  }, [nextId, isEditMode, setValue]);

  const onSubmit = async (formData) => {
    setError('');
    setFetchError('');
    
    try {
      const url = isEditMode ? `/sales/${sale.id}` : '/sales';
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
      setFetchError(error.message || 'Error al guardar la venta');
    }
  };

  const carOptions = cars.map(car => ({
    value: car._id,
    label: `${formatText(car.brand)} ${car.model} (${car.year}) - ${car.vin}`
  }));

  const clientOptions = clients.map(client => ({
    value: client._id,
    label: `${client.name} (ID: ${client.id}) - ${client.email}`
  }));

  const paymentOptions = PAYMENT_METHOD_OPTIONS;

  const displayError = fetchError || serverError;

  return (
    <div className="saleFormContainer">
      <form onSubmit={handleSubmit(onSubmit)} className="saleForm">
        
        {displayError && (
          <Alert type="error" message={displayError} />
        )}

        <div className="formSection">
          <h3>Información de la Venta</h3>
          
          {isFromCarDetail && carFromState && (
            <div className="preselectedCarInfo">
              <h4>Vendiendo Este Coche:</h4>
              <p><strong>{formatText(carFromState.brand)} {carFromState.model} ({carFromState.year})</strong></p>
              <p>VIN: {carFromState.vin} • Precio: ${carFromState.price?.toLocaleString()}</p>
              <p className="preselectedNote">
                Este coche está preseleccionado. No puedes cambiarlo cuando inicias una venta desde la página de detalles del coche.
              </p>
              <input
                type="hidden"
                {...register('car', { required: 'Coche es requerido' })}
                value={selectedCarId}
              />
            </div>
          )}

          <div className="formRow">
            <FormInput
              label="ID Venta"
              type="number"
              register={register}
              name="id"
              errors={errors}
              placeholder="Auto-generado"
              required={true}
              readOnly={true}
              disabled={loading}
            />

            {!isFromCarDetail && (
              <FormSelect
                label="Coche"
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
            />

            <FormInput
              label="Fecha de Entrega"
              type="date"
              register={register}
              name="delivery"
              errors={errors}
              required={true}
              disabled={loading}
            />
          </div>
        </div>

        <div className="formActions">
          <Button 
            type="submit" 
            variant="success"
            disabled={loading || (!isEditMode && !nextId)}
          >
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar Venta' : 'Registrar Venta'}
          </Button>
          
          {onCancel ? (
            <Button 
              type="button" 
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/sales')}
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

export default SaleForm;