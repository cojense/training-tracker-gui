import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import { useState, useCallback } from 'react';
import { Training } from '~/types/training';

interface TrainingDetailsModalProps {
  open: boolean;
  training: Training;
  onClose: () => void;
}
export const TrainingDetailsModal = ({
  open,
  training,
  onClose,
}: TrainingDetailsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Training Detail for {training.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          <strong>Description:</strong> {training.description}
        </Typography>
        <Typography variant="body2">
          <strong>Duration:</strong> {training.date}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export const TrainingDetailsModalButton = ({
  training,
}: {
  training: Training;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button variant="text" onClick={handleOpen}>
        {training.title}
      </Button>

      <TrainingDetailsModal
        open={open}
        training={training}
        onClose={handleClose}
      />
    </>
  );
};
