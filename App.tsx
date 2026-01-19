
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './PARIS3VEICULOS/context/AuthContext';
import Home from './PARIS3VEICULOS/pages/Home';
import InventoryPage from './PARIS3VEICULOS/pages/InventoryPage';
import AdminLogin from './PARIS3VEICULOS/pages/AdminLogin';
import AdminDashboard from './PARIS3VEICULOS/pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/estoque" element={<InventoryPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
