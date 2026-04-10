import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Chip, InputAdornment
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, PersonAdd, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyPatients, type Patient } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';

const Patients: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useThemeContext();

  const getBackPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };
  const [patients, setPatients] = useState<Patient[]>(dummyPatients);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.nationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
    } else {
      setEditingPatient(null);
      setFormData({
        name: '', dob: '', nationalId: '', phone: '', email: '',
        address: '', allergies: '', chronicConditions: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPatient(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...p, ...formData } as Patient : p));
    } else {
      const newPatient: Patient = {
        ...formData as Patient,
        id: Math.max(...patients.map(p => p.id)) + 1
      };
      setPatients([...patients, newPatient]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'nationalId', headerName: 'National ID', width: 130 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'dob', headerName: 'Date of Birth', width: 120 },
    {
      field: 'allergies', headerName: 'Allergies', width: 150,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? <Chip label={params.value} size="small" color="warning" variant="outlined" /> : '-'
      )
    },
    {
      field: 'chronicConditions', headerName: 'Chronic Conditions', width: 180,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? <Chip label={params.value} size="small" color="error" variant="outlined" /> : '-'
      )
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton size="small" onClick={() => handleOpenDialog(params.row)} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to={getBackPath()} sx={{ color: isDarkMode ? '#fff' : '#333' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Patient Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpenDialog()}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Add Patient
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search patients by name, national ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      <Paper sx={{ height: 600, width: '100%', borderRadius: 2 }}>
        <DataGrid
          rows={filteredPatients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          pagination
          paginationMode="server"
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model: { page: number; pageSize: number }) => { setPage(model.page); setRowsPerPage(model.pageSize); }}
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
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              value={formData.dob || ''}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="National ID"
              fullWidth
              value={formData.nationalId || ''}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextField
              label="Allergies"
              fullWidth
              value={formData.allergies || ''}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g., Penicillin, Pollen"
            />
            <TextField
              label="Chronic Conditions"
              fullWidth
              value={formData.chronicConditions || ''}
              onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
              placeholder="e.g., Diabetes, Hypertension"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.nationalId || !formData.phone}
          >
            {editingPatient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Patients;