/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { Print, Download } from '@mui/icons-material';

interface ReportHeader {
  title: string;
  subtitle?: string;
  date?: string;
}

interface ReportColumn {
  header: string;
  key: string;
  width?: string;
}

interface ReportProps {
  data: Record<string, unknown>[];
  columns: ReportColumn[];
  header: ReportHeader;
  onPrint: () => void;
  onDownload: () => void;
}

export const Report: React.FC<ReportProps> = ({ data, columns, header, onPrint, onDownload }) => {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{header.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={onDownload} color="primary" title="Download PDF">
            <Download />
          </IconButton>
          <IconButton onClick={onPrint} color="primary" title="Print">
            <Print />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">{header.title}</Typography>
        {header.subtitle && <Typography variant="body2" color="text.secondary">{header.subtitle}</Typography>}
        <Typography variant="caption" color="text.secondary">
          Generated on: {header.date || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}
        </Typography>
      </Box>

      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: '#667eea', color: 'white' }}>
                {columns.map((col) => (
                  <Box
                    component="th"
                    key={col.key}
                    sx={{ p: 1.5, textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap', width: col.width }}
                  >
                    {col.header}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {data.length === 0 ? (
                <Box component="tr">
                  <Box component="td" colSpan={columns.length} sx={{ p: 3, textAlign: 'center' }}>
                    No data available
                  </Box>
                </Box>
              ) : (
                data.map((row, index) => (
                  <Box
                    component="tr"
                    key={index}
                    sx={{ '&:nth-of-type(even)': { bgcolor: 'action.hover' } }}
                  >
                    {columns.map((col) => (
                      <Box component="td" key={col.key} sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                        {formatValue(row[col.key])}
                      </Box>
                    ))}
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Total Records: {data.length}
        </Typography>
      </Box>
    </Box>
  );
};

export const generatePrintContent = (
  title: string,
  subtitle: string,
  headers: string[],
  rows: string[][],
  dateRange?: string
): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const tableRows = rows.map(row => `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
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
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <p>Generated: ${currentDate}${dateRange ? ` | Period: ${dateRange}` : ''}</p>
      </div>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${rows.length}</p>
        <p>Healthcare Patient Management System (HCAPMS)</p>
      </div>
      <button onclick="window.print()" class="no-print" style="position:fixed;top:20px;right:20px;padding:10px 20px;background:#667eea;color:white;border:none;border-radius:5px;cursor:pointer;">
        Print Report
      </button>
    </body>
    </html>
  `;
};

export const openPrintWindow = (content: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
  }
};

export const downloadReport = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default Report;
