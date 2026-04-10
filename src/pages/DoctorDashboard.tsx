import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, AppBar, Toolbar, Menu, MenuItem, FormControl, InputLabel, Select, Chip, Switch, FormControlLabel } from '@mui/material';
import { People, CalendarToday, Description, TrendingUp, Logout, Settings, Close, AccountCircle, Edit, Delete } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { dummyAppointments, dummyDoctors, dummyPatients, type Doctor, type Appointment } from '../data/dummyData';
import logoImage from '../assets/logo.png';

const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(dummyAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Appointment>>({});

  const matchedDoctor: Doctor | undefined = dummyDoctors.find(d => 
    d.name.toLowerCase().includes(user?.name?.toLowerCase().split(' ').pop() || '') ||
    user?.name?.toLowerCase().includes(d.name.toLowerCase().replace('dr. ', ''))
  );
  const doctorId = matchedDoctor?.id || 1;
  
  const doctorAppointments = appointmentsList.filter(apt => 
    apt.doctorId === doctorId || 
    (matchedDoctor && apt.doctorName?.toLowerCase().includes(matchedDoctor.name.toLowerCase().replace('dr. ', '')))
  );
  
  const totalPatients = doctorAppointments.length;
  const confirmedCount = doctorAppointments.filter(apt => apt.status === 'Confirmed').length;
  const pendingCount = doctorAppointments.filter(apt => apt.status === 'Pending').length;
  const cancelledCount = doctorAppointments.filter(apt => apt.status === 'Cancelled').length;

  const stats = [
    { label: 'Total Appointments', value: totalPatients, icon: <CalendarToday />, color: '#667eea' },
    { label: 'Confirmed', value: confirmedCount, icon: <People />, color: '#4caf50' },
    { label: 'Pending', value: pendingCount, icon: <Description />, color: '#ff9800' },
    { label: 'Cancelled', value: cancelledCount, icon: <TrendingUp />, color: '#f44336' },
  ];

  const upcomingAppointments = doctorAppointments.slice(0, 6);

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

  const getPatientName = (id: number) => dummyPatients.find(p => p.id === id)?.name || 'Unknown';


  const handleUpdateStatus = (id: number, status: 'Confirmed' | 'Cancelled') => {
    setAppointmentsList(appointmentsList.map(a => 
      a.id === id ? { ...a, status } : a
    ));
    setSelectedAppointment(null);
    setAppointmentNotes('');
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setEditFormData({
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      date: apt.date,
      time: apt.time,
      type: apt.type
    });
  };

  const handleUpdateAppointment = () => {
    if (!editingAppointment || !editFormData.patientId || !editFormData.date || !editFormData.time) return;
    const patientName = getPatientName(editFormData.patientId as number);
    setAppointmentsList(appointmentsList.map(a => 
      a.id === editingAppointment.id 
        ? { 
            ...a, 
            patientId: editFormData.patientId as number,
            patientName,
            date: editFormData.date as string,
            time: editFormData.time as string,
            type: editFormData.type as string
          } 
        : a
    ));
    setEditingAppointment(null);
    setEditFormData({});
  };

  const handleCancelAppointment = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointmentsList(appointmentsList.map(a => 
        a.id === id ? { ...a, status: 'Cancelled' } : a
      ));
    }
  };

  const handleCloseManage = () => {
    setSelectedAppointment(null);
    setAppointmentNotes('');
  };

  const handleCloseEdit = () => {
    setEditingAppointment(null);
    setEditFormData({});
  };

  const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
    Confirmed: 'success',
    Pending: 'warning',
    Cancelled: 'error'
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: isDarkMode ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', zIndex: 1200 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 70 } }}>
            <Box 
              component={Link} 
              to="/doctor-dashboard"
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Welcome, {matchedDoctor?.name || user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your schedule.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card sx={{ borderRadius: 2 }}>
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              My Appointments
            </Typography>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, idx) => (
                <Box key={idx} sx={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: 2, mb: 1, borderRadius: 1,
                  bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5'
                }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{apt.patientName}</Typography>
                    <Typography variant="body2" color="text.secondary">{apt.type} - {apt.date} at {apt.time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={apt.status} 
                      color={statusColors[apt.status]} 
                      size="small" 
                    />
                    <IconButton size="small" onClick={() => handleEditAppointment(apt)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleCancelAppointment(apt.id)} color="error" title="Cancel Appointment">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No appointments found.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              My Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#667eea', fontSize: 24 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Doctor</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Email</Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Department</Typography>
                <Typography variant="body1">{matchedDoctor?.department || 'General Medicine'}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Role</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={selectedAppointment !== null} onClose={handleCloseManage} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Manage Appointment
          <IconButton onClick={handleCloseManage}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary">Patient</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedAppointment?.patientName}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary">Appointment Type</Typography>
              <Typography variant="body1">{selectedAppointment?.type}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary">Date & Time</Typography>
              <Typography variant="body1">{selectedAppointment?.date} at {selectedAppointment?.time}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary">Current Status</Typography>
              <Chip 
                label={selectedAppointment?.status} 
                color={statusColors[selectedAppointment?.status || 'Pending']} 
                size="small" 
                sx={{ mt: 0.5 }}
              />
            </Box>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
              placeholder="Add notes about the appointment..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseManage}>Close</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => handleUpdateStatus(selectedAppointment!.id, 'Confirmed')}
          >
            Confirm
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => handleUpdateStatus(selectedAppointment!.id, 'Cancelled')}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editingAppointment !== null} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Appointment
          <IconButton onClick={handleCloseEdit}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Patient</InputLabel>
              <Select
                value={editFormData.patientId || ''}
                label="Patient"
                onChange={(e) => setEditFormData({ ...editFormData, patientId: e.target.value as number })}
              >
                {dummyPatients.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Appointment Type"
              fullWidth
              value={editFormData.type || ''}
              onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={editFormData.date || ''}
              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={editFormData.time || ''}
              onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateAppointment}
            disabled={!editFormData.patientId || !editFormData.date || !editFormData.time}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Update Appointment
          </Button>
        </DialogActions>
      </Dialog>

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
              label="Department"
              fullWidth
              placeholder="Cardiology"
            />
            <TextField
              label="Biography"
              fullWidth
              multiline
              rows={3}
              placeholder="Tell patients about yourself..."
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
    </Container>
    </>
  );
};

export default DoctorDashboard;