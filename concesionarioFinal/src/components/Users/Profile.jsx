import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import PasswordModal from './PasswordModal';
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
  const { loading, error, get, del, setError, put } = useApi();
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?._id) {
        try {
          const data = await get(`/users/${currentUser._id}`);
          setUser(data);
          setEditFormData({ name: data.name, email: data.email });
        } catch (error) {
          console.error('Error fetching user:', error);
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
    }
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    await put(`/users/${user._id}/password`, { oldPassword, newPassword });
    setShowPasswordModal(false);
    setError('');
  };

  const handleSaveEdit = async () => {
    try {
      const updatedUser = await put(`/users/${user._id}`, editFormData);
      setUser(updatedUser);
      setShowEditForm(false);
      setError('');
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (loading && !user) return <div className="loading">Cargando perfil...</div>;
  if (error && !user) return <Alert type="error" message={error} />;
  if (!user) return <div className="notFound">Usuario no encontrado</div>;

  return (
    <div className="profileContainer">
      <Link to="/" className="backLink">← Volver al Inicio</Link>
      
      {error && !showDeleteConfirm && !showPasswordModal && !showEditForm && (
        <Alert type="error" message={error} />
      )}

      <div className="profileHeader">
        <h1>Mi Perfil</h1>
      </div>

      <div className="userDetailContent">
        {showEditForm ? (
          <Modal 
            title="Editar Perfil"
            onClose={() => setShowEditForm(false)}
            size="medium"
          >
            <div className="editFormSection">
              <div className="formGroup">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="formInput"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div className="formGroup">
                <label>Email *</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="formInput"
                  placeholder="Ingresa tu email"
                />
              </div>
              <div className="profileActions">
                <Button 
                  variant="success"
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowEditForm(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Modal>
        ) : (
          <>
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
              >
                Editar Perfil
              </Button>
              <Button 
                variant="success"
                onClick={() => setShowPasswordModal(true)}
              >
                Cambiar Contraseña
              </Button>
              <Button 
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Eliminar Cuenta
              </Button>
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <Modal
          title="¿Eliminar tu cuenta?"
          onClose={() => {
            setShowDeleteConfirm(false);
            setError('');
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
                {loading ? 'Eliminando...' : 'Sí, Eliminar Mi Cuenta'}
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

      {showPasswordModal && (
        <PasswordModal
          onSave={handlePasswordChange}
          onCancel={() => {
            setShowPasswordModal(false);
            setError('');
          }}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default Profile;