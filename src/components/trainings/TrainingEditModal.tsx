import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 2,
    borderColor: 'divider',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  actionContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
  },
  buttonGroup: { display: 'flex', gap: 2 },
};

const validationRules = {
  date: { required: 'Date is required' },
  title: { required: 'Title is required' },
  description: { required: 'Description is required' },
};

const inputLabelProps = { shrink: true };

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

  const renderDateField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TrainingFormInput, 'date'>;
      fieldState: { error?: { message?: string } };
    }) => (
      <TextField
        {...field}
        label="Date"
        type="date"
        fullWidth
        InputLabelProps={inputLabelProps}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    ),
    []
  );

  const renderTitleField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TrainingFormInput, 'title'>;
      fieldState: { error?: { message?: string } };
    }) => (
      <TextField
        {...field}
        label="Title"
        fullWidth
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    ),
    []
  );

  const renderDescriptionField = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TrainingFormInput, 'description'>;
      fieldState: { error?: { message?: string } };
    }) => (
      <TextField
        {...field}
        label="Description"
        fullWidth
        multiline
        rows={4}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    ),
    []
  );

  const renderUrlField = useCallback(
    ({ field }: { field: ControllerRenderProps<TrainingFormInput, 'url'> }) => (
      <TextField
        {...field}
        label="External URL (Optional)"
        fullWidth
        placeholder="https://example.com"
      />
    ),
    []
  );

  const handleFormSubmit = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit]
  );

  if (!training) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={styles.modal}>
          <Typography variant="h6" gutterBottom>
            Edit Training
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <form onSubmit={handleFormSubmit}>
              <Stack spacing={3}>
                <Controller
                  name="date"
                  control={control}
                  rules={validationRules.date}
                  render={renderDateField}
                />
                <Controller
                  name="title"
                  control={control}
                  rules={validationRules.title}
                  render={renderTitleField}
                />
                <Controller
                  name="description"
                  control={control}
                  rules={validationRules.description}
                  render={renderDescriptionField}
                />
                <Controller
                  name="url"
                  control={control}
                  render={renderUrlField}
                />

                <Box sx={styles.actionContainer}>
                  <Button
                    color="error"
                    onClick={handleOpenDelete}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                  <Box sx={styles.buttonGroup}>
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
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
