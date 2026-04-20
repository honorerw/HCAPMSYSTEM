import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Chip, InputAdornment
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, PersonAdd, ArrowBack, Print, Download } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyPatients, type Patient } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';
import { FileUpload } from '../components/FileUpload';

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.nationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData(patient);
      setPhotoFile(null);
    } else {
      setEditingPatient(null);
      setFormData({
        name: '', dob: '', nationalId: '', phone: '', email: '',
        address: '', allergies: '', chronicConditions: ''
      });
      setPhotoFile(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPatient(null);
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
    
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...p, ...formData, photo: photoUrl } as Patient : p));
    } else {
      const newPatient: Patient = {
        ...(formData as Patient),
        photo: photoUrl,
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

  const generateReport = () => {
    const headers = ['ID', 'Name', 'National ID', 'Phone', 'Email', 'Date of Birth', 'Allergies', 'Chronic Conditions'];
    const rows = filteredPatients.map(p => [
      String(p.id), p.name, p.nationalId, p.phone, p.email, p.dob, p.allergies || '-', p.chronicConditions || '-'
    ]);
    return { headers, rows };
  };

  const handlePrintReport = () => {
    const { headers, rows } = generateReport();
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Report</title>
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
          <h1>Patient Management Report</h1>
          <p>Healthcare Patient Management System (HCAPMS)</p>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>Total Patients: ${filteredPatients.length}</p>
        </div>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>This report contains confidential patient information.</p>
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
        <title>Patient Report</title>
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
          <h1>Patient Management Report</h1>
          <p>Healthcare Patient Management System (HCAPMS)</p>
          <p>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p>Total Patients: ${filteredPatients.length}</p>
        </div>
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>This report contains confidential patient information.</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Patient_Report_${new Date().toISOString().split('T')[0]}.html`;
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
            Patient Management
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
            startIcon={<PersonAdd />}
            onClick={() => handleOpenDialog()}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Add Patient
          </Button>
        </Box>
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
          paginationMode="client"
          rowCount={filteredPatients.length}
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
            <FileUpload
              onFileSelect={setPhotoFile}
              acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
              maxSizeMB={2}
              label="Patient Photo"
              currentValue={formData.photo}
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