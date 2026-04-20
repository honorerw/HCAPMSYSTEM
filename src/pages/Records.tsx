import React, { useState } from 'react';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Paper, Card, CardContent,
  Chip, FormControl, InputLabel, Select, MenuItem, Tab, Tabs, InputAdornment
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Search, Description, ArrowBack, Print, Download } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dummyPatients, dummyDoctors } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';
import { FileUpload } from '../components/FileUpload';

interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  date: string;
  type: 'Consultation' | 'Lab Result' | 'Prescription' | 'Imaging' | 'Follow-up';
  diagnosis: string;
  notes: string;
  document?: string;
}

const initialRecords: MedicalRecord[] = [
  { id: 1, patientId: 1, doctorId: 1, date: '2024-10-15', type: 'Consultation', diagnosis: 'Hypertension', notes: 'Patient complained of headaches' },
  { id: 2, patientId: 2, doctorId: 2, date: '2024-10-16', type: 'Follow-up', diagnosis: 'Diabetes check', notes: 'Blood sugar levels normal' },
  { id: 3, patientId: 3, doctorId: 3, date: '2024-10-17', type: 'Lab Result', diagnosis: 'Blood test results', notes: 'All parameters within range' },
  { id: 4, patientId: 4, doctorId: 1, date: '2024-10-18', type: 'Prescription', diagnosis: 'Seasonal allergies', notes: 'Prescribed antihistamines' },
  { id: 5, patientId: 5, doctorId: 4, date: '2024-10-19', type: 'Consultation', diagnosis: 'Prenatal checkup', notes: 'Everything normal' },
  { id: 6, patientId: 6, doctorId: 2, date: '2024-10-20', type: 'Imaging', diagnosis: 'Chest X-ray', notes: 'No abnormalities found' },
  { id: 7, patientId: 7, doctorId: 5, date: '2024-10-21', type: 'Follow-up', diagnosis: 'Post-surgery check', notes: 'Healing well' },
  { id: 8, patientId: 8, doctorId: 1, date: '2024-10-22', type: 'Consultation', diagnosis: 'Annual physical', notes: 'Patient in good health' },
];

const Records: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useThemeContext();

  const getBackPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };

  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});
  const [currentTab, setCurrentTab] = useState(0);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const getPatientName = (id: number) => dummyPatients.find(p => p.id === id)?.name || 'Unknown';
  const getDoctorName = (id: number) => dummyDoctors.find(d => d.id === id)?.name || 'Unknown';

  const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    Consultation: 'primary',
    'Lab Result': 'info',
    Prescription: 'warning',
    Imaging: 'error',
    'Follow-up': 'success'
  };

  const filteredRecords = records.filter(record => {
    const patientName = getPatientName(record.patientId).toLowerCase();
    const diagnosis = record.diagnosis.toLowerCase();
    return patientName.includes(searchQuery.toLowerCase()) ||
           diagnosis.includes(searchQuery.toLowerCase()) ||
           record.date.includes(searchQuery);
  });

  const handleOpenDialog = (record?: MedicalRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
      setDocumentFile(null);
    } else {
      setEditingRecord(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({ patientId: 0, doctorId: 0, date: today, type: 'Consultation', diagnosis: '', notes: '' });
      setDocumentFile(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
    setFormData({});
  };

  const handleSaveRecord = async () => {
    let documentUrl = formData.document;
    if (documentFile) {
      documentUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(documentFile);
      });
    }
    
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...formData, document: documentUrl } as MedicalRecord : r));
    } else {
      const newRecord: MedicalRecord = {
        ...(formData as MedicalRecord),
        document: documentUrl,
        id: Date.now(),
      };
      setRecords([...records, newRecord]);
    }
    handleCloseDialog();
  };

  const handleDeleteRecord = (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const handleViewRecord = (record: MedicalRecord) => {
    setViewRecord(record);
    setOpenViewDialog(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const tabCounts = [
    records.length,
    records.filter(r => r.type === 'Consultation').length,
    records.filter(r => r.type === 'Lab Result').length,
    records.filter(r => r.type === 'Prescription').length,
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 110 },
    { 
      field: 'patientId', 
      headerName: 'Patient', 
      flex: 1, 
      minWidth: 140,
      valueGetter: (value) => getPatientName(value as number)
    },
    { 
      field: 'doctorId', 
      headerName: 'Doctor', 
      flex: 1, 
      minWidth: 140,
      valueGetter: (value) => getDoctorName(value as number)
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" color={typeColors[params.value as string] || 'default'} variant="outlined" />
      )
    },
    { field: 'diagnosis', headerName: 'Diagnosis', flex: 1, minWidth: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton size="small" onClick={() => handleViewRecord(params.row)}>
            <Description fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDeleteRecord(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ];

  const generateReport = () => {
    const headers = ['ID', 'Date', 'Patient', 'Doctor', 'Type', 'Diagnosis', 'Notes'];
    const rows = filteredRecords.map(r => [
      String(r.id), r.date, getPatientName(r.patientId), getDoctorName(r.doctorId), r.type, r.diagnosis, r.notes || '-'
    ]);
    return { headers, rows };
  };

  const handlePrintReport = () => {
    const { headers, rows } = generateReport();
    const content = `<!DOCTYPE html><html><head><title>Medical Records Report</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{text-align:center;margin-bottom:30px}.header h1{color:#667eea;margin-bottom:5px}.header p{color:#666;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#667eea;color:white;padding:12px 8px;text-align:left}td{padding:8px;border:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:30px;text-align:center;font-size:12px;color:#666}@media print{.no-print{display:none}}</style></head><body><div class="header"><h1>Medical Records Report</h1><p>Healthcare Patient Management System (HCAPMS)</p><p>Generated:${new Date().toLocaleDateString()}</p><p>Total Records:${filteredRecords.length}</p></div><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="footer"><p>CONFIDENTIAL - Healthcare Patient Management System</p></div><button onclick="window.print()" class="no-print" style="position:fixed;top:20px;right:20px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:5px;cursor:pointer">Print</button></body></html>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) { printWindow.document.write(content); printWindow.document.close(); printWindow.focus(); }
  };

  const handleDownloadReport = () => {
    const { headers, rows } = generateReport();
    const content = `<!DOCTYPE html><html><head><title>Medical Records Report</title><style>body{font-family:Arial,sans-serif;margin:20px}.header{text-align:center;margin-bottom:30px}.header h1{color:#667eea;margin-bottom:5px}.header p{color:#666;margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#667eea;color:white;padding:12px 8px;text-align:left}td{padding:8px;border:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}.footer{margin-top:30px;text-align:center;font-size:12px;color:#666}</style></head><body><div class="header"><h1>Medical Records Report</h1><p>Healthcare Patient Management System (HCAPMS)</p><p>Generated:${new Date().toLocaleDateString()}</p><p>Total Records:${filteredRecords.length}</p></div><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="footer"><p>CONFIDENTIAL - Healthcare Patient Management System</p></div></body></html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Medical_Records_Report_${new Date().toISOString().split('T')[0]}.html`;
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
            Medical Records
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Print />} onClick={handlePrintReport} sx={{ borderColor: '#667eea', color: '#667eea' }}>Print</Button>
          <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadReport} sx={{ borderColor: '#667eea', color: '#667eea' }}>Download</Button>
          <Button variant="contained" startIcon={<Description />} onClick={() => handleOpenDialog()} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            New Record
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: '#667eea20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea' }}>
              <Description />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{records.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Records</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: '#4caf5020', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4caf50' }}>
              <Description />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{tabCounts[1]}</Typography>
              <Typography variant="body2" color="text.secondary">Consultations</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, background: '#ff980020', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9800' }}>
              <Description />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{tabCounts[3]}</Typography>
              <Typography variant="body2" color="text.secondary">Prescriptions</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${tabCounts[0]})`} />
          <Tab label={`Consultation (${tabCounts[1]})`} />
          <Tab label={`Lab Result (${tabCounts[2]})`} />
          <Tab label={`Prescription (${tabCounts[3]})`} />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search records by patient name, diagnosis, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Paper>

      <Paper sx={{ height: 600, width: '100%', borderRadius: 2 }}>
        <DataGrid
          rows={filteredRecords}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          pagination
          paginationMode="client"
          rowCount={filteredRecords.length}
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
          {editingRecord ? 'Edit Record' : 'Add New Record'}
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
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
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
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type || ''}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MedicalRecord['type'] })}
              >
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Lab Result">Lab Result</MenuItem>
                <MenuItem value="Prescription">Prescription</MenuItem>
                <MenuItem value="Imaging">Imaging</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Diagnosis"
              fullWidth
              value={formData.diagnosis || ''}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <FileUpload
              onFileSelect={setDocumentFile}
              acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']}
              maxSizeMB={5}
              label="Upload Document"
              currentValue={formData.document}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveRecord} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Record Details</DialogTitle>
        <DialogContent>
          {viewRecord && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Description sx={{ fontSize: 40, color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Patient</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{getPatientName(viewRecord.patientId)}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Doctor</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{getDoctorName(viewRecord.doctorId)}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewRecord.date}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Chip label={viewRecord.type} size="small" color={typeColors[viewRecord.type] || 'default'} variant="outlined" />
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Diagnosis</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewRecord.diagnosis}</Typography>
              </Box>
              <Box sx={{ p: 2, borderRadius: 1, bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">Notes</Typography>
                <Typography variant="body1">{viewRecord.notes}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Records;