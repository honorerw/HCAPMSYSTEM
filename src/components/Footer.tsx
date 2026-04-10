import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

import developerImage from '../assets/developer.jpeg';

const Footer: React.FC = () => {
  const { isDarkMode } = useThemeContext();

  return (
    <footer style={{ 
      background: isDarkMode ? '#121212' : '#1a1a2e', 
      padding: '40px 0 20px',
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Home</Typography>
              <Typography component={Link} to="/about" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>About</Typography>
              <Typography component={Link} to="/contact" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Contact</Typography>
              <Typography component={Link} to="/login" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Login</Typography>
              <Typography component={Link} to="/signup" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Sign Up</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>+250 788 123 456</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>info@hcapms.rw</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>Kigali, Rwanda</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
              }}>
                <Facebook sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
              }}>
                <Twitter sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
              }}>
                <LinkedIn sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box sx={{ 
                width: 40, height: 40, borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
              }}>
                <Instagram sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
              Developer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={developerImage} alt="Developer" sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2 }} />
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>IFITEBYOSE Elina</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Full Stack Developer</Typography>
              </Box>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', mt: 2 }}>
              Building modern healthcare solutions
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} HCAPMS. All rights reserved. Designed by IFITEBYOSE Elina
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;