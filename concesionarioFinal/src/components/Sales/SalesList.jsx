import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useSort from '../../hooks/useSort';
import Alert from '../Alerts/Alert';
import SearchBar from '../SearchBar/SearchBar';
import SortControls from '../SortControls/SortControls';
import { SALE_SORT_OPTIONS, formatText, formatDate } from '../../utils/data';
import './Sales.css';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, get } = useApi();
  const location = useLocation();
  
  const { sortedData, requestSort, getSortIndicator } = useSort(sales, { key: 'id', direction: 'desc' });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await get('/sales');
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, [get]);

  const filteredSales = sortedData.filter(sale => {
    if (!searchTerm) return true;
    
    const car = sale.car;
    const client = sale.client;
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return (
      sale.id?.toString().includes(searchTerm) ||
      (car?.brand?.toLowerCase().includes(lowerSearchTerm)) ||
      (car?.model?.toLowerCase().includes(lowerSearchTerm)) ||
      (client?.name?.toLowerCase().includes(lowerSearchTerm)) ||
      (sale.payment?.toLowerCase().includes(lowerSearchTerm))
    );
  });

  const salesSortOptions = SALE_SORT_OPTIONS;

  if (loading && sales.length === 0) return <div className="loading">Cargando ventas...</div>;
  if (error && sales.length === 0) return <Alert type="error" message={error} />;

  return (
    <div className="salesContainer">
      {location.state?.message && (
        <Alert type="success" message={location.state.message} />
      )}

      <div className="salesHeader">
        <h1>Ventas</h1>
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          placeholder="Buscar por ID, vehículo, cliente o método de pago..."
        />
        
        <SortControls
          sortOptions={salesSortOptions}
          onSort={requestSort}
          getSortIndicator={getSortIndicator}
        />
      </div>

      {error && sales.length > 0 && (
        <Alert type="error" message={error} />
      )}

      <div className="salesList">
        <Link to="/sales/new" className="addSaleItem">
          <div className="addSaleIcon">+</div>
          <div>
            <h3>Registrar Nueva Venta</h3>
            <p>Click para registrar una nueva transacción de venta</p>
          </div>
        </Link>

        {filteredSales.map(sale => (
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

      {filteredSales.length === 0 && searchTerm && (
        <div className="noResults">
          No se encontraron ventas para "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SalesList;