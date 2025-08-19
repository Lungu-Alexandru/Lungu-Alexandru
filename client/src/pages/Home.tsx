import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Paper,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  AccessTime,
  Star,
  ArrowForward,
  People,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Event, Article, Testimonial } from '../types';
import { eventsAPI, blogAPI, testimonialsAPI } from '../services/api';
import { formatDate, formatTime, formatPrice, truncateText } from '../utils/helpers';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const Home: React.FC = () => {
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsResponse, articlesResponse, testimonialsResponse] = await Promise.all([
        eventsAPI.getPopular(),
        blogAPI.getLatest(3),
        testimonialsAPI.getApproved(6),
      ]);

      if (eventsResponse.success && eventsResponse.data) {
        setPopularEvents(eventsResponse.data);
      }

      if (articlesResponse.success && articlesResponse.data) {
        setLatestArticles(articlesResponse.data);
      }

      if (testimonialsResponse.success && testimonialsResponse.data) {
        setTestimonials(testimonialsResponse.data);
      }
    } catch (err: any) {
      console.error('Eroare la încărcarea datelor:', err);
      setError('Nu am putut încărca datele. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Se încarcă pagina principală..." fullScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <ErrorMessage
          title="Eroare la încărcare"
          message={error}
          onRetry={loadHomeData}
        />
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Descoperă evenimente
                <Box component="span" sx={{ color: theme.palette.secondary.main }}>
                  {' '}extraordinare
                </Box>
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  fontWeight: 400,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Alătură-te comunității noastre și participă la cele mai interesante
                evenimente din orașul tău. De la conferințe la concerte, avem ceva pentru toată lumea.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/events"
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Vezi Toate Evenimentele
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/newsletter"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                  }}
                >
                  Abonează-te
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                <EventIcon
                  sx={{
                    fontSize: { xs: 200, md: 300 },
                    color: theme.palette.secondary.main,
                    opacity: 0.8,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Evenimente Populare */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 600,
          }}
        >
          Evenimente Populare
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Cele mai apreciate evenimente de către comunitatea noastră
        </Typography>

        {popularEvents.length > 0 ? (
          <Grid container spacing={4}>
            {popularEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/events/${event.id}`)}
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
                    <Chip
                      label={event.categorie}
                      color="primary"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                      {event.titlu}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
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
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 600, flexGrow: 1 }}
                    >
                      {formatPrice(event.pret)}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowForward />}
                    >
                      Detalii
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nu există evenimente populare momentan.
            </Typography>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/events"
            endIcon={<ArrowForward />}
          >
            Vezi Toate Evenimentele
          </Button>
        </Box>
      </Container>

      {/* Testimoniale */}
      {testimonials.length > 0 && (
        <Box sx={{ backgroundColor: theme.palette.grey[100], py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 600,
              }}
            >
              Ce spun participanții
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Experiențele și părerile celor care au participat la evenimentele noastre
            </Typography>

            <Grid container spacing={4}>
              {testimonials.slice(0, 3).map((testimonial) => (
                <Grid item xs={12} md={4} key={testimonial.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          mr: 2,
                        }}
                      >
                        {testimonial.nume.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {testimonial.nume}
                        </Typography>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size="small"
                          sx={{ color: theme.palette.secondary.main }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        flexGrow: 1,
                        fontStyle: 'italic',
                        mb: 2,
                      }}
                    >
                      "{testimonial.mesaj}"
                    </Typography>

                    {testimonial.titlu_eveniment && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 'auto' }}
                      >
                        Eveniment: {testimonial.titlu_eveniment}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Blog/Noutăți */}
      {latestArticles.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 600,
            }}
          >
            Ultimele Noutăți
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Rămâi la curent cu cele mai recente articole și noutăți
          </Typography>

          <Grid container spacing={4}>
            {latestArticles.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/blog/${article.id}`)}
                >
                  {article.imagine_principala && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={`http://localhost:5000${article.imagine_principala}`}
                      alt={article.titlu}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      {article.titlu}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {truncateText(article.rezumat || article.continut, 120)}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(article.data_publicare)}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                    >
                      Citește mai mult
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/blog"
              endIcon={<ArrowForward />}
            >
              Vezi Toate Articolele
            </Button>
          </Box>
        </Container>
      )}

      {/* Call to Action */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Alătură-te comunității noastre!
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
            }}
          >
            Primește notificări despre evenimentele noi și ofertele speciale
            direct în inbox-ul tău.
          </Typography>

          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/newsletter"
            sx={{
              backgroundColor: 'white',
              color: theme.palette.secondary.main,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Abonează-te la Newsletter
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Home;