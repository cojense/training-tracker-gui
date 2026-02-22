import { createContext, useContext } from 'react';
import { AlertColor } from '@mui/material';

export interface NotificationContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
