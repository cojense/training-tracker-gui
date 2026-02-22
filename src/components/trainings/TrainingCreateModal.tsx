import { useCallback, useMemo } from 'react';
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
  actionButtons: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
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

interface TrainingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export const TrainingCreateModal = ({
  open,
  onClose,
  onSaveSuccess,
}: TrainingCreateModalProps) => {
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Typography variant="h6" gutterBottom>
          Create New Training
        </Typography>
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
            <Controller name="url" control={control} render={renderUrlField} />

            <Box sx={styles.actionButtons}>
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
