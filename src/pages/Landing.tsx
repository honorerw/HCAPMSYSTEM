import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { 
  KeyboardArrowRight, 
  Person, 
  LocalHospital, 
  Schedule, 
  Description,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

import heroImage1 from '../assets/hero.jpg';
import heroImage2 from '../assets/appointment.jpg';
import aboutImage from '../assets/appointment.jpg';
import logoImage from '../assets/logo.png';
import '../styles/Landing.scss';

const heroImages = [heroImage1, heroImage2];

const Landing: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="fixed" sx={{ background: isDarkMode ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', zIndex: 1200 }}>
        <Container maxWidth="lg">
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
                onClick={() => {
                  navigate('/about');
                }}
                sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                About
              </Typography>
              <Typography 
                onClick={() => {
                  navigate('/contact');
                }}
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
                  if (users) {
                    navigate(users.role === 'admin' ? '/dashboard' : users.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
                  } else {
                    navigate('/login');
                  }
                  handleMenuClose();
                }}>Dashboard</MenuItem>
<MenuItem onClick={() => {
                  navigate('/about');
                  handleMenuClose();
                }}>About</MenuItem>
              <MenuItem onClick={() => {
                  navigate('/contact');
                  handleMenuClose();
                }}>Contact</MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer for fixed header */}
      <Box sx={{ height: { xs: 60, md: 70 } }} />

      {/* Hero Section with Auto-sliding Images */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center" className="hero-content">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ 
                opacity: 1, 
                animation: 'slideIn 0.6s ease-out',
                '@keyframes slideIn': {
                  from: { opacity: 0, transform: 'translateX(-20px)' },
                  to: { opacity: 1, transform: 'translateX(0)' }
                }
              }}>
                <Typography variant="h2" className="hero-title" gutterBottom>
                  Revolutionize Healthcare
                  <br /><span className="highlight">Management</span>
                </Typography>
                <Typography variant="h5" className="hero-subtitle" paragraph>
                  Streamline patient records, appointments, and analytics with our modern platform.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  className="cta-button"
                  endIcon={<KeyboardArrowRight />}
                  onClick={() => {
                    const users = JSON.parse(localStorage.getItem('hcapms_current_user') || 'null');
                    if (users) {
                      navigate(users.role === 'admin' ? '/dashboard' : users.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  Get Started 
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="hero-image-container">
                <Box 
                  className="slide-nav prev" 
                  onClick={prevSlide}
                  sx={{ 
                    position: 'absolute', 
                    left: { xs: 5, md: 10 }, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <ChevronLeft />
                </Box>
                
                {heroImages.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`Healthcare ${index + 1}`}
                    className="hero-image"
                    sx={{
                      opacity: index === currentSlide ? 1 : 0,
                      transition: 'opacity 0.8s ease-in-out'
                    }}
                  />
                ))}

                <Box 
                  className="slide-nav next" 
                  onClick={nextSlide}
                  sx={{ 
                    position: 'absolute', 
                    right: { xs: 5, md: 10 }, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'white' }
                  }}
                >
                  <ChevronRight />
                </Box>

                {/* Slide Indicators */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 12, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1
                }}>
                  {heroImages.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        width: index === currentSlide ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title" align="center" gutterBottom>
            Core Features
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
                <Card className="feature-card" sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                    <Box className="feature-icon" sx={{ mb: 1.5 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, mb: 1 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                component="img"
                src={aboutImage}
                alt="About Us"
                className="about-image"
                sx={{ display: 'block', width: '100%', maxWidth: { xs: 320, md: 450 }, mx: 'auto' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Efficient. Secure. Modern.
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                Manage your healthcare ecosystem seamlessly
              </Typography>
              <Typography paragraph sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', md: '1rem' } }}>
                Our platform empowers clinics and hospitals with intuitive tools for patient management,
                appointment scheduling, and real-time analytics. Experience the future of healthcare today.
              </Typography>
              <Typography paragraph sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', md: '1rem' }, mt: 2 }}>
                HCAPMS (Hospital Clinic Appointment & Patient Management System) is designed to streamline
                healthcare operations in Rwanda and beyond. We provide comprehensive solutions for managing
                patient records, doctor schedules, appointments, and medical records all in one place.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: isDarkMode ? '#121212' : '#1a1a2e', 
        padding: '40px 0 20px',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Quick Links */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Home</Typography>
                <Typography component={Link} to="/login" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Login</Typography>
                <Typography component={Link} to="/signup" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Sign Up</Typography>
                <Typography component={Link} to="/patients" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Patients</Typography>
                <Typography component={Link} to="/doctors" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Doctors</Typography>
                <Typography component={Link} to="/appointments" sx={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', '&:hover': { color: '#667eea' } }}>Appointments</Typography>
              </Box>
            </Grid>

            {/* Contact Info */}
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

            {/* Social Media */}
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

            {/* Developer Info */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Developer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box component="img" src={logoImage} alt="HCAPMS Logo" sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 2 }} />
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

          {/* Copyright */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} HCAPMS. All rights reserved. Designed by IFITEBYOSE Elina
            </Typography>
          </Box>
        </Container>
      </footer>
    </>
  );
};

const features = [
  {
    title: 'Patient Management',
    desc: 'Register and track patient profiles with complete medical history.',
    icon: <Person sx={{ fontSize: '2.5rem', color: '#667eea' }} />,
  },
  {
    title: 'Doctor Directory',
    desc: 'Manage doctor schedules and specializations effortlessly.',
    icon: <LocalHospital sx={{ fontSize: '2.5rem', color: '#4ecdc4' }} />,
  },
  {
    title: 'Appointment Booking',
    desc: 'Schedule and manage appointments with smart availability checks.',
    icon: <Schedule sx={{ fontSize: '2.5rem', color: '#ff6b6b' }} />,
  },
  {
    title: 'Medical Records',
    desc: 'Securely store and access patient records and treatment history.',
    icon: <Description sx={{ fontSize: '2.5rem', color: '#764ba2' }} />,
  },
];

export default Landing;