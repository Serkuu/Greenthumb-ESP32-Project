import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Twój Dashboard</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-mute)', marginBottom: '32px' }}>
        Zostałeś pomyślnie zalogowany! Tu wkrótce pojawi się lista Twoich ogrodów.
      </p>
      
      <Button variant="secondary" onClick={handleLogout}>Wyloguj się</Button>
    </div>
  );
}

export default Dashboard;
