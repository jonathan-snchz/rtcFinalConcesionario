import { useState, useCallback } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const url = `${apiUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      if (!response.ok) {
        const errorMessage = typeof data === 'string' 
          ? data 
          : data.message || `Error ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint) => request(endpoint, { method: 'GET' }), [request]);
  const post = useCallback((endpoint, body) => request(endpoint, { method: 'POST', body }), [request]);
  const put = useCallback((endpoint, body) => request(endpoint, { method: 'PUT', body }), [request]);
  const del = useCallback((endpoint) => request(endpoint, { method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    setError,
  };
};

export default useApi;