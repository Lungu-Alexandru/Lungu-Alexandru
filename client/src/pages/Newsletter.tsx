import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Email as EmailIcon,
  Check as CheckIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { newsletterAPI } from '../services/api';
import { NewsletterFormData } from '../types';
import { isValidEmail } from '../utils/helpers';

const Newsletter: React.FC = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    nume: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();

  const handleInputChange = (field: keyof NewsletterFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Șterge mesajele de eroare când utilizatorul începe să scrie
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validări
    if (!formData.email) {
      setError('Email-ul este obligatoriu');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Te rugăm să introduci o adresă de email validă');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await newsletterAPI.subscribe(formData);

      if (response.success) {
        setSuccess(true);
        setFormData({ email: '', nume: '' });
      } else {
        setError(response.message || 'A apărut o eroare la abonare');
      }
    } catch (err: any) {
      console.error('Eroare la abonare:', err);
      setError(
        err.response?.data?.message || 
        'Nu am putut procesa cererea. Te rugăm să încerci din nou.'
      );
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <EventIcon color="primary" />,
      title: 'Primești primul informații despre evenimente noi',
      description: 'Fii primul care află despre evenimentele noastre exclusive',
    },
    {
      icon: <StarIcon color="primary" />,
      title: 'Oferte speciale și reduceri',
      description: 'Acces prioritar la bilete cu preț redus și oferte exclusive',
    },
    {
      icon: <PeopleIcon color="primary" />,
      title: 'Conținut exclusiv din comunitate',
      description: 'Povești, fotografii și experiențe de la evenimentele noastre',
    },
    {
      icon: <NotificationsIcon color="primary" />,
      title: 'Notificări personalizate',
      description: 'Primești doar informațiile care te interesează cu adevărat',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <EmailIcon
          sx={{
            fontSize: 64,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Abonează-te la Newsletter
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          Rămâi la curent cu cele mai noi evenimente și primește oferte exclusive
          direct în inbox-ul tău.
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Formularul de abonare */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Alătură-te comunității noastre
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Mulțumim pentru abonare!
                </Typography>
                <Typography variant="body2">
                  Vei primi în curând un email de confirmare. Verifică și folderul spam.
                </Typography>
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Numele tău (opțional)"
                value={formData.nume}
                onChange={handleInputChange('nume')}
                sx={{ mb: 3 }}
                disabled={loading || success}
              />

              <TextField
                fullWidth
                label="Adresa de email *"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                sx={{ mb: 3 }}
                disabled={loading || success}
                required
                error={!!error && error.includes('email')}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || success}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Se procesează...' : success ? 'Abonat cu succes!' : 'Abonează-te'}
              </Button>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 2, display: 'block' }}
            >
              * Câmpurile marcate sunt obligatorii. Nu vom distribui niciodată
              datele tale personale.
            </Typography>
          </Paper>
        </Grid>

        {/* Beneficiile abonării */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            De ce să te abonezi?
          </Typography>

          <List>
            {benefits.map((benefit, index) => (
              <ListItem
                key={index}
                sx={{
                  alignItems: 'flex-start',
                  px: 0,
                  mb: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {benefit.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          {/* Statistici */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mt: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Alătură-te celor peste 1,000 de abonați
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  500+
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Evenimente organizate
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  95%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Rata de satisfacție
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Secțiune suplimentară */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Ce vei primi în newsletter?
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3 }}>
              <EventIcon sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Evenimente Noi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Anunțuri despre evenimente viitoare și posibilitatea de a rezerva
                bilete înainte de lansarea publică.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3 }}>
              <StarIcon sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Oferte Exclusive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reduceri speciale, coduri promocionale și acces prioritar
                la evenimente cu locuri limitate.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3 }}>
              <PeopleIcon sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Povești din Comunitate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experiențe ale participanților, fotografii din culisele evenimentelor
                și interviuri cu speakerii.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer cu link de dezabonare */}
      <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Poți să te dezabonezi oricând din newsletter-ul nostru.
          Respectăm confidențialitatea datelor tale și nu le vom distribui niciodată.
        </Typography>
      </Box>
    </Container>
  );
};

export default Newsletter;