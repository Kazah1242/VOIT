import { useState, useEffect } from 'react';
import { api } from '../services/api';

function TestConnection() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        setMessage(response.data.message);
      } catch (err) {
        setError('Ошибка подключения к бэкенду');
        console.error(err);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TestConnection; 