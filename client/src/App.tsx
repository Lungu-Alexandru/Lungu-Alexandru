import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from './pages/Home';
import Events from './pages/Events';
import Newsletter from './pages/Newsletter';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Import pentru Google Fonts
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rute publice cu layout normal */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/events" element={
              <Layout>
                <Events />
              </Layout>
            } />
            <Route path="/newsletter" element={
              <Layout>
                <Newsletter />
              </Layout>
            } />

            {/* Rute admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Rute admin protejate */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Redirecționare admin */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Alte rute vor fi adăugate aici */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
