import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import { CLIENT_SORT_OPTIONS } from '../../utils/data';
import './Clients.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, get } = useApi();
  
  const { sortedData, requestSort, getSortIndicator } = useSort(clients, { key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await get('/clients');
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, [get]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return sortedData;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return sortedData.filter(client => 
      client.name?.toLowerCase().includes(lowerSearchTerm) ||
      client.email?.toLowerCase().includes(lowerSearchTerm) ||
      client.id?.toString().includes(searchTerm) ||
      client.preferences?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm, sortedData]);

  const clientSortOptions = CLIENT_SORT_OPTIONS;

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
          sortOptions={clientSortOptions}
          onSort={requestSort}
          getSortIndicator={getSortIndicator}
        />
      </div>

      <div className="clientsList">
        <Link to="/clients/new" className="addClientItem">
          <div className="addClientIcon">+</div>
          <div>
            <h3>Agregar Nuevo Cliente</h3>
            <p>Click para agregar un nuevo cliente al sistema</p>
          </div>
        </Link>

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

      {filteredClients.length === 0 && searchTerm && (
        <div className="noResults">
          No se encontraron clientes para "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default ClientsList;