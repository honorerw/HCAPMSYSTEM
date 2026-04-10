import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Button } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import logoImage from '../assets/logo.png';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: isDarkMode ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 70 } }}>
          <Box 
            component={Link} 
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Box 
              component="img"
              src={logoImage}
              alt="HCAPMS Logo"
              sx={{ width: 40, height: 40, objectFit: 'contain' }}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            <Typography 
              component={Link} 
              to="/"
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Home
            </Typography>
            <Typography 
              onClick={() => {
                const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                if (users) {
                  navigate('/patients');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Patients
            </Typography>
            <Typography 
              onClick={() => {
                const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                if (users) {
                  navigate('/doctors');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Doctors
            </Typography>
            <Typography 
              onClick={() => {
                const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                if (users) {
                  navigate('/appointments');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Appointments
            </Typography>
            <Typography 
              onClick={() => {
                const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                if (users) {
                  navigate('/records');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Records
            </Typography>
            <Typography 
              onClick={() => navigate('/about')}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              About
            </Typography>
            <Typography 
              onClick={() => navigate('/contact')}
              sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Contact
            </Typography>
            
            <IconButton onClick={toggleTheme} sx={{ color: isDarkMode ? '#fff' : '#333' }}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <Button 
              variant="contained"
              onClick={() => {
                const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                if (users) {
                  navigate(users.role === 'admin' ? '/dashboard' : users.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
                } else {
                  navigate('/login');
                }
              }}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '0.85rem', px: 2 }}
            >
              login or signup
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: 'block', md: 'none' }, color: isDarkMode ? '#fff' : '#333' }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                color: isDarkMode ? '#fff' : '#333'
              }
            }}
          >
            <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>Home</MenuItem>
            <MenuItem onClick={() => {
              const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
              if (users) { navigate('/patients'); } else { navigate('/login'); }
              handleMenuClose();
            }}>Patients</MenuItem>
            <MenuItem onClick={() => {
              const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
              if (users) { navigate('/doctors'); } else { navigate('/login'); }
              handleMenuClose();
            }}>Doctors</MenuItem>
            <MenuItem onClick={() => {
              const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
              if (users) { navigate('/appointments'); } else { navigate('/login'); }
              handleMenuClose();
            }}>Appointments</MenuItem>
            <MenuItem onClick={() => {
              const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
              if (users) { navigate('/records'); } else { navigate('/login'); }
              handleMenuClose();
            }}>Records</MenuItem>
            <MenuItem onClick={() => { navigate('/about'); handleMenuClose(); }}>About</MenuItem>
            <MenuItem onClick={() => { navigate('/contact'); handleMenuClose(); }}>Contact</MenuItem>
            <MenuItem onClick={() => {
              const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
              if (users) {
                navigate(users.role === 'admin' ? '/dashboard' : users.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
              } else {
                navigate('/login');
              }
              handleMenuClose();
            }}>Dashboard</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: { xs: 60, md: 70 } }} />
    </>
  );
};

export default Header;