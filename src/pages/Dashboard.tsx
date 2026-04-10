import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Paper,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  People, MedicalServices, CalendarToday, Description
} from '@mui/icons-material';
import { dummyPatients, dummyDoctors, dummyAppointments } from '../data/dummyData';
import { useThemeContext } from '../contexts/ThemeContext';

const COLORS = ['#667eea', '#764ba2', '#4caf50', '#ff9800', '#f44336'];

const Dashboard: React.FC = () => {
  const { isDarkMode } = useThemeContext();
  const [timeRange, setTimeRange] = useState('week');

  const totalPatients = dummyPatients.length;
  const totalDoctors = dummyDoctors.length;
  const totalAppointments = dummyAppointments.length;
  const confirmedAppointments = dummyAppointments.filter(a => a.status === 'Confirmed').length;
  const pendingAppointments = dummyAppointments.filter(a => a.status === 'Pending').length;

  const monthlyData = [
    { month: 'Jan', patients: 45, appointments: 120 },
    { month: 'Feb', patients: 52, appointments: 135 },
    { month: 'Mar', patients: 48, appointments: 142 },
    { month: 'Apr', patients: 61, appointments: 158 },
    { month: 'May', patients: 55, appointments: 149 },
    { month: 'Jun', patients: 67, appointments: 172 }
  ];

  const appointmentStatusData = [
    { name: 'Confirmed', value: confirmedAppointments },
    { name: 'Pending', value: pendingAppointments },
    { name: 'Cancelled', value: totalAppointments - confirmedAppointments - pendingAppointments }
  ];

  const departmentData = dummyDoctors.map(d => ({
    name: d.department,
    doctors: 1
  }));

  const weeklyData = [
    { day: 'Mon', appointments: 12, patients: 8 },
    { day: 'Tue', appointments: 18, patients: 14 },
    { day: 'Wed', appointments: 15, patients: 10 },
    { day: 'Thu', appointments: 20, patients: 16 },
    { day: 'Fri', appointments: 14, patients: 9 },
    { day: 'Sat', appointments: 8, patients: 6 },
    { day: 'Sun', appointments: 3, patients: 2 }
  ];

  const statsCards = [
    { title: 'Total Patients', value: totalPatients, icon: <People />, color: '#667eea', change: '+12%' },
    { title: 'Total Doctors', value: totalDoctors, icon: <MedicalServices />, color: '#764ba2', change: '+5%' },
    { title: 'Appointments', value: totalAppointments, icon: <CalendarToday />, color: '#4caf50', change: '+8%' },
    { title: 'Pending', value: pendingAppointments, icon: <Description />, color: '#ff9800', change: '-3%' }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        {statsCards.map((stat) => (
          <Box key={stat.title} sx={{ flex: '1 1 200px' }}>
            <Card sx={{ borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: stat.change.startsWith('+') ? '#4caf50' : '#f44336', fontWeight: 600 }}
                  >
                    {stat.change} from last month
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${stat.color}33, ${stat.color}66)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: stat.color
                  }}
                >
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Appointments & Patients Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3d3d3d' : '#e0e0e0'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#888' : '#666'} />
                <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : '#e0e0e0'}`,
                    borderRadius: 8
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#667eea"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                  name="Patients"
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#764ba2"
                  fillOpacity={1}
                  fill="url(#colorAppointments)"
                  name="Appointments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Appointment Status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : '#e0e0e0'}`,
                    borderRadius: 8
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 400px' }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Weekly Activity
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3d3d3d' : '#e0e0e0'} />
                <XAxis dataKey="day" stroke={isDarkMode ? '#888' : '#666'} />
                <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : '#e0e0e0'}`,
                    borderRadius: 8
                  }}
                />
                <Legend />
                <Bar dataKey="appointments" fill="#667eea" name="Appointments" radius={[4, 4, 0, 0]} />
                <Bar dataKey="patients" fill="#764ba2" name="Patients" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 400px' }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Doctors by Department
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3d3d3d' : '#e0e0e0'} />
                <XAxis type="number" stroke={isDarkMode ? '#888' : '#666'} />
                <YAxis type="category" dataKey="name" stroke={isDarkMode ? '#888' : '#666'} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : '#e0e0e0'}`,
                    borderRadius: 8
                  }}
                />
                <Bar dataKey="doctors" fill="#4caf50" name="Doctors" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;