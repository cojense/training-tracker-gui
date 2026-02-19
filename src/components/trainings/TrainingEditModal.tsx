import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  Modal,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Training } from '~/types/training';
import { TrainingService } from '~/services/TrainingService';
import { useForm, Controller } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  borderRadius: '12px',
  bgcolor: 'background.paper',
  border: 2, borderColor: 'divider',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface TrainingFormInput {
  date: string;
  title: string;
  description: string;
  url: string;
}

interface TrainingEditModalProps {
  training: Training | null;
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export const TrainingEditModal = ({
  training,
  open,
  onClose,
  onSaveSuccess,
}: TrainingEditModalProps) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TrainingFormInput>();

  const fetchTraining = useCallback(async () => {
    if (!training) return;
    try {
      setLoading(true);
      const data = await TrainingService.getTraining(training.id);
      reset({
        date: data.date ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        url: data.url ?? '',
      });
    } catch (error) {
      console.error('Failed to fetch training:', error);
      showNotification('Could not load training details.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [training, reset, showNotification, onClose]);

  useEffect(() => {
    if (open && training) {
      void fetchTraining();
    }
  }, [open, training, fetchTraining]);

  const onSubmit = useCallback(
    async (data: TrainingFormInput) => {
      if (!training) return;
      try {
        await TrainingService.updateTraining(training.id, data);
        showNotification('Training course updated successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to update training:', error);
        showNotification('Failed to update training.', 'error');
      }
    },
    [training, onClose, showNotification, onSaveSuccess]
  );

  const handleDelete = useCallback(async () => {
    if (!training) return;
    try {
      await TrainingService.deleteTraining(training.id);
      showNotification('Training course deleted.', 'success');
      setDeleteDialogOpen(false);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete training:', error);
      showNotification('Failed to delete training.', 'error');
    }
  }, [training, showNotification, onClose, onSaveSuccess]);

  const handleOpenDelete = useCallback(() => setDeleteDialogOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteDialogOpen(false), []);

  if (!training) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Edit Training
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
              <Stack spacing={3}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Date is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Title is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="External URL (Optional)"
                      fullWidth
                      placeholder="https://example.com"
                    />
                  )}
                />

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    color="error"
                    onClick={handleOpenDelete}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Training?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this training course? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={() => void handleDelete()} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
