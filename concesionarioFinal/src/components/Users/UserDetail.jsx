import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import InfoGrid from '../InfoDisplay/InfoGrid';
import InfoItem from '../InfoDisplay/InfoItem';
import { formatDate } from '../../utils/data';
import './Users.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { loading, error, get, del, setError } = useApi();
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await get(`/users/${id}`);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id, get]);

  const handleDelete = async () => {
    try {
      await del(`/users/${id}`);
      navigate('/users', { 
        state: { message: 'Usuario eliminado exitosamente' }
      });
    } catch (error) {
      console.error('Delete error:', error);
      setShowDeleteConfirm(false);
    }
  };

  if (loading && !user) return <div className="loading">Cargando detalles del usuario...</div>;
  if (error && !user) return <Alert type="error" message={error} />;
  if (!user) return <div className="notFound">Usuario no encontrado</div>;

  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className="userDetailContainer">
      <Link to="/users" className="backLink">← Volver a Usuarios</Link>
      
      {error && !showDeleteConfirm && (
        <Alert type="error" message={error} />
      )}

      <div className="userDetailHeader">
        <h1>{user.name}</h1>
        {isCurrentUser && (
          <div className="userActions">
            <Button 
              variant="primary"
              onClick={() => navigate('/profile')}
            >
              Editar Perfil
            </Button>
            <Button 
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar Cuenta
            </Button>
          </div>
        )}
      </div>

      <div className="userDetailContent">
        <InfoGrid columns={2}>
          <InfoItem label="ID Usuario" value={user._id} />
          <InfoItem label="Nombre" value={user.name} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Cuenta Creada">
            {formatDate(user.createdAt)}
          </InfoItem>
          <InfoItem label="Última Actualización">
            {formatDate(user.updatedAt)}
          </InfoItem>
        </InfoGrid>
      </div>

      {showDeleteConfirm && isCurrentUser && (
        <Modal
          title="¿Eliminar tu cuenta?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setError('');
          }}
          size="small"
        >
          <div className="deleteConfirm">
            <p>¿Estás seguro de que quieres eliminar tu propia cuenta? Esto te cerrará la sesión inmediatamente.</p>
            
            <div className="deletePreview">
              <strong>{user.name}</strong>
              <p>Email: {user.email}</p>
              <p>ID: {user._id.slice(-6)}</p>
            </div>
            
            <p className="warning">⚠️ Esto eliminará permanentemente tu cuenta y te cerrará la sesión.</p>
            
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

export default UserDetail;