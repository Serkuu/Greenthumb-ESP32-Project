import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import DeviceAssignModal from '../components/DeviceAssignModal';
import XiaoEsp32 from '../components/XiaoEsp32';
import EspDevboard from '../components/EspDevboard';

function Dashboard() {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.successMessage || '');
  const navigate = useNavigate();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [scannedDeviceType, setScannedDeviceType] = useState('');
  const [scannedMacAddress, setScannedMacAddress] = useState('');
  const [gattServer, setGattServer] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [headUnits, setHeadUnits] = useState([]);

  useEffect(() => {
    const fetchGardens = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [gardenRes, sensorRes, headUnitRes] = await Promise.all([
          fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + '/garden', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + '/sensor', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch((process.env.REACT_APP_API_URL || 'http://localhost:3000') + '/head-unit', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (gardenRes.status === 401 || sensorRes.status === 401 || headUnitRes.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }

        if (!gardenRes.ok) {
          throw new Error('Nie udało się pobrać ogrodów z serwera.');
        }

        const gardensData = await gardenRes.json();
        setGardens(gardensData);

        if (sensorRes.ok) {
          const sensorsData = await sensorRes.json();
          setSensors(sensorsData);
        }

        if (headUnitRes.ok) {
          const headUnitsData = await headUnitRes.json();
          setHeadUnits(headUnitsData);
        }
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

  const scanBluetoothDevice = async (type) => {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Twoja przeglądarka nie obsługuje Web Bluetooth API. Otwórz aplikację w Google Chrome na komputerze/Androidzie.");
      }

      const WIFI_PROV_SERVICE = '12345678-1234-5678-1234-56789abcdef0';
      const MAC_CHAR = '12345678-1234-5678-1234-56789abcdef2';

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', WIFI_PROV_SERVICE]
      });

      const server = await device.gatt.connect();

      let realMac = "";
      try {
        const provService = await server.getPrimaryService(WIFI_PROV_SERVICE);
        const macChar = await provService.getCharacteristic(MAC_CHAR);
        const value = await macChar.readValue();
        realMac = new TextDecoder('utf-8').decode(value);
      } catch (err) {
        console.warn("Nie udało się odczytać adresu MAC z customowej charakterystyki", err);
        realMac = device.id.substring(0, 17) || "00:1B:44:11:3A:B7";
      }

      setGattServer(server);
      setScannedDeviceType(type);
      setScannedMacAddress(realMac);
      setAssignModalOpen(true);
    } catch (err) {
      console.log('Bluetooth error: ', err);
      if (err.name !== 'NotFoundError') {
        setError('Błąd Bluetooth: ' + err.message);
      }
    }
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '8px' }}>Twoje Ogrody</h1>
          <p style={{ color: 'var(--color-mute)', fontSize: '16px' }}>Zarządzaj swoimi roślinami i urządzeniami</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button onClick={() => navigate('/add-garden')}>Nowy ogród</Button>
          <Button onClick={() => navigate('/add-plant')}>Dodaj roślinę</Button>
          <Button variant="secondary" onClick={handleLogout}>Wyloguj się</Button>
        </div>
      </div>

      {success && (
        <div style={{
          backgroundColor: 'var(--color-positive)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: 'var(--rounded-md)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600'
        }}>
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'var(--color-negative-deep)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: 'var(--rounded-md)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600'
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', lineHeight: '1' }}>&times;</button>
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
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Nie masz jeszcze żadnego ogrodu</h2>
          <p style={{ color: 'var(--color-mute)', marginBottom: '32px', fontSize: '18px' }}>
            Dodaj swój pierwszy ogród
          </p>
          <Button onClick={() => navigate('/add-garden')}>Stwórz pierwszy ogród</Button>
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
              onClick={() => navigate(`/garden/${garden.id}`)}
            >
              <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{garden.gardenName}</h3>
              <p style={{ color: 'var(--color-mute)', fontSize: '16px' }}>Liczba roślin: {garden.plants?.length || 0}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '64px', borderTop: '1px solid #e2e8f0', paddingTop: '32px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Twoje Urządzenia</h2>
        <p style={{ color: 'var(--color-mute)', fontSize: '16px', marginBottom: '24px' }}>
          Skanuj w poszukiwaniu urządzeń
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button onClick={() => scanBluetoothDevice('headunit')} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}></span> Szukaj daisyHeadUnit
          </Button>
          <Button onClick={() => scanBluetoothDevice('sensor')} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}></span> Szukaj daisySensor
          </Button>
        </div>

        {(sensors.length > 0 || headUnits.length > 0) && (
          <div style={{ marginTop: '48px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Twoje urządzenia</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {sensors.map(sensor => {
                const plant = gardens.flatMap(g => g.plants || []).find(p => p.id === sensor.plantId);
                const garden = gardens.find(g => g.plants?.some(p => p.id === sensor.plantId));

                return (
                  <div key={`sensor-${sensor.id}`} style={{
                    backgroundColor: 'var(--color-canvas)',
                    padding: '24px',
                    borderRadius: 'var(--rounded-xl)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--color-primary-active)' }}>daisySensor</h4>
                    <XiaoEsp32 />
                    
                    <div style={{ marginTop: '24px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-mute)', fontSize: '14px' }}>MAC Adres:</span>
                        <strong style={{ fontSize: '14px' }}>{sensor.macAddress}</strong>
                      </div>
                      
                      {plant && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <span style={{ color: 'var(--color-mute)', fontSize: '14px' }}>Roślina:</span>
                          <strong style={{ fontSize: '14px' }}>{plant.plantName}</strong>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ color: 'var(--color-mute)', fontSize: '14px' }}>Bateria:</span>
                        <strong style={{ fontSize: '14px', color: '#10b981' }}>85%</strong>
                      </div>

                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e2e8f0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: '85%', 
                          height: '100%', 
                          backgroundColor: '#10b981',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {headUnits.map(unit => {
                const garden = gardens.find(g => g.id === unit.gardenId);
                
                return (
                  <div key={`headunit-${unit.id}`} style={{
                    backgroundColor: 'var(--color-canvas)',
                    padding: '24px',
                    borderRadius: 'var(--rounded-xl)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '24px', color: '#3b82f6' }}>daisyHeadUnit</h4>
                    <EspDevboard />
                    
                    <div style={{ marginTop: '24px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-mute)', fontSize: '14px' }}>MAC Adres:</span>
                        <strong style={{ fontSize: '14px' }}>{unit.macAddress}</strong>
                      </div>

                      {garden && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--color-mute)', fontSize: '14px' }}>Ogród:</span>
                          <strong style={{ fontSize: '14px' }}>{garden.gardenName}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <DeviceAssignModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          if (gattServer) gattServer.disconnect();
          setGattServer(null);
        }}
        deviceType={scannedDeviceType}
        deviceMac={scannedMacAddress}
        gattServer={gattServer}
        onSuccess={() => {
          setSuccess('Udało się sparować i skonfigurować urządzenie!');
        }}
      />
    </div>
  );
}

export default Dashboard;
