import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import { CLIENT_SORT_OPTIONS, CLIENT_SEARCH_FIELDS } from '../../utils/data';
import Modal from '../Modal/Modal';
import ClientForm from './ClientForm';
import './Clients.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, get } = useApi();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { sortedData, requestSort, getSortIndicator } = useSort(clients, { key: 'name', direction: 'asc' });

  const fetchClients = async () => {
    try {
      const data = await get('/clients');
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return sortedData;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return sortedData.filter(client => 
      CLIENT_SEARCH_FIELDS.some(field => {
        const value = client[field];
        if (value === undefined || value === null) return false;
        return value.toString().toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [searchTerm, sortedData]);

  if (loading && clients.length === 0) return <div className="loading">Cargando clientes...</div>;
  if (error && clients.length === 0) return <Alert type="error" message={error} />;

  return (
    <div className="clientsContainer">
      <div className="clientsHeader">
        <h1>Gestión de Clientes</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por nombre, email, ID o preferencias..."
        />
        
        <SortControls
          sortOptions={CLIENT_SORT_OPTIONS}
          onSort={requestSort}
          getSortIndicator={getSortIndicator}
        />
      </div>

      {filteredClients.length === 0 && searchTerm && (
        <div className="noResults">
          No se encontraron clientes para "{searchTerm}"
        </div>
      )}
      
      <div className="clientsList">
        <div onClick={() => setShowCreateForm(true)} className="addClientItem">
          <div className="addClientIcon">+</div>
          <div>
            <h3>Agregar Nuevo Cliente</h3>
            <p>Click para agregar un nuevo cliente al sistema</p>
          </div>
        </div>

        {showCreateForm && (
          <Modal 
            title="Agregar nuevo cliente"
            onClose={() => setShowCreateForm(false)}
            size="large"
          >
            <ClientForm
              onSuccess={() => {
                setShowCreateForm(false);
                fetchClients();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </Modal>
        )}

        {filteredClients.map(client => (
          <Link to={`/clients/${client.id}`} key={client.id} className="clientItem">
            <span className="clientId">ID: {client.id}</span>
            <div className="clientInfo">
              <h3>{client.name}</h3>
              <p>{client.email}</p>
              {client.preferences && <p>Preferencias: {client.preferences}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClientsList;