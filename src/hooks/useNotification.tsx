import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { AlertColor } from '@mui/material';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
}
