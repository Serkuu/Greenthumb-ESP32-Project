import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

function Dashboard() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGardens = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/garden', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych z serwera.');
        }

        const data = await response.json();
        setGardens(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGardens();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>Twoje Ogrody</h1>
          <p style={{ color: 'var(--color-mute)', fontSize: '16px' }}>Zarządzaj swoimi roślinami i urządzeniami.</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Wyloguj się</Button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--color-negative)', color: '#fff', padding: '16px', borderRadius: 'var(--rounded-md)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-mute)', fontSize: '18px' }}>Wczytywanie ogrodów...</p>
      ) : gardens.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--color-canvas)',
          padding: '64px',
          borderRadius: 'var(--rounded-xl)',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Nie masz jeszcze żadnego ogrodu!</h2>
          <p style={{ color: 'var(--color-mute)', marginBottom: '32px', fontSize: '18px' }}>
            Dodaj swój pierwszy ogród i tchnij życie w to miejsce.
          </p>
          <Button onClick={() => alert('Wkrótce dodamy formularz tworzenia ogrodu!')}>Stwórz pierwszy Ogród</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {gardens.map(garden => (
            <div key={garden.id} style={{
              backgroundColor: 'var(--color-canvas)',
              padding: '32px',
              borderRadius: 'var(--rounded-xl)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{garden.name}</h3>
              <p style={{ color: 'var(--color-mute)', fontSize: '16px' }}>Miejsce: {garden.location || 'Nie podano'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
