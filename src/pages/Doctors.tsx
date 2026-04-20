import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Chip, InputAdornment, Avatar
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, MedicalServices, ArrowBack, Print, Download } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyDoctors, type Doctor } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';
import { FileUpload } from '../components/FileUpload';

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData(doctor);
      setPhotoFile(null);
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '', department: '', experience: 0, availability: [], biography: ''
      });
      setPhotoFile(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoctor(null);
    setFormData({});
  };

  const handleSave = async () => {
    let photoUrl = formData.photo;
    if (photoFile) {
      photoUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(photoFile);
      });
    }
    
    if (editingDoctor) {
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...d, ...formData, photo: photoUrl } as Doctor : d));
    } else {
      const newDoctor: Doctor = {
        ...(formData as Doctor),
        photo: photoUrl,
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

  const generateReport = () => {
    const headers = ['ID', 'Name', 'Department', 'Experience (Years)', 'Availability'];
    const rows = filteredDoctors.map(d => [
      String(d.id), d.name, d.department, String(d.experience), d.availability.join(', ')
    ]);
    return { headers, rows };
  };

  const handlePrintReport = () => {
    const { headers, rows } = generateReport();
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Doctor Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #667eea; margin-bottom: 5px; }
          .header p { color: #666; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #667eea; color: white; padding: 12px 8px; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Doctor Management Report</h1>
          <p>Healthcare Patient Management System (HCAPMS)</p>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>Total Doctors: ${filteredDoctors.length}</p>
        </div>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Healthcare Patient Management System (HCAPMS)</p>
        </div>
        <button onclick="window.print()" class="no-print" style="position:fixed;top:20px;right:20px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:5px;cursor:pointer;">
          Print Report
        </button>
      </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
    }
  };

  const handleDownloadReport = () => {
    const { headers, rows } = generateReport();
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Doctor Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #667eea; margin-bottom: 5px; }
          .header p { color: #666; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #667eea; color: white; padding: 12px 8px; text-align: left; }
          td { padding: 8px; border: 1px solid #ddd; }
          tr:nth-child(even) { background: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Doctor Management Report</h1>
          <p>Healthcare Patient Management System (HCAPMS)</p>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>Total Doctors: ${filteredDoctors.length}</p>
        </div>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Healthcare Patient Management System (HCAPMS)</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Doctor_Report_${new Date().toISOString().split('T')[0]}.html`;
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
            Doctor Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrintReport}
            sx={{ borderColor: '#667eea', color: '#667eea' }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadReport}
            sx={{ borderColor: '#667eea', color: '#667eea' }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            startIcon={<MedicalServices />}
            onClick={() => handleOpenDialog()}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Add Doctor
          </Button>
        </Box>
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
          paginationMode="client"
          rowCount={filteredDoctors.length}
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
            <FileUpload
              onFileSelect={setPhotoFile}
              acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
              maxSizeMB={2}
              label="Doctor Photo"
              currentValue={formData.photo}
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