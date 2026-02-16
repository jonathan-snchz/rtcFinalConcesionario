import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import PasswordModal from './PasswordModal';
import ProfileEditForm from './ProfileEditForm';
import Alert from '../Alerts/Alert';
import Button from '../Buttons/Button';
import Modal from '../Modal/Modal';
import InfoGrid from '../InfoDisplay/InfoGrid';
import InfoItem from '../InfoDisplay/InfoItem';
import './Users.css';
import { formatDate } from '../../utils/data';

const Profile = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { loading, error: serverError, get, del, put } = useApi();
  const [user, setUser] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?._id) {
        try {
          const data = await get(`/users/${currentUser._id}`);
          setUser(data);
          setFetchError('');
        } catch (error) {
          console.error('Error fetching user:', error);
          setFetchError(error.message || 'Error al cargar el perfil');
        }
      }
    };

    fetchUser();
  }, [currentUser, get]);

  const handleDeleteAccount = async () => {
    try {
      await del(`/users/${user._id}`);
      logout();
      navigate('/login', { 
        state: { message: 'Tu cuenta ha sido eliminada' }
      });
    } catch (error) {
      console.error('Delete error:', error);
      setShowDeleteConfirm(false);
      setFetchError(error.message || 'Error al eliminar la cuenta');
    }
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {
      await put(`/users/${user._id}/password`, { oldPassword, newPassword });
      setShowPasswordModal(false);
      setFetchError('');
    } catch (error) {
      setFetchError(error.message || 'Error al cambiar la contraseña');
      throw error;
    }
  };

  const handleSaveEdit = async (formData) => {
    try {
      const updatedUser = await put(`/users/${user._id}`, formData);
      setUser(updatedUser);
      setShowEditForm(false);
      setFetchError('');
    } catch (error) {
      console.error('Update error:', error);
      setFetchError(error.message || 'Error al actualizar el perfil');
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setFetchError('');
  };

  const displayError = fetchError || serverError;

  if (loading && !user) return <div className="loading">Cargando perfil...</div>;
  if (displayError && !user) return <Alert type="error" message={displayError} />;
  if (!user) return <div className="notFound">Usuario no encontrado</div>;

  return (
    <div className="profileContainer">
      <Link to="/" className="backLink">← Volver al Inicio</Link>
      
      {displayError && !showDeleteConfirm && !showPasswordModal && !showEditForm && (
        <Alert type="error" message={displayError} dismissible />
      )}

      <div className="profileHeader">
        <h1>Mi Perfil</h1>
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

        <div className="profileActions">
          <Button 
            variant="primary"
            onClick={() => setShowEditForm(true)}
            disabled={loading}
          >
            Editar Perfil
          </Button>
          <Button 
            variant="success"
            onClick={() => setShowPasswordModal(true)}
            disabled={loading}
          >
            Cambiar Contraseña
          </Button>
          <Button 
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            Eliminar Cuenta
          </Button>
        </div>
      </div>

      {showEditForm && (
        <Modal 
          title="Editar Perfil"
          onClose={handleEditCancel}
          size="medium"
        >
          <ProfileEditForm
            user={user}
            onSave={handleSaveEdit}
            onCancel={handleEditCancel}
            loading={loading}
            serverError={displayError}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal
          title="¿Eliminar tu cuenta?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setFetchError('');
          }}
          size="small"
        >
          <div className="deleteConfirm">
            <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y te cerrará la sesión inmediatamente.</p>
            
            <div className="deletePreview">
              <strong>{user.name}</strong>
              <p>Email: {user.email}</p>
              <p>ID: {user._id.slice(-6)}</p>
            </div>
            
            <p className="warning">⚠️ Esto eliminará permanentemente tu cuenta y todos tus datos.</p>
            
            <div className="modalActions">
              <Button 
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
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

      {showPasswordModal && (
        <PasswordModal
          onSave={handlePasswordChange}
          onCancel={() => {
            setShowPasswordModal(false);
            setFetchError('');
          }}
          loading={loading}
          error={displayError}
        />
      )}
    </div>
  );
};

export default Profile;