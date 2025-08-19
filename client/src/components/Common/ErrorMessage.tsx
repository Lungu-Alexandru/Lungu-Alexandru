import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Typography 
} from '@mui/material';
import { 
  Error as ErrorIcon, 
  Refresh as RefreshIcon 
} from '@mui/icons-material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  severity?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  fullWidth?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'A apărut o eroare',
  message,
  onRetry,
  retryLabel = 'Încearcă din nou',
  variant = 'standard',
  severity = 'error',
  showIcon = true,
  fullWidth = true,
}) => {
  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        maxWidth: '600px',
        margin: fullWidth ? '0 auto' : 'initial',
      }}
    >
      <Alert 
        severity={severity}
        variant={variant}
        icon={showIcon ? <ErrorIcon /> : false}
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>
          {title}
        </AlertTitle>
        
        <Typography variant="body2" sx={{ mb: onRetry ? 2 : 0 }}>
          {message}
        </Typography>

        {onRetry && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{
              mt: 1,
              borderColor: severity === 'error' ? 'error.main' : 'primary.main',
              color: severity === 'error' ? 'error.main' : 'primary.main',
              '&:hover': {
                backgroundColor: severity === 'error' 
                  ? 'rgba(211, 47, 47, 0.04)' 
                  : 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            {retryLabel}
          </Button>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;