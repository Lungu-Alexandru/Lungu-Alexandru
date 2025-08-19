import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  AccessTime,
  People,
  ArrowForward,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Event, EventFilters } from '../types';
import { eventsAPI } from '../services/api';
import { formatDate, formatTime, formatPrice, truncateText } from '../utils/helpers';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filtre
  const [filters, setFilters] = useState<EventFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    categorie: searchParams.get('categorie') || '',
    locatie: searchParams.get('locatie') || '',
    status: searchParams.get('status') || 'viitor',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'conferinta',
    'workshop',
    'seminar',
    'networking',
    'concert',
    'teatru',
    'expozitie',
    'sport',
    'caritabil',
    'altele',
  ];

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventsAPI.getAll(filters);

      if (response.success && response.data) {
        setEvents(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error('Eroare la încărcarea evenimentelor:', err);
      setError('Nu am putut încărca evenimentele. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Actualizează URL-ul
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        newSearchParams.set(k, v.toString());
      }
    });
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    handleFilterChange('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    // Implementare căutare - poate fi adăugată în backend
    console.log('Căutare:', searchTerm);
  };

  const clearFilters = () => {
    const newFilters: EventFilters = { page: 1, limit: 12, status: 'viitor' };
    setFilters(newFilters);
    setSearchTerm('');
    setSearchParams(new URLSearchParams({ status: 'viitor' }));
  };

  const handleEventClick = async (eventId: number) => {
    // Incrementează click-urile
    try {
      await eventsAPI.incrementClicks(eventId);
    } catch (err) {
      console.error('Eroare la înregistrarea click-ului:', err);
    }
    
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Se încarcă evenimentele..." fullScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 600,
          }}
        >
          {filters.status === 'expirat' ? 'Evenimente Reușite' : 'Evenimente Viitoare'}
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {filters.status === 'expirat' 
            ? 'Descoperă evenimentele noastre de succes din trecut'
            : 'Descoperă și participă la evenimentele noastre viitoare'
          }
        </Typography>
      </Box>

      {/* Filtre */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Căutare */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Caută evenimente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Categorie */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categorie</InputLabel>
              <Select
                value={filters.categorie || ''}
                label="Categorie"
                onChange={(e) => handleFilterChange('categorie', e.target.value)}
              >
                <MenuItem value="">Toate categoriile</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Locație */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Locație"
              placeholder="ex: București"
              value={filters.locatie || ''}
              onChange={(e) => handleFilterChange('locatie', e.target.value)}
            />
          </Grid>

          {/* Acțiuni */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Caută
              </Button>
              <IconButton
                onClick={clearFilters}
                title="Șterge filtrele"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <Clear />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Toggle Status */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip
            label="Evenimente Viitoare"
            color={filters.status === 'viitor' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('status', 'viitor')}
            clickable
          />
          <Chip
            label="Evenimente Reușite"
            color={filters.status === 'expirat' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('status', 'expirat')}
            clickable
          />
        </Box>
      </Paper>

      {/* Rezultate */}
      {error ? (
        <ErrorMessage
          title="Eroare la încărcare"
          message={error}
          onRetry={loadEvents}
        />
      ) : events.length > 0 ? (
        <>
          {/* Lista evenimente */}
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                  onClick={() => handleEventClick(event.id)}
                >
                  {event.imagine_principala && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:5000${event.imagine_principala}`}
                      alt={event.titlu}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={event.categorie}
                        color="primary"
                        size="small"
                      />
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {formatPrice(event.pret)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      {event.titlu}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: '3em' }}
                    >
                      {truncateText(event.descriere_scurta || event.descriere, 100)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.data_start)} la {formatTime(event.ora)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.locatie}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.vizualizari + event.click_uri} interacțiuni
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                    >
                      Vezi Detalii
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginare */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={filters.page || 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Nu am găsit evenimente
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Încearcă să modifici filtrele sau să cauți altceva.
          </Typography>
          <Button variant="outlined" onClick={clearFilters}>
            Șterge toate filtrele
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Events;