import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, AppBar, Toolbar, Menu, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel } from '@mui/material';
import { CalendarToday, Description, LocalHospital, Logout, Settings, Close, AccountCircle, Add, Edit, Delete } from '@mui/icons-material';
import { dummyAppointments, dummyDoctors, dummyPatients, type Patient, type Appointment } from '../data/dummyData';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import logoImage from '../assets/logo.png';

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<Appointment>>({
    doctorId: 0,
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(dummyAppointments);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSaveProfile = () => {
    setProfileOpen(false);
  };

  const handleBookAppointment = () => {
    if (!bookingData.doctorId || !bookingData.date || !bookingData.time) return;
    const selectedDoctor = dummyDoctors.find(d => d.id === bookingData.doctorId);
    const newAppointment: Appointment = {
      id: Math.max(...appointmentsList.map(a => a.id)) + 1,
      patientId,
      doctorId: bookingData.doctorId,
      patientName: matchedPatient?.name || '',
      doctorName: selectedDoctor?.name || '',
      type: selectedDoctor?.department || 'General',
      date: bookingData.date,
      time: bookingData.time,
      status: 'Pending'
    };
    setAppointmentsList([...appointmentsList, newAppointment]);
    setBookingOpen(false);
    setBookingData({ doctorId: 0, date: new Date().toISOString().split('T')[0], time: '09:00' });
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setBookingData({
      doctorId: apt.doctorId,
      date: apt.date,
      time: apt.time
    });
    setBookingOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (!editingAppointment || !bookingData.doctorId || !bookingData.date || !bookingData.time) return;
    const selectedDoctor = dummyDoctors.find(d => d.id === bookingData.doctorId);
    const updatedAppointment: Appointment = {
      ...editingAppointment,
      doctorId: bookingData.doctorId as number,
      doctorName: selectedDoctor?.name || '',
      type: selectedDoctor?.department || 'General',
      date: bookingData.date as string,
      time: bookingData.time as string
    };
    setAppointmentsList(appointmentsList.map(a => 
      a.id === editingAppointment.id ? updatedAppointment : a
    ));
    setBookingOpen(false);
    setEditingAppointment(null);
    setBookingData({ doctorId: 0, date: new Date().toISOString().split('T')[0], time: '09:00' });
  };

  const handleDeleteAppointment = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointmentsList(appointmentsList.filter(a => a.id !== id));
    }
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
    setEditingAppointment(null);
    setBookingData({ doctorId: 0, date: new Date().toISOString().split('T')[0], time: '09:00' });
  };

  const matchedPatient: Patient | undefined = dummyPatients.find(p => 
    user?.name && p.name.toLowerCase().includes(user.name.toLowerCase().split(' ').pop() || '')
  );
  const patientId = matchedPatient?.id || 1;

  const getDoctorName = (id: number) => dummyDoctors.find(d => d.id === id)?.name || 'Unknown';

  const myAppointmentsList = appointmentsList.filter(apt => apt.patientId === patientId);

  const confirmedCount = myAppointmentsList.filter(apt => apt.status === 'Confirmed').length;

  const myRecords = [
    { type: 'Consultation', date: '2024-10-15', diagnosis: 'General Checkup' },
    { type: 'Lab Result', date: '2024-10-10', diagnosis: 'Blood Test' },
  ];

  const stats = [
    { label: 'My Appointments', value: myAppointmentsList.length, icon: <CalendarToday />, color: '#667eea', action: () => {} },
    { label: 'Medical Records', value: myRecords.length, icon: <Description />, color: '#764ba2', action: () => {} },
    { label: 'Confirmed', value: confirmedCount, icon: <LocalHospital />, color: '#4caf50', action: () => {} },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ background: isDarkMode ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', zIndex: 1200 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 70 } }}>
            <Box 
              component={Link} 
              to="/patient-dashboard"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box 
                component="img"
                src={logoImage}
                alt="HCAPMS Logo"
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#667eea',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#667eea',
                      },
                    }}
                  />
                }
                label={isDarkMode ? 'Dark' : 'Light'}
                sx={{ color: isDarkMode ? '#fff' : '#333' }}
              />
              
              <IconButton onClick={handleMenuOpen} sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                <AccountCircle />
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
                <MenuItem onClick={() => { setProfileOpen(true); handleMenuClose(); }}>
                  <Settings sx={{ mr: 1 }} /> Manage Profile
                </MenuItem>
                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ height: { xs: 60, md: 70 } }} />

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your health journey.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
              <Card sx={{ borderRadius: 2, cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', transition: '0.2s' } }} onClick={stat.action}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, height: 48, borderRadius: 2, 
                    background: `${stat.color}20`, display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', color: stat.color 
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>My Appointments</Typography>
              </Box>
              {myAppointmentsList.map((apt, idx) => (
                <Box key={idx} sx={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: 2, mb: 1, borderRadius: 1,
                  bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5'
                }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{getDoctorName(apt.doctorId)}</Typography>
                    <Typography variant="body2" color="text.secondary">{apt.date} at {apt.time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem',
                        bgcolor: apt.status === 'Confirmed' ? '#4caf5020' : '#ff980020',
                        color: apt.status === 'Confirmed' ? '#4caf50' : '#ff9800'
                      }}
                    >
                      {apt.status}
                    </Typography>
                    <IconButton size="small" onClick={() => handleEditAppointment(apt)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteAppointment(apt.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Button 
                fullWidth 
                variant="contained"
                startIcon={<Add />}
                onClick={() => setBookingOpen(true)}
                sx={{ mt: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Book New Appointment
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>My Medical Records</Typography>
              </Box>
              {myRecords.map((rec, idx) => (
                <Box key={idx} sx={{ 
                  p: 2, mb: 1, borderRadius: 1,
                  bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{rec.type}</Typography>
                  <Typography variant="body2" color="text.secondary">{rec.diagnosis} - {rec.date}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Manage Profile
            <IconButton onClick={() => setProfileOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#667eea', fontSize: 32 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <TextField
                label="Full Name"
                fullWidth
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                placeholder="+1 (555) 123-4567"
              />
              <TextField
                label="Address"
                fullWidth
                placeholder="Your address"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setProfileOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveProfile} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={bookingOpen} onClose={handleCloseBooking} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
            <IconButton onClick={handleCloseBooking}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={bookingData.doctorId || ''}
                  label="Select Doctor"
                  onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value as number })}
                >
                  {dummyDoctors.map(d => (
                    <MenuItem key={d.id} value={d.id}>{d.name} - {d.department}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Appointment Date"
                type="date"
                fullWidth
                value={bookingData.date || ''}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Appointment Time"
                type="time"
                fullWidth
                value={bookingData.time || ''}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseBooking}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={editingAppointment ? handleUpdateAppointment : handleBookAppointment}
              disabled={!bookingData.doctorId || !bookingData.date || !bookingData.time}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {editingAppointment ? 'Update' : 'Book'} Appointment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default PatientDashboard;