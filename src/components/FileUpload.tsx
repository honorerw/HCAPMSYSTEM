import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, Paper, Alert } from '@mui/material';
import { CloudUpload, Close, PictureAsPdf } from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
  currentValue?: string | null;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const DEFAULT_MAX_SIZE_MB = 5;

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  label = 'Upload File',
  currentValue
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const getAcceptedString = () => acceptedTypes.join(',');

  const isPDF = (type: string) => type === 'application/pdf';
  const isImage = (type: string) => ALLOWED_IMAGE_TYPES.includes(type);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.map(t => {
        if (t === 'application/pdf') return 'PDF';
        if (t === 'image/jpeg' || t === 'image/jpg') return 'JPG';
        if (t === 'image/png') return 'PNG';
        return t;
      }).join(', ')}`;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onFileSelect(null);
      return;
    }

    setFileName(file.name);
    onFileSelect(file);

    if (isImage(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (isPDF(file.type)) {
      setPreview('pdf');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Accepted: JPG, PNG, PDF (Max: {maxSizeMB}MB)
      </Typography>

      {!preview ? (
        <Paper
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: 'divider',
            bgcolor: 'background.default',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Click to upload or drag and drop
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept={getAcceptedString()}
            onChange={handleFileChange}
          />
        </Paper>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {preview === 'pdf' ? (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover' }}>
              <PictureAsPdf sx={{ fontSize: 48, color: 'error.main' }} />
              <Typography variant="body2" sx={{ mt: 1 }}>{fileName}</Typography>
            </Paper>
          ) : (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 1,
                bgcolor: 'action.hover'
              }}
            />
          )}
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'error.main', color: 'white' }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {currentValue && !preview && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Current file stored
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
