
// Capitalizacion y arreglo de datos
export const formatText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatCurrency = (amount) => {
  return `$${amount?.toLocaleString() || '0'}`;
};

export const formatKilometers = (km) => {
  return `${km?.toLocaleString() || '0'} km`;
};

// Datos
export const CAR_BRANDS = [
  'acura', 'audi', 'bmw', 'cadillac', 'chevrolet', 'dodge', 'fiat', 
  'ford', 'gmc', 'honda', 'hyundai', 'jeep', 'lincoln', 'mazda', 
  'mercedes', 'nissan', 'ram', 'tesla', 'toyota', 'volvo'
];

export const CAR_TYPES = ['turismo', 'furgoneta'];
export const CAR_CONDITIONS = ['usado', 'nuevo'];
export const CAR_AVAILABILITY = ['disponible', 'vendido', 'reservado'];
export const PAYMENT_METHODS = ['transacción bancaria', 'efectivo', 'financiación'];

// Opciones capitalizadas

export const CAR_BRAND_OPTIONS = CAR_BRANDS.map(brand => ({
  value: brand,
  label: formatText(brand)
}));

export const CAR_TYPE_OPTIONS = CAR_TYPES.map(type => ({
  value: type,
  label: formatText(type)
}));

export const CAR_CONDITION_OPTIONS = CAR_CONDITIONS.map(condition => ({
  value: condition,
  label: formatText(condition)
}));

export const CAR_AVAILABILITY_OPTIONS = CAR_AVAILABILITY.map(status => ({
  value: status,
  label: formatText(status)
}));

export const PAYMENT_METHOD_OPTIONS = PAYMENT_METHODS.map(method => ({
  value: method,
  label: formatText(method)
}));

// Ordenes
export const CAR_SORT_OPTIONS = [
  { key: 'brand', label: 'Marca' },
  { key: 'year', label: 'Año' },
  { key: 'price', label: 'Precio' },
  { key: 'km', label: 'Kilómetros' },
  { key: 'model', label: 'Modelo' },
  { key: 'condition', label: 'Condición' },
  { key: 'availability', label: 'Disponibilidad' }
];

export const CLIENT_SORT_OPTIONS = [
  { key: 'name', label: 'Nombre' },
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Fecha de Creación' }
];

export const SALE_SORT_OPTIONS = [
  { key: 'id', label: 'ID Venta' },
  { key: 'date', label: 'Fecha de Venta' },
  { key: 'payment', label: 'Método de Pago' },
  { key: 'delivery', label: 'Fecha de Entrega' },
  { key: 'createdAt', label: 'Fecha de Creación' }
];

export const USER_SORT_OPTIONS = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Fecha de Creación' }
];

// Campos de búsqueda para los vehículos

export const CAR_SEARCH_FIELDS = ['brand', 'model', 'color', 'vin', 'year'];
