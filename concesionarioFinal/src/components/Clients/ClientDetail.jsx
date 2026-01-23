import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ClientForm from './ClientForm';
import useApi from '../../hooks/useApi';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import InfoGrid from '../InfoDisplay/InfoGrid';
import InfoItem from '../InfoDisplay/InfoItem';
import { formatDate } from '../../utils/data';
import './Clients.css';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, get, del, setError } = useApi();
  const [client, setClient] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await get(`/clients/${id}`);
        setClient(data);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    };

    fetchClient();
  }, [id, get]);

  const handleDelete = async () => {
    try {
      await del(`/clients/${id}`);
      
      navigate('/clients', { 
        state: { message: 'Cliente eliminado exitosamente' }
      });
      
    } catch (error) {
      console.error('Delete error:', error);
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdate = (updatedClient) => {
    setClient(updatedClient);
    setShowEditForm(false);
    setError('');
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  if (loading && !client) return <div className="loading">Cargando detalles del cliente...</div>;
  if (error && !client) return <Alert type="error" message={error} />;
  if (!client) return <div className="notFound">Cliente no encontrado</div>;

  return (
    <div className="clientDetailContainer">
      <Link to="/clients" className="backLink">← Volver a Clientes</Link>
      
      {error && !showDeleteConfirm && !showEditForm && (
        <Alert type="error" message={error} />
      )}

      <div className="clientDetailHeader">
        <h1>{client.name}</h1>
        <div className="clientActions">
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
            Eliminar
          </Button>
        </div>
      </div>

      <div className="clientDetailContent">
        <InfoGrid columns={2}>
          <InfoItem label="ID Cliente" value={client.id} />
          <InfoItem label="Nombre" value={client.name} />
          <InfoItem label="Email" value={client.email} />
          <InfoItem label="Preferencias" value={client.preferences || 'No especificadas'} />
          <InfoItem label="Creado">
            {formatDate(client.createdAt)}
          </InfoItem>
          <InfoItem label="Última Actualización">
            {formatDate(client.updatedAt)}
          </InfoItem>
        </InfoGrid>
      </div>

      {showEditForm && (
        <Modal 
          title={`Editar Cliente: ${client.name}`}
          onClose={handleEditCancel}
          size="medium"
        >
          <ClientForm 
            client={client} 
            onSuccess={handleUpdate}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal
          title="¿Eliminar este cliente?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setError('');
          }}
          size="small"
        >
          <div className="deleteConfirm">
            <p>¿Estás seguro de que quieres eliminar este cliente?</p>
            
            <div className="deletePreview">
              <strong>{client.name}</strong>
              <p>ID: {client.id}</p>
              <p>Email: {client.email}</p>
            </div>
            
            <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            
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
                  setError('');
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

export default ClientDetail;