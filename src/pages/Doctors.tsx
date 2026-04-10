import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Chip, InputAdornment, Avatar
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, MedicalServices, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyDoctors, type Doctor } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';

const Doctors: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useThemeContext();

  const getBackPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };
  const [doctors, setDoctors] = useState<Doctor[]>(dummyDoctors);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({});

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData(doctor);
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '', department: '', experience: 0, availability: [], biography: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoctor(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingDoctor) {
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...d, ...formData } as Doctor : d));
    } else {
      const newDoctor: Doctor = {
        ...formData as Doctor,
        id: Math.max(...doctors.map(d => d.id)) + 1
      };
      setDoctors([...doctors, newDoctor]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name', headerName: 'Name', flex: 1, minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {params.value.charAt(0)}
          </Avatar>
          {params.value}
        </Box>
      )
    },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'experience', headerName: 'Experience (Years)', width: 150 },
    {
      field: 'availability', headerName: 'Availability', width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {(params.value as string[]).slice(0, 2).map((item, idx) => (
            <Chip key={idx} label={item} size="small" variant="outlined" />
          ))}
          {(params.value as string[]).length > 2 && (
            <Chip label={`+${(params.value as string[]).length - 2}`} size="small" />
          )}
        </Box>
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
            Doctor Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<MedicalServices />}
          onClick={() => handleOpenDialog()}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Add Doctor
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search doctors by name or department..."
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
          rows={filteredDoctors}
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
          {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
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
              label="Department"
              fullWidth
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Cardiology, General Medicine"
            />
            <TextField
              label="Years of Experience"
              type="number"
              fullWidth
              value={formData.experience || ''}
              onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
            />
            <TextField
              label="Availability"
              fullWidth
              value={formData.availability?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="e.g., Mon 9-12, Wed 14-17"
              helperText="Separate multiple slots with commas"
            />
            <TextField
              label="Biography"
              fullWidth
              multiline
              rows={3}
              value={formData.biography || ''}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.department}
          >
            {editingDoctor ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Doctors;