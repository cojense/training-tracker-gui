import {
  useState,
  useCallback,
  ReactNode,
  useMemo,
  SyntheticEvent,
} from 'react';
import { Snackbar, Alert, AlertColor, SnackbarOrigin } from '@mui/material';
import { NotificationContext } from './useNotification';

const anchorOrigin: SnackbarOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const alertStyles = { width: '100%' };

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const showNotification = useCallback(
    (msg: string, sev: AlertColor = 'success') => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
    },
    []
  );

  const handleClose = useCallback(
    (_?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    },
    []
  );

  const contextValue = useMemo(
    () => ({ showNotification }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={alertStyles}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
