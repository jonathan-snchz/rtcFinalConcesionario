import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import { CAR_SORT_OPTIONS, CAR_SEARCH_FIELDS } from '../../utils/data';
import './Cars.css';

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState('');
  const { loading, error: apiError, get } = useApi();
  
  const { sortedData, requestSort, getSortIndicator } = useSort(cars, { key: 'brand', direction: 'asc' });

  useEffect(() => {
    let isMounted = true;
    
    const fetchCars = async () => {
      try {
        const data = await get('/cars');
        if (isMounted) {
          setCars(data);
          setFetchError('');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching cars:', error);
          setFetchError(error.message || 'Error al cargar los coches');
        }
      }
    };

    fetchCars();
    
    return () => {
      isMounted = false;
    };
  }, [get]);

  const filteredCars = useMemo(() => {
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

  const carSortOptions = CAR_SORT_OPTIONS;

  const displayError = fetchError || apiError;

  if (loading && cars.length === 0) return <div className="loading">Cargando coches...</div>;
  if (displayError && cars.length === 0) return <Alert type="error" message={displayError} />;

  return (
    <div className="carsContainer">
      <div className="carsHeader">
        <h1>Inventario de Coches</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por marca, modelo, color, VIN o año..."
        />
        
        <SortControls
          sortOptions={carSortOptions}
          onSort={requestSort}
          getSortIndicator={getSortIndicator}
        />
      </div>

      <div className="carsGrid">
        <Link to="/cars/new" className="addCarCard">
          <div className="addCarIcon">+</div>
          <h3>Agregar Coche Nuevo</h3>
          <p>Click para agregar un nuevo coche al inventario</p>
        </Link>

        {filteredCars.map(car => (
          <CarCard key={car.vin} car={car} />
        ))}
      </div>

      {filteredCars.length === 0 && searchTerm && (
        <div className="noResults">
          No se encontraron coches para "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default CarsList;