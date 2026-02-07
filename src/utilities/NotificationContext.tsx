import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  SyntheticEvent,
} from 'react';
import { Snackbar, Alert, AlertColor, SnackbarOrigin } from '@mui/material';

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

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

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
