import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Menu, MenuItem, FormControl, InputLabel, Select, Chip, Switch, FormControlLabel, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { People, CalendarToday, Description, TrendingUp, Logout, Settings, Close, AccountCircle, Edit, Delete, Search, Add, Dashboard as DashboardIcon, Person } from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { dummyAppointments, dummyDoctors, dummyPatients, type Doctor, type Appointment, type Patient } from '../data/dummyData';
import logoImage from '../assets/logo.png';

const drawerWidth = 260;

interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  type: 'Consultation' | 'Lab Result' | 'Prescription' | 'Imaging' | 'Follow-up';
  diagnosis: string;
  notes: string;
}

const initialRecords: MedicalRecord[] = [
  { id: 1, patientId: 1, doctorId: 1, date: '2024-10-15', type: 'Consultation', diagnosis: 'Hypertension', notes: 'Patient complained of headaches' },
  { id: 2, patientId: 2, doctorId: 2, date: '2024-10-16', type: 'Follow-up', diagnosis: 'Diabetes check', notes: 'Blood sugar levels normal' },
  { id: 3, patientId: 3, doctorId: 1, date: '2024-10-17', type: 'Lab Result', diagnosis: 'Blood test results', notes: 'All parameters within range' },
  { id: 4, patientId: 4, doctorId: 1, date: '2024-10-18', type: 'Prescription', diagnosis: 'Seasonal allergies', notes: 'Prescribed antihistamines' },
  { id: 5, patientId: 5, doctorId: 1, date: '2024-10-19', type: 'Consultation', diagnosis: 'Prenatal checkup', notes: 'Everything normal' },
];

const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor-dashboard' },
    { text: 'My Appointments', icon: <CalendarToday />, path: '/appointments' },
    { text: 'Records', icon: <Description />, path: '/records' },
    { text: 'Patients', icon: <People />, path: '/patients' },
  ];

  useEffect(() => {
    const index = navItems.findIndex(item => item.path === location.pathname);
    if (index !== -1) {
      setActiveTab(index);
    }
  }, [location.pathname]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(dummyAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Appointment>>({});
  
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [viewRecordDialogOpen, setViewRecordDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [recordFormData, setRecordFormData] = useState<Partial<MedicalRecord>>({});
  const [searchQuery, setSearchQuery] = useState('');

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

  const doctorRecords = records.filter(r => r.doctorId === doctorId);
  const totalRecords = doctorRecords.length;
  const consultationCount = doctorRecords.filter(r => r.type === 'Consultation').length;
  const prescriptionCount = doctorRecords.filter(r => r.type === 'Prescription').length;
  const labResultCount = doctorRecords.filter(r => r.type === 'Lab Result').length;

  const filteredRecords = doctorRecords.filter(r => {
    const patientName = dummyPatients.find(p => p.id === r.patientId)?.name.toLowerCase() || '';
    return patientName.includes(searchQuery.toLowerCase()) ||
           r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.date.includes(searchQuery);
  });

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

  const drawer = (
    <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column', background: isDarkMode ? '#1a1a2e' : '#fff', borderRight: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}` }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box 
          component="img"
          src={logoImage}
          alt="HCAPMS Logo"
          sx={{ width: 40, height: 40, objectFit: 'contain' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HCAPMS
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: isDarkMode ? 'rgba(102,126,234,0.1)' : 'rgba(102,126,234,0.05)', mx: 1, borderRadius: 2, mb: 1 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#667eea', fontSize: 18 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {matchedDoctor?.name || user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Doctor
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                setActiveTab(index);
                if (item.path !== location.pathname) {
                  navigate(item.path);
                }
              }}
              selected={activeTab === index}
              sx={{
                borderRadius: 2,
                py: 1.2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)' },
                },
                '&:hover': { background: isDarkMode ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.1)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">Theme</Typography>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={isDarkMode}
                onChange={toggleTheme}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#667eea' },
                }}
              />
            }
            label=""
            sx={{ m: 0 }}
          />
        </Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setProfileOpen(true)}
          sx={{ mb: 1, borderColor: isDarkMode ? '#444' : '#ddd', color: isDarkMode ? '#fff' : '#333', '&:hover': { borderColor: '#667eea' } }}
        >
          Profile
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ borderColor: isDarkMode ? '#444' : '#ddd', color: isDarkMode ? '#ff6b6b' : '#f44336', '&:hover': { borderColor: '#f44336' } }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
          p: { xs: 2, md: 4 },
        }}
      >
      <Container maxWidth="xl" sx={{ mb: 4, pl: { xs: 0, md: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {activeTab === 0 ? `Welcome, ${matchedDoctor?.name || user?.name}!` : 'My Appointments'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {activeTab === 0 ? "Here's your schedule overview." : 'View and manage your appointments'}
          </Typography>
        </Box>
      </Box>

      {activeTab === 0 ? (
        <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarToday />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{totalPatients}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Appointments</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: '#fff' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{confirmedCount}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Confirmed</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: '#fff' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Description />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{pendingCount}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)', color: '#fff' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <People />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{cancelledCount}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Cancelled</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upcoming Appointments
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
                      <Chip label={apt.status} color={statusColors[apt.status]} size="small" />
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
                <Typography color="text.secondary">No upcoming appointments.</Typography>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Appointment Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                  <Box sx={{ position: 'relative', width: 150, height: 150, borderRadius: '50%', background: `conic-gradient(#4caf50 0% ${(confirmedCount/totalPatients)*100}%, #ff9800 ${(confirmedCount/totalPatients)*100}% ${(confirmedCount/totalPatients + pendingCount/totalPatients)*100}%, #f44336 ${(confirmedCount/totalPatients + pendingCount/totalPatients)*100}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: 100, height: 100, borderRadius: '50%', bgcolor: isDarkMode ? '#1e1e1e' : '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalPatients}</Typography>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#4caf50' }} />
                    <Typography variant="caption">Confirmed ({confirmedCount})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#ff9800' }} />
                    <Typography variant="caption">Pending ({pendingCount})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#f44336' }} />
                    <Typography variant="caption">Cancelled ({cancelledCount})</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            All My Appointments
          </Typography>
          {doctorAppointments.length > 0 ? (
            doctorAppointments.map((apt, idx) => (
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
                  <Chip label={apt.status} color={statusColors[apt.status]} size="small" />
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
      )}

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
      </Box>
    </Box>
  );
};

export default DoctorDashboard;