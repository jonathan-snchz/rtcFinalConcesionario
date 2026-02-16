import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import useFilters from '../../hooks/useFilters';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import GenericFilters from '../Filters/GenericFilters';
import { SALE_SORT_OPTIONS, SALE_SEARCH_FIELDS,SALE_FILTER_CONFIG,formatText, formatDate } from '../../utils/data';
import Modal from '../Modal/Modal';
import SaleForm from './SaleForm';
import './Sales.css';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, get } = useApi();
  const location = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { filters, updateFilter, resetFilters, filteredData: filteredByFilters } = 
    useFilters(sales, SALE_FILTER_CONFIG);
  
  const { sortedData, requestSort, getSortIndicator } = useSort(filteredByFilters, { key: 'id', direction: 'desc' });

  const fetchSales = async () => {
    try {
      const data = await get('/sales');
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const finalData = useMemo(() => {
    if (!searchTerm) return sortedData;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return sortedData.filter(sale => 
      SALE_SEARCH_FIELDS.some(field => {
        if (field.includes('.')) {
          const [obj, prop] = field.split('.');
          const value = sale[obj]?.[prop];
          return value?.toString().toLowerCase().includes(lowerSearchTerm);
        }
        const value = sale[field];
        if (value === undefined || value === null) return false;
        return value.toString().toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [searchTerm, sortedData]);

  if (loading && sales.length === 0) return <div className="loading">Cargando ventas...</div>;
  if (error && sales.length === 0) return <Alert type="error" message={error} />;

  return (
    <div className="salesContainer">
      {location.state?.message && (
        <Alert type="success" message={location.state.message} dismissible />
      )}

      <div className="salesHeader">
        <h1>Ventas</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por ID, vehículo, cliente o método de pago..."
        />
      </div>

      <GenericFilters
        config={SALE_FILTER_CONFIG}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      <SortControls
        sortOptions={SALE_SORT_OPTIONS}
        onSort={requestSort}
        getSortIndicator={getSortIndicator}
      />

      {error && sales.length > 0 && (
        <Alert type="error" message={error} dismissible />
      )}

      {finalData.length === 0 && (searchTerm || Object.values(filters).some(v => v)) && (
        <div className="noResults">
          No se encontraron ventas para los filtros seleccionados
        </div>
      )}
      
      <div className="salesList">
        <div onClick={() => setShowCreateForm(true)} className="addSaleItem">
          <div className="addSaleIcon">+</div>
          <h3>Registrar Nueva Venta</h3>
          <p>Click para registrar una nueva transacción de venta</p>
        </div>

        {finalData.map(sale => (
          <Link to={`/sales/${sale.id}`} key={sale.id} className="saleItem">
            <span className="saleId">ID: {sale.id}</span>
            <div className="saleInfo">
              <h3>
                {formatText(sale.car?.brand)} {sale.car?.model} → {sale.client?.name}
              </h3>
              <p>
                Fecha Venta: {formatDate(sale.date)} • Entrega: {formatDate(sale.delivery)}
              </p>
            </div>
            <span className="paymentBadge">
              {formatText(sale.payment)}
            </span>
          </Link>
        ))} 
      </div>

      {showCreateForm && (
        <Modal
          title="Registrar Nueva Venta"
          onClose={() => setShowCreateForm(false)}
          size="large"
        >
          <SaleForm 
            onSuccess={() => {
              setShowCreateForm(false);
              fetchSales();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default SalesList;