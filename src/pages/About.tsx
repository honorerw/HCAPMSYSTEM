import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

import developerImage from '../assets/developer.jpeg';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  const { isDarkMode } = useThemeContext();

  return (
    <>
      <Header />
      <Box sx={{ minHeight: '100vh', pt: 10, pb: 6, background: isDarkMode ? '#121212' : '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          About HCAPMS
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Transforming Healthcare Management in Rwanda
        </Typography>

        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: '100%', textAlign: 'center' }}>
              <Box sx={{ 
                width: 70, height: 70, borderRadius: '50%', 
                bgcolor: '#667eea20', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2 
              }}>
                <Typography sx={{ fontSize: '2rem' }}>🎯</Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To provide efficient, secure, and modern healthcare management solutions that streamline 
                patient care, appointment scheduling, and medical records for hospitals and clinics 
                across Rwanda and Africa.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: '100%', textAlign: 'center' }}>
              <Box sx={{ 
                width: 70, height: 70, borderRadius: '50%', 
                bgcolor: '#764ba220', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2 
              }}>
                <Typography sx={{ fontSize: '2rem' }}>👁️</Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Our Vision
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To become the leading healthcare management platform in Africa, enabling healthcare 
                providers to deliver exceptional patient care through innovative technology solutions.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: '100%', textAlign: 'center' }}>
              <Box sx={{ 
                width: 70, height: 70, borderRadius: '50%', 
                bgcolor: '#4ecdc420', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2 
              }}>
                <Typography sx={{ fontSize: '2rem' }}>⚡</Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Key Features
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Patient Management System
                <br />• Doctor Directory & Scheduling
                <br />• Online Appointment Booking
                <br />• Medical Records Management
                <br />• Analytics Dashboard
                <br />• Dark/Light Mode
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Meet the Developer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box component="img" src={developerImage} alt="Developer" sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                IFITEBYOSE Elina
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Full Stack Developer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Passionate about building modern healthcare solutions that make a difference.
                Based in Kigali, Rwanda.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;