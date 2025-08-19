import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    // Dacă utilizatorul este deja autentificat și admin, redirecționează
    if (isAuthenticated && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Te rugăm să completezi toate câmpurile');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await login(email, password);

      if (result.success) {
        // Verifică dacă utilizatorul este admin
        // (această verificare se face în AuthContext)
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError('A apărut o eroare la autentificare');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B3D91 0%, #4A90E2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AdminPanelSettings
              sx={{
                fontSize: 64,
                color: '#F5A623',
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#0B3D91',
                mb: 1,
              }}
            >
              Panou Administrare
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Autentifică-te pentru a accesa panoul de administrare
            </Typography>
          </Box>

          {/* Eroare */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formular */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
              required
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              label="Parolă"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }}
              disabled={loading}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #F5A623 0%, #E89611 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E89611 0%, #D88A10 100%)',
                },
              }}
            >
              {loading ? 'Se autentifică...' : 'Autentificare'}
            </Button>
          </Box>

          {/* Informații pentru demo */}
          <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              <strong>Cont demo:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Email: admin@vali-events.ro
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Parolă: admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;