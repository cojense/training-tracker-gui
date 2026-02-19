import { useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Modal,
  Stack,
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

interface TrainingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export const TrainingCreateModal = ({ open, onClose, onSaveSuccess }: TrainingCreateModalProps) => {
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<TrainingFormInput>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      url: '',
    },
  });

  const onSubmit = useCallback(
    async (data: TrainingFormInput) => {
      try {
        const newTraining: Partial<Training> = {
          ...data,
          id: undefined,
        };
        await TrainingService.createTraining(newTraining);
        showNotification('Training course created successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
        reset();
      } catch (error) {
        console.error('Failed to create training:', error);
        showNotification(
          'Failed to create training. Please check your input.',
          'error'
        );
      }
    },
    [onClose, showNotification, reset, onSaveSuccess]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Create New Training
        </Typography>
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

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Create Training
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
