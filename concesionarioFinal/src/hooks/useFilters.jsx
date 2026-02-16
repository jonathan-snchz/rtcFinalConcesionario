import { useState, useMemo } from 'react';

const useFilters = (data, config) => {
  const [filters, setFilters] = useState(
    config.fields.reduce((acc, field) => {
      if (field.type === 'range') {
        acc[`${field.key}Min`] = '';
        acc[`${field.key}Max`] = '';
      } else if (field.type === 'radio') {
        acc[field.key] = field.options[0] || 'todos';
      } else {
        acc[field.key] = '';
      }
      return acc;
    }, {})
  );

  const uniqueValues = useMemo(() => {
    if (!data.length) return {};
    
    const result = {};
    config.fields.forEach(field => {
      if (field.type === 'select') {
        const values = data
          .map(item => {
            if (field.key.includes('.')) {
              return field.key.split('.').reduce((obj, key) => obj?.[key], item);
            }
            return item[field.key];
          })
          .filter(v => v && v !== '')
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort();
        
        result[field.key] = values;
      }
    });
    return result;
  }, [data, config]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return config.fields.every(field => {
        if (field.type === 'range') {
          const min = filters[`${field.key}Min`];
          const max = filters[`${field.key}Max`];
          
          let itemValue;
          if (field.key.includes('.')) {
            itemValue = field.key.split('.').reduce((obj, key) => obj?.[key], item);
          } else {
            itemValue = item[field.key];
          }
          
          if (min && itemValue < Number(min)) return false;
          if (max && itemValue > Number(max)) return false;
          return true;
        }
        
        if (field.type === 'radio') {
          const filterValue = filters[field.key];
          if (filterValue === 'todos') return true;
          
          let itemValue;
          if (field.key.includes('.')) {
            itemValue = field.key.split('.').reduce((obj, key) => obj?.[key], item);
          } else {
            itemValue = item[field.key];
          }
          
          return itemValue === filterValue;
        }
        
        const filterValue = filters[field.key];
        if (!filterValue) return true;
        
        let itemValue;
        if (field.key.includes('.')) {
          itemValue = field.key.split('.').reduce((obj, key) => obj?.[key], item);
        } else {
          itemValue = item[field.key];
        }
        
        return itemValue === filterValue;
      });
    });
  }, [data, filters, config]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const empty = {};
    config.fields.forEach(field => {
      if (field.type === 'range') {
        empty[`${field.key}Min`] = '';
        empty[`${field.key}Max`] = '';
      } else if (field.type === 'radio') {
        empty[field.key] = field.options[0] || 'todos';
      } else {
        empty[field.key] = '';
      }
    });
    setFilters(empty);
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    uniqueValues,
    filteredData,
  };
};

export default useFilters;