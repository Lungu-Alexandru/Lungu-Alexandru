import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Email as EmailIcon,
  Star as StarIcon,
  TrendingUp,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Event, Article, Registration } from '../../types';
import { eventsAPI, blogAPI, registrationsAPI, testimonialsAPI } from '../../services/api';
import { formatDate, formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalArticles: number;
  totalTestimonials: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalArticles: 0,
    totalTestimonials: 0,
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Încarcă statistici și date recente
      const [
        upcomingEventsRes,
        allEventsRes,
        articlesRes,
        registrationsRes,
        testimonialsRes,
      ] = await Promise.all([
        eventsAPI.getAll({ status: 'viitor', limit: 5 }),
        eventsAPI.getAll({ limit: 100 }), // Pentru statistici
        blogAPI.getAll(1, 5),
        registrationsAPI.getAll(1, 5),
        testimonialsAPI.getStats(),
      ]);

      // Calculează statistici
      const upcomingEvents = upcomingEventsRes.data?.length || 0;
      const totalEvents = allEventsRes.data?.length || 0;
      const totalArticles = articlesRes.pagination?.totalArticles || 0;
      const totalRegistrations = registrationsRes.pagination?.totalRegistrations || 0;
      const totalTestimonials = testimonialsRes.data?.total || 0;

      setStats({
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        totalArticles,
        totalTestimonials,
      });

      // Setează datele recente
      if (upcomingEventsRes.data) setRecentEvents(upcomingEventsRes.data);
      if (articlesRes.data) setRecentArticles(articlesRes.data);
      if (registrationsRes.data) setRecentRegistrations(registrationsRes.data);

    } catch (error) {
      console.error('Eroare la încărcarea dashboard-ului:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Se încarcă dashboard-ul..." fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Evenimente',
      value: stats.totalEvents,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      link: '/admin/events',
    },
    {
      title: 'Evenimente Viitoare',
      value: stats.upcomingEvents,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      link: '/admin/events?status=viitor',
    },
    {
      title: 'Înregistrări',
      value: stats.totalRegistrations,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      link: '/admin/registrations',
    },
    {
      title: 'Articole Blog',
      value: stats.totalArticles,
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      link: '/admin/blog',
    },
    {
      title: 'Testimoniale',
      value: stats.totalTestimonials,
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      link: '/admin/testimonials',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard Administrare
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bun venit în panoul de administrare Vali Events
        </Typography>
      </Box>

      {/* Statistici */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              component={Link}
              to={card.link}
              sx={{
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    color: card.color,
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Evenimente Recente */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Evenimente Viitoare
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/events/new')}
              >
                Nou
              </Button>
            </Box>

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentEvents.map((event) => (
                <ListItem key={event.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {event.titlu}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.data_start)} • {formatPrice(event.pret)}
                        </Typography>
                        <br />
                        <Chip
                          label={event.categorie}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/events/${event.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {recentEvents.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nu există evenimente viitoare"
                    secondary="Creează primul eveniment"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Articole Recente */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Articole Recente
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/blog/new')}
              >
                Nou
              </Button>
            </Box>

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentArticles.map((article) => (
                <ListItem key={article.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {article.titlu}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(article.data_publicare)}
                        </Typography>
                        <br />
                        <Chip
                          label={article.status}
                          size="small"
                          color={article.status === 'publicat' ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/blog/${article.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {recentArticles.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nu există articole"
                    secondary="Creează primul articol"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Înregistrări Recente */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Înregistrări Recente
              </Typography>
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate('/admin/registrations')}
              >
                Vezi toate
              </Button>
            </Box>

            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentRegistrations.map((registration) => (
                <ListItem key={registration.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {registration.nume_participant}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {registration.titlu_eveniment}
                        </Typography>
                        <br />
                        <Chip
                          label={registration.status_plata}
                          size="small"
                          color={
                            registration.status_plata === 'platit' ? 'success' :
                            registration.status_plata === 'in_asteptare' ? 'warning' :
                            'default'
                          }
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {recentRegistrations.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nu există înregistrări"
                    secondary="Așteptăm primii participanți"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Acțiuni rapide */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Acțiuni Rapide
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/events/new')}
            >
              Eveniment Nou
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ArticleIcon />}
              onClick={() => navigate('/admin/blog/new')}
            >
              Articol Nou
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => navigate('/admin/newsletter')}
            >
              Trimite Newsletter
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/admin/registrations')}
            >
              Vezi Înregistrări
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;