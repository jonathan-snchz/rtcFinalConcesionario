import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import { USER_SORT_OPTIONS, formatDate } from '../../utils/data';
import './Users.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState('');
  const { loading, error: apiError, get } = useApi();
  
  const { sortedData, requestSort, getSortIndicator } = useSort(users, { key: 'name', direction: 'asc' });

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        const data = await get('/users');
        if (isMounted) {
          setUsers(data);
          setFetchError('');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching users:', error);
          setFetchError(error.message || 'Error al cargar los usuarios');
        }
      }
    };

    fetchUsers();
    
    return () => {
      isMounted = false;
    };
  }, [get]);

  const filteredUsers = sortedData.filter(user => 
    !searchTerm || 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id?.includes(searchTerm)
  );

  const userSortOptions = USER_SORT_OPTIONS;

  if (loading && users.length === 0) return <div className="loading">Cargando usuarios...</div>;
  if ((fetchError || apiError) && users.length === 0) return <Alert type="error" message={fetchError || apiError} />;

  return (
    <div className="usersContainer">
      <div className="usersHeader">
        <h1>Gestión de Usuarios</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por nombre, email o ID..."
        />
        
        <SortControls
          sortOptions={userSortOptions}
          onSort={requestSort}
          getSortIndicator={getSortIndicator}
        />
      </div>

      <div className="usersList">
        <Link to="/register" className="addUserItem">
          <div className="addUserIcon">+</div>
          <div>
            <h3>Agregar Nuevo Usuario</h3>
            <p>Click para agregar un nuevo usuario al sistema</p>
          </div>
        </Link>

        {filteredUsers.map(user => (
          <Link to={`/users/${user._id}`} key={user._id} className="userItem">
            <span className="userId">ID: {user._id.slice(-6)}</span>
            <div className="userInfo">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Creado: {formatDate(user.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="noResults">
          No se encontraron usuarios para "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default UsersList;