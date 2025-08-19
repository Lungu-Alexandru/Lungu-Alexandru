import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  Info as InfoIcon,
  Contact as ContactIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Acasă', path: '/', icon: <HomeIcon /> },
    { label: 'Evenimente', path: '/events', icon: <EventIcon /> },
    { label: 'Blog', path: '/blog', icon: <ArticleIcon /> },
    { label: 'Despre', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const DesktopMenu = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {menuItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          color="inherit"
          startIcon={item.icon}
          sx={{
            color: 'white',
            fontWeight: isActivePath(item.path) ? 600 : 400,
            borderBottom: isActivePath(item.path) ? '2px solid #F5A623' : 'none',
            borderRadius: 0,
            padding: '12px 16px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderBottom: '2px solid #F5A623',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          backgroundColor: theme.palette.primary.dark,
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ color: 'white', mb: 2 }}>
          Vali Events
        </Typography>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            button
            onClick={() => handleMenuItemClick(item.path)}
            sx={{
              backgroundColor: isActivePath(item.path) ? 'rgba(245, 166, 35, 0.2)' : 'transparent',
              borderLeft: isActivePath(item.path) ? '4px solid #F5A623' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box sx={{ mr: 2, color: '#F5A623' }}>
              {item.icon}
            </Box>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                color: 'white',
                '& .MuiListItemText-primary': {
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: 'white',
            borderColor: '#F5A623',
            '&:hover': {
              backgroundColor: '#F5A623',
              borderColor: '#F5A623',
            },
          }}
          onClick={() => handleMenuItemClick('/newsletter')}
        >
          Newsletter
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo și titlu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <EventIcon sx={{ fontSize: 32, color: '#F5A623' }} />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Vali Events
              </Typography>
            </Box>
          </Box>

          {/* Meniu desktop */}
          {!isMobile && <DesktopMenu />}

          {/* Butoane acțiuni */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Button
                variant="outlined"
                component={Link}
                to="/newsletter"
                sx={{
                  color: 'white',
                  borderColor: '#F5A623',
                  '&:hover': {
                    backgroundColor: '#F5A623',
                    borderColor: '#F5A623',
                  },
                }}
              >
                Newsletter
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Meniu mobil */}
      {isMobile && <MobileMenu />}
    </>
  );
};

export default Header;