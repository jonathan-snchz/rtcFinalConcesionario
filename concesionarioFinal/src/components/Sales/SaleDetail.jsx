import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import InfoGrid from '../InfoDisplay/InfoGrid';
import InfoItem from '../InfoDisplay/InfoItem';
import { formatDate, formatText, formatCurrency } from '../../utils/data';
import './Sales.css';

const SaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error: apiError, get, del } = useApi();
  const [sale, setSale] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const data = await get(`/sales/${id}`);
        setSale(data);
        setFetchError('');
      } catch (error) {
        console.error('Error fetching sale:', error);
        setFetchError(error.message || 'Error al cargar la venta');
      }
    };

    fetchSale();
    
  }, [id, get]);

  const handleDelete = async () => {
    try {
      await del(`/sales/${id}`);
      navigate('/sales', { 
        state: { message: 'Venta eliminada exitosamente' }
      });
    } catch (error) {
      console.error('Error al eliminar:', error);
      setShowDeleteConfirm(false);
      setFetchError(error.message || 'Error al eliminar la venta');
    }
  };

  const displayError = fetchError || apiError;

  if (loading && !sale) return <div className="loading">Cargando detalles de la venta...</div>;
  if (displayError && !sale) return <Alert type="error" message={displayError} />;
  if (!sale) return <div className="notFound">Venta no encontrada</div>;

  return (
    <div className="saleDetailContainer">
      <Link to="/sales" className="backLink">← Volver a Ventas</Link>
      
      {displayError && !showDeleteConfirm && (
        <Alert type="error" message={displayError} dismissible />
      )}

      <div className="saleDetailHeader">
        <h1>Venta #{sale.id}</h1>
        <div className="saleActions">
          <Button 
            variant="primary"
            onClick={() => navigate(`/sales/${id}/edit`)}
            disabled={loading}
          >
            Editar
          </Button>
          <Button 
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      <div className="saleDetailContent">
        <div className='saleDetailInfo'>
            <InfoGrid columns={2}>
                <InfoItem label="ID Venta" value={sale.id} />
                <InfoItem label="Fecha de Venta">
                {formatDate(sale.date)}
          </InfoItem>
            <InfoItem label="Fecha de Entrega">
            {formatDate(sale.delivery)}
          </InfoItem>
            <InfoItem label="Método de Pago">
                <span className="paymentBadge">
                    {formatText(sale.payment)}
                </span>
            </InfoItem>
        </InfoGrid>
        </div>
        
        <div className="carPreview">
          <h4>Información del Vehículo</h4>
          {sale.car ? (
            <>
              <p><strong>{sale.car.brand} {sale.car.model} ({sale.car.year})</strong></p>
              <p>VIN: {sale.car.vin}</p>
                <p>Estado: <span className={`saleAvailabilityBadge saleAvailability-${sale.car.availability}`}>
                {formatText(sale.car.availability)}
                </span></p>
              <p>Precio: {formatCurrency(sale.car.price)}</p>
              <Link to={`/cars/${sale.car.vin}`} className="backLink">
                Ver detalles del vehículo →
              </Link>
            </>
          ) : (
            <p>Información del vehículo no disponible</p>
          )}
        </div>

        <div className="clientPreview">
          <h4>Información del Cliente</h4>
          {sale.client ? (
            <>
              <p><strong>{sale.client.name}</strong></p>
              <p>ID: {sale.client.id}</p>
              <p>Email: {sale.client.email}</p>
              {sale.client.preferences && (
                <p>Preferencias: {sale.client.preferences}</p>
              )}
              <Link to={`/clients/${sale.client.id}`} className="backLink">
                Ver detalles del cliente →
              </Link>
            </>
          ) : (
            <p>Información del cliente no disponible</p>
          )}
        </div>

        <InfoGrid columns={2}>
          <InfoItem label="Creado">
            {formatDate(sale.createdAt)}
          </InfoItem>
          <InfoItem label="Última Actualización">
            {formatDate(sale.updatedAt)}
          </InfoItem>
        </InfoGrid>
      </div>

      {showDeleteConfirm && (
        <Modal
          title="¿Eliminar esta venta?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setFetchError('');
          }}
          size="small"
        >
          <div className="deleteConfirm">
            <p>¿Estás seguro de que quieres eliminar la venta #{sale.id}?</p>
            
            <div className="deletePreview">
              <strong>
                {formatText(sale.car?.brand)} {sale.car?.model} → {sale.client?.name}
              </strong>
              <p>Fecha: {formatDate(sale.date)}</p>
              <p>Pago: {formatText(sale.payment)}</p>
            </div>
            
            <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            
            <div className="modalActions">
              <Button 
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
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

export default SaleDetail;