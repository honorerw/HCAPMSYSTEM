import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Chip, FormControl, InputLabel, Select, MenuItem,
  InputAdornment
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, CalendarToday, ArrowBack, Print, Download } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyAppointments, dummyPatients, dummyDoctors, type Appointment } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'error'
};

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useThemeContext();

  const getBackPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };
  const [appointments, setAppointments] = useState<Appointment[]>(dummyAppointments);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  const getPatientName = (id: number) => dummyPatients.find(p => p.id === id)?.name || 'Unknown';
  const getDoctorName = (id: number) => dummyDoctors.find(d => d.id === id)?.name || 'Unknown';

  const isPatient = user?.role === 'patient';
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';

  const matchedPatient = isPatient ? dummyPatients.find(p => 
    user.name && p.name.toLowerCase().includes(user.name.toLowerCase().split(' ').pop() || '')
  ) : null;
  const patientId = matchedPatient?.id;

  const matchedDoctor = isDoctor ? dummyDoctors.find(d => 
    d.name.toLowerCase().includes(user.name?.toLowerCase().split(' ').pop() || '') ||
    user.name?.toLowerCase().includes(d.name.toLowerCase().replace('dr. ', ''))
  ) : null;
  const doctorId = matchedDoctor?.id;

  const filteredAppointments = appointments.filter(apt => {
    if (isPatient && patientId) {
      return apt.patientId === patientId;
    }
    if (isDoctor && doctorId) {
      return apt.doctorId === doctorId;
    }
    const patientName = getPatientName(apt.patientId).toLowerCase();
    const doctorName = getDoctorName(apt.doctorId).toLowerCase();
    return patientName.includes(searchQuery.toLowerCase()) ||
           doctorName.includes(searchQuery.toLowerCase()) ||
           apt.date.includes(searchQuery);
  });

  const handleOpenDialog = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData(appointment);
    } else {
      setEditingAppointment(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({ patientId: 0, doctorId: 0, date: today, time: '09:00', status: 'Pending' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAppointment(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === editingAppointment.id ? { ...a, ...formData } as Appointment : a));
    } else {
      const newAppointment: Appointment = {
        ...(formData as Appointment),
        id: Math.max(...appointments.map(a => a.id)) + 1
      };
      setAppointments([...appointments, newAppointment]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const updateStatus = (id: number, newStatus: 'Pending' | 'Confirmed' | 'Cancelled') => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
      field: 'patientId', headerName: 'Patient', flex: 1, minWidth: 140,
      valueGetter: (value: number) => getPatientName(value)
    },
    {
      field: 'doctorId', headerName: 'Doctor', flex: 1, minWidth: 140,
      valueGetter: (value: number) => getDoctorName(value)
    },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'time', headerName: 'Time', width: 90 },
    {
      field: 'status', headerName: 'Status', width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as string]}
          size="small"
          onClick={() => {
            const statuses: ('Pending' | 'Confirmed' | 'Cancelled')[] = ['Pending', 'Confirmed', 'Cancelled'];
            const currentIdx = statuses.indexOf(params.value as 'Pending' | 'Confirmed' | 'Cancelled');
            const nextIdx = (currentIdx + 1) % 3;
            updateStatus(params.row.id, statuses[nextIdx]);
          }}
          sx={{ cursor: 'pointer' }}
        />
      )
    },
  ];

  const upcomingAppointments = filteredAppointments
    .filter(a => new Date(a.date) >= new Date() && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter(a => a.status === 'Confirmed').length,
    pending: filteredAppointments.filter(a => a.status === 'Pending').length,
    cancelled: filteredAppointments.filter(a => a.status === 'Cancelled').length
  };

  const generateReport = () => {
    const headers = ['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status', 'Type'];
    const rows = filteredAppointments.map(a => [
      String(a.id), a.patientName || getPatientName(a.patientId), a.doctorName || getDoctorName(a.doctorId), a.date, a.time, a.status, a.type
    ]);
    return { headers, rows };
  };

  const handlePrintReport = () => {
    const { headers, rows } = generateReport();
    const content = `<!DOCTYPE html><html><head><title>Appointment Report</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{text-align:center;margin-bottom:30px}.header h1{color:#667eea;margin-bottom:5px}.header p{color:#666;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#667eea;color:white;padding:12px 8px;text-align:left}td{padding:8px;border:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:30px;text-align:center;font-size:12px;color:#666}@media print{.no-print{display:none}}</style></head><body><div class="header"><h1>Appointment Scheduling Report</h1><p>Healthcare Patient Management System (HCAPMS)</p><p>Generated:${new Date().toLocaleDateString()}</p><p>Total Appointments:${filteredAppointments.length}</p></div><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="footer"><p>HCAPMS</p></div><button onclick="window.print()" class="no-print" style="position:fixed;top:20px;right:20px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:5px;cursor:pointer">Print</button></body></html>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) { printWindow.document.write(content); printWindow.document.close(); printWindow.focus(); }
  };

  const handleDownloadReport = () => {
    const { headers, rows } = generateReport();
    const content = `<!DOCTYPE html><html><head><title>Appointment Report</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{text-align:center;margin-bottom:30px}.header h1{color:#667eea;margin-bottom:5px}.header p{color:#666;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#667eea;color:white;padding:12px 8px;text-align:left}td{padding:8px;border:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:30px;text-align:center;font-size:12px;color:#666}</style></head><body><div class="header"><h1>Appointment Scheduling Report</h1><p>Healthcare Patient Management System (HCAPMS)</p><p>Generated:${new Date().toLocaleDateString()}</p><p>Total Appointments:${filteredAppointments.length}</p></div><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="footer"><p>HCAPMS</p></div></body></html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to={getBackPath()} sx={{ color: isDarkMode ? '#fff' : '#333' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {(isPatient || isDoctor) ? 'My Appointments' : 'Appointment Scheduling'}
          </Typography>
        </Box>
<Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Print />} onClick={handlePrintReport} sx={{ borderColor: '#667eea', color: '#667eea' }}>Print</Button>
          <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadReport} sx={{ borderColor: '#667eea', color: '#667eea' }}>Download</Button>
          {isAdmin && (
            <Button variant="contained" startIcon={<CalendarToday />} onClick={() => handleOpenDialog()} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              New Appointment
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: stats.total, color: '#667eea' },
          { label: 'Confirmed', value: stats.confirmed, color: '#4caf50' },
          { label: 'Pending', value: stats.pending, color: '#ff9800' },
          { label: 'Cancelled', value: stats.cancelled, color: '#f44336' }
        ].map((stat) => (
          <Box key={stat.label} sx={{ flex: '1 1 200px' }}>
            <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by patient, doctor, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              }}
            />
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 250px' }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Upcoming Appointments</Typography>
            {upcomingAppointments.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {upcomingAppointments.map(apt => (
                  <Box key={apt.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">{getPatientName(apt.patientId)}</Typography>
                    <Typography variant="caption" color="text.secondary">{apt.date}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No upcoming appointments</Typography>
            )}
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ height: 500, width: '100%', borderRadius: 2 }}>
        <DataGrid
          rows={filteredAppointments}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          pagination
          paginationMode="client"
          rowCount={filteredAppointments.length}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model: { page: number; pageSize: number }) => { 
            if (model.pageSize !== rowsPerPage) setPage(0);
            else setPage(model.page);
            setRowsPerPage(model.pageSize); 
          }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              fontWeight: 600,
            },
            '& .MuiDataGrid-cell': {
              borderColor: isDarkMode ? '#3d3d3d' : '#e0e0e0',
            }
          }}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Patient</InputLabel>
              <Select
                value={formData.patientId || ''}
                label="Patient"
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value as number })}
              >
                {dummyPatients.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctorId || ''}
                label="Doctor"
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value as number })}
              >
                {dummyDoctors.map(d => (
                  <MenuItem key={d.id} value={d.id}>{d.name} - {d.department}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              fullWidth
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status || 'Pending'}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Confirmed' | 'Cancelled' })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.patientId || !formData.doctorId || !formData.date || !formData.time}
          >
            {editingAppointment ? 'Update' : 'Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;