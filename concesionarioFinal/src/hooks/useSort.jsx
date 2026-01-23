import { useState, useMemo } from 'react';

const useSort = (data, defaultSort = { key: '', direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !data || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortConfig.direction === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return sortConfig.direction === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortIndicator,
    resetSort: () => setSortConfig(defaultSort)
  };
};

export default useSort;