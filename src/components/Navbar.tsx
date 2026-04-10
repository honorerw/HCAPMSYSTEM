import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Badge, Button, Avatar } from '@mui/material';
import { Menu as MenuIcon, Notifications, Logout, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

interface NavbarProps {
  onDrawerToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin': return '/dashboard';
      case 'doctor': return '/doctor-dashboard';
      case 'patient': return '/patient-dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            HCAPMS
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          
          {user ? (
            <>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton onClick={handleUserMenu} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea', fontSize: 14 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleClose}
                PaperProps={{
                  sx: { minWidth: 150 }
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.name}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize', color: '#667eea' }}>
                    {user.role}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => { navigate(getDashboardPath()); handleClose(); }}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ color: 'inherit' }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;