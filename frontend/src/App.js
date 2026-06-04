import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddPlant from './pages/AddPlant';
import AddGarden from './pages/AddGarden';
import GardenView from './pages/GardenView';
import PlantView from './pages/PlantView';
import Hardware from './pages/Hardware';
import ChartsHistory from './pages/ChartsHistory';

import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/add-plant" element={<Layout><AddPlant /></Layout>} />
        <Route path="/add-garden" element={<Layout><AddGarden /></Layout>} />
        <Route path="/garden/:id" element={<Layout><GardenView /></Layout>} />
        <Route path="/plant/:id" element={<Layout><PlantView /></Layout>} />
        <Route path="/hardware" element={<Layout><Hardware /></Layout>} />
        <Route path="/history" element={<Layout><ChartsHistory /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
