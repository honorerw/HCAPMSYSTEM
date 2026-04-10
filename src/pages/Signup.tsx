import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, ToggleButtonGroup, ToggleButton, InputAdornment, IconButton, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole, getDashboardPath } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import logoImage from '../assets/logo.png';

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (signup(name, email, password, role)) {
        navigate(getDashboardPath(role));
      } else {
        setError('Email already registered');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <>
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
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.9rem' }}>Home</Typography>
              <IconButton onClick={toggleTheme} sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: '#667eea', color: '#667eea', '&:hover': { borderColor: '#764ba2', background: 'rgba(102,126,234,0.1)' } }}>
                Sign In
              </Button>
            </Box>

            <IconButton sx={{ display: { xs: 'block', md: 'none' }, color: isDarkMode ? '#fff' : '#333' }} onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff', color: isDarkMode ? '#fff' : '#333' } }}>
              <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>Home</MenuItem>
              <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>Sign In</MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ height: { xs: 60, md: 70 } }} />

      <Box sx={{ 
        minHeight: 'calc(100vh - 140px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4,
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box component="img" src={logoImage} alt="HCAPMS Logo" sx={{ width: 60, height: 60, objectFit: 'contain', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HCAPMS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Create your account to get started.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" sx={{ mb: 1 }}>I am a:</Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, newRole) => newRole && setRole(newRole)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value="admin" sx={{ py: 1.5 }}>
                Admin
              </ToggleButton>
              <ToggleButton value="doctor" sx={{ py: 1.5 }}>
                Doctor
              </ToggleButton>
              <ToggleButton value="patient" sx={{ py: 1.5 }}>
                Patient
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={<PersonAdd />}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 1.5 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Typography component={Link} to="/login" sx={{ textDecoration: 'none', color: '#667eea', fontWeight: 600 }}>
                Sign In
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>

    <footer style={{ 
      background: isDarkMode ? '#121212' : '#1a1a2e', 
      padding: '20px 0',
      borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' }, color: '#ffffff' }}>
              HCAPMS
            </Typography>
            <Typography sx={{ color: '#ffffff', fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
              © {new Date().getFullYear()} All rights reserved
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography component={Link} to="/dashboard" sx={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { color: '#667eea' } }}>Dashboard</Typography>
            <Typography component={Link} to="/patients" sx={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { color: '#667eea' } }}>Patients</Typography>
            <Typography component={Link} to="/doctors" sx={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { color: '#667eea' } }}>Doctors</Typography>
            <Typography component={Link} to="/appointments" sx={{ textDecoration: 'none', color: '#ffffff', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:hover': { color: '#667eea' } }}>Appointments</Typography>
          </Box>
        </Box>
      </Container>
    </footer>
    </>
  );
};

export default Signup;