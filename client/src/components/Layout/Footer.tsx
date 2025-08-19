import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Event as EventIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo și descriere */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EventIcon sx={{ fontSize: 32, color: '#F5A623' }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                }}
              >
                Vali Events
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Creăm experiențe memorabile prin evenimente de calitate. 
              Alătură-te comunității noastre și descoperă cele mai interesante 
              evenimente din orașul tău.
            </Typography>
            
            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="#"
                sx={{ 
                  color: 'white', 
                  '&:hover': { color: '#F5A623' } 
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="#"
                sx={{ 
                  color: 'white', 
                  '&:hover': { color: '#F5A623' } 
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="#"
                sx={{ 
                  color: 'white', 
                  '&:hover': { color: '#F5A623' } 
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="#"
                sx={{ 
                  color: 'white', 
                  '&:hover': { color: '#F5A623' } 
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href="#"
                sx={{ 
                  color: 'white', 
                  '&:hover': { color: '#F5A623' } 
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Link-uri rapide */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, color: '#F5A623' }}>
              Link-uri Rapide
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Acasă
              </Link>
              <Link
                component={RouterLink}
                to="/events"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Evenimente Viitoare
              </Link>
              <Link
                component={RouterLink}
                to="/events?status=expirat"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Evenimente Reușite
              </Link>
              <Link
                component={RouterLink}
                to="/blog"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Blog & Noutăți
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Despre Noi
              </Link>
            </Box>
          </Grid>

          {/* Evenimente */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, color: '#F5A623' }}>
              Categorii Evenimente
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/events?categorie=conferinta"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Conferințe
              </Link>
              <Link
                component={RouterLink}
                to="/events?categorie=workshop"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Workshop-uri
              </Link>
              <Link
                component={RouterLink}
                to="/events?categorie=networking"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Networking
              </Link>
              <Link
                component={RouterLink}
                to="/events?categorie=seminar"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Seminarii
              </Link>
              <Link
                component={RouterLink}
                to="/events?categorie=concert"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Concerte
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, color: '#F5A623' }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#F5A623', fontSize: 20 }} />
                <Typography variant="body2">
                  contact@vali-events.ro
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#F5A623', fontSize: 20 }} />
                <Typography variant="body2">
                  +40 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ color: '#F5A623', fontSize: 20 }} />
                <Typography variant="body2">
                  București, România
                </Typography>
              </Box>
            </Box>

            {/* Newsletter */}
            <Box sx={{ mt: 3 }}>
              <Link
                component={RouterLink}
                to="/newsletter"
                sx={{
                  display: 'inline-block',
                  backgroundColor: '#F5A623',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#E89611',
                  },
                }}
              >
                Abonează-te la Newsletter
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Divider și copyright */}
        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              © {currentYear} Vali Events. Toate drepturile rezervate.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: { xs: 'center', md: 'flex-end' },
                mt: { xs: 2, md: 0 }
              }}
            >
              <Link
                href="#"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Termeni și Condiții
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Politica de Confidențialitate
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#F5A623' },
                }}
              >
                Cookies
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;