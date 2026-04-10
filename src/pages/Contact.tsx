import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Box, TextField, Button } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const { isDarkMode } = useThemeContext();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Header />
      <Box sx={{ minHeight: '100vh', pt: 10, pb: 6, background: isDarkMode ? '#121212' : '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            Get In Touch
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Have questions? We'd love to hear from you.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Send us a Message
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Your Name"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <Button 
                    type="submit"
                    variant="contained" 
                    size="large"
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Info
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone sx={{ color: '#667eea', fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">+250 788 123 456</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email sx={{ color: '#667eea', fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">info@hcapms.rw</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOn sx={{ color: '#667eea', fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">Kigali, Rwanda</Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    bgcolor: 'rgba(102,126,234,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
                  }}>
                    <Facebook sx={{ color: '#667eea', fontSize: 24 }} />
                  </Box>
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    bgcolor: 'rgba(102,126,234,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
                  }}>
                    <Twitter sx={{ color: '#667eea', fontSize: 24 }} />
                  </Box>
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    bgcolor: 'rgba(102,126,234,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
                  }}>
                    <LinkedIn sx={{ color: '#667eea', fontSize: 24 }} />
                  </Box>
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: '50%', 
                    bgcolor: 'rgba(102,126,234,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', '&:hover': { bgcolor: '#667eea' }
                  }}>
                    <Instagram sx={{ color: '#667eea', fontSize: 24 }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden', height: { xs: 300, md: 400 } }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.456798765432!2d30.05956131428447!3d-1.9400625981554662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d43be7f4a5a91b%3A0x1c3c4e2c1a2f3e4d!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            />
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Contact;