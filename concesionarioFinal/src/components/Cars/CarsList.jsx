import { useState, useEffect, useMemo } from 'react';
import CarCard from './CarCard';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import useFilters from '../../hooks/useFilters';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import GenericFilters from '../Filters/GenericFilters';
import { CAR_SORT_OPTIONS, CAR_SEARCH_FIELDS,CAR_FILTER_CONFIG } from '../../utils/data';
import { useAuth } from '../../context/AuthContext';
import Modal from '../Modal/Modal';
import CarForm from './CarForm';
import './Cars.css';

const CarsList = () => {
  const { isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, get } = useApi();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { filters, updateFilter, resetFilters, uniqueValues, filteredData: filteredByFilters } = 
    useFilters(cars, CAR_FILTER_CONFIG);
  
  const { sortedData, requestSort, getSortIndicator } = useSort(filteredByFilters, { key: 'brand', direction: 'asc' });

  const fetchCars = async () => {
    try {
      const data = await get('/cars');
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const finalData = useMemo(() => {
    if (!searchTerm) return sortedData;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return sortedData.filter(car => 
      CAR_SEARCH_FIELDS.some(field => {
        const value = car[field];
        if (value === undefined || value === null) return false;
        return value.toString().toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [searchTerm, sortedData]);

  if (loading && cars.length === 0) return <div className="loading">Cargando vehículos...</div>;
  if (error && cars.length === 0) return <Alert type="error" message={error} />;

  return (
    <div className="carsContainer">
      <div className="carsHeader">
        <h1>Inventario de Vehículos</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por marca, modelo, color, VIN o año..."
        />
      </div>

      <GenericFilters
        config={CAR_FILTER_CONFIG}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        uniqueValues={uniqueValues}
      />

      <SortControls
        sortOptions={CAR_SORT_OPTIONS}
        onSort={requestSort}
        getSortIndicator={getSortIndicator}
      />
      
      {finalData.length === 0 && (searchTerm || Object.values(filters).some(v => v)) && (
        <div className="noResults">
          No se encontraron vehículos para los filtros seleccionados
        </div>
      )}

      <div className="carsGrid">
        {isAuthenticated &&
          <div onClick={() => setShowCreateForm(true)} className="addCarCard">
            <div className="addCarIcon">+</div>
            <h3>Agregar Nuevo Vehículo</h3>
            <p>Click para agregar un nuevo vehículo al inventario</p>
          </div>
        }

        {finalData.map(car => (
          <CarCard key={car.vin} car={car} />
        ))}
      </div>
      
      {showCreateForm && (
        <Modal 
          title="Agregar Nuevo Vehículo"
          onClose={() => setShowCreateForm(false)}
          size="large"
        >
          <CarForm 
            onSuccess={() => {
              setShowCreateForm(false);
              fetchCars();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default CarsList;