import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CarForm from './CarForm';
import useApi from '../../hooks/useApi';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import InfoGrid from '../InfoDisplay/InfoGrid';
import InfoItem from '../InfoDisplay/InfoItem';
import { formatDate, formatText, formatCurrency, formatKilometers } from '../../utils/data';
import './Cars.css';

const CarDetail = () => {
  const { vin } = useParams();
  const navigate = useNavigate();
  const { loading, error: apiError, get, del } = useApi();
  const [car, setCar] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await get(`/cars/${vin}`);
        setCar(data);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching car:', error);
        setFetchError(error.message || 'Error al cargar el vehículo');
      }
    };

    fetchCar();
  }, [vin, get]);

  const handleDelete = async () => {
    try {
      await del(`/cars/${vin}`);
      
      navigate('/cars', { 
        state: { message: 'Vehículo eliminado' }
      });
      
    } catch (error) {
      console.error('Delete error:', error);
      setShowDeleteConfirm(false);
      setFetchError(error.message || 'Error al eliminar el vehículo');
    }
  };

  const handleUpdate = (updatedCar) => {
    setCar(updatedCar);
    setShowEditForm(false);
    setFetchError('');
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setFetchError('');
  };

  const displayError = fetchError || apiError;

  if (loading && !car) return <div className="loading">Cargando detalles del vehículo...</div>;
  if (displayError && !car) return <Alert type="error" message={displayError} />;
  if (!car) return <div className="notFound">Vehículo no encontrado</div>;

  return (
    <div className="carDetailContainer">
      <Link to="/cars" className="backLink">← Volver al Inventario</Link>
      
      {displayError && !showDeleteConfirm && !showEditForm && (
        <Alert type="error" message={displayError} />
      )}

      <div className="carDetailHeader">
        <h1>{formatText(car.brand)} {car.model} ({car.year})</h1>
        <div className="carActions">
            {car.availability === 'disponible' && (
                <Button 
                  variant="success"
                  onClick={() => navigate('/sales/new', { state: { car } })}
                >
                  Iniciar Venta
                </Button>
            )}
          <Button 
            variant="primary"
            onClick={() => setShowEditForm(true)}
          >
            Editar
          </Button>
          <Button 
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {loading ? 'Eliminando...' : 'Sí, Eliminar'}
          </Button>
        </div>
      </div>

      <div className="carDetailContent">
        <div className="carImageSection">
          {car.img ? (
            <img src={car.img} alt={`${car.brand} ${car.model}`} className="carDetailImage" />
          ) : (
            <div className="carDetailImagePlaceholder">
              No hay imagen disponible
            </div>
          )}
        </div>

        <div className="carInfoSection">
            <InfoGrid columns={2}>
            <InfoItem label="VIN" value={car.vin} />
            <InfoItem label="Marca" value={formatText(car.brand)} />
            <InfoItem label="Modelo" value={car.model || 'N/A'} />
            <InfoItem label="Tipo" value={formatText(car.type)} />
            <InfoItem label="Año" value={car.year} />
            <InfoItem label="Condición" value={formatText(car.condition)} />
            <InfoItem label="Kilómetros">
                {formatKilometers(car.km)}
            </InfoItem>
            <InfoItem label="Precio">
                {formatCurrency(car.price)}
            </InfoItem>
            <InfoItem label="Color" value={car.color || 'N/A'} />
            <InfoItem label="Comprado">
                {formatDate(car.buyedWhen)}
            </InfoItem>
            <InfoItem label="Estado">
                <span className={`availabilityTag availability-${car.availability}`}>
                {formatText(car.availability)}
                </span>
            </InfoItem>
            <InfoItem label="Creado">
                {formatDate(car.createdAt)}
          </InfoItem>
            <InfoItem label="Actualizado">
                {formatDate(car.updatedAt)}
            </InfoItem>
            </InfoGrid>
        </div>
      </div>

      {showEditForm && (
        <Modal 
          title={`Editar Vehículo: ${car.vin}`}
          size="large"
        >
          <CarForm 
            car={car} 
            onSuccess={handleUpdate}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal
          title="¿Eliminar este vehículo?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setFetchError('');
          }}
          size="small"
        >
          <div className="deleteConfirm">
            <p>¿Estás seguro de que quieres eliminar este vehículo?</p>
            
            <div className="deletePreview">
              <strong>{car.brand} {car.model} ({car.year})</strong>
              <p>VIN: {car.vin}</p>
              <p>Precio: {formatCurrency(car.price)}</p>
            </div>
            
            <p className="warning">Esta acción no se puede deshacer.</p>
            
            <div className="modalActions">
              <Button 
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Sí, Eliminar'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFetchError('');
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarDetail;