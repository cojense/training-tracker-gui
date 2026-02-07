import { useEffect, useState, useCallback } from 'react';
import {
  useForm,
  Controller,
  Control,
  ControllerRenderProps,
} from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
  buttonContainer: { display: 'flex', gap: 2, justifyContent: 'space-between' },
  rightButtons: { display: 'flex', gap: 2 },
};

const dateRules = { required: 'Date is required' };
const titleRules = { required: 'Title is required' };
const descriptionRules = { required: 'Description is required' };
const shrinkLabel = { shrink: true };

interface TrainingFormInput {
  date: string;
  title: string;
  description: string;
  url: string;
}

/**
 * Stable Render Functions
 */
const renderDateField = ({
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
    InputLabelProps={shrinkLabel}
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderTitleField = ({
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
);

const renderDescriptionField = ({
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
);

const renderUrlField = ({
  field,
}: {
  field: ControllerRenderProps<TrainingFormInput, 'url'>;
}) => (
  <TextField
    {...field}
    label="External URL (Optional)"
    fullWidth
    placeholder="https://example.com"
  />
);

/**
 * Controller Wrappers
 */
const DateController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="date"
    control={control}
    rules={dateRules}
    render={renderDateField}
  />
);

const TitleController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="title"
    control={control}
    rules={titleRules}
    render={renderTitleField}
  />
);

const DescriptionController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="description"
    control={control}
    rules={descriptionRules}
    render={renderDescriptionField}
  />
);

const UrlController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => <Controller name="url" control={control} render={renderUrlField} />;

export const TrainingEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TrainingFormInput>();

  const fetchTraining = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getTraining(id);
      reset({
        date: data.date ?? '',
        title: data.title ?? '',
        description: data.description ?? '',
        url: data.url ?? '',
      });
    } catch (error) {
      console.error('Failed to fetch training:', error);
      showNotification('Could not load training details.', 'error');
      void navigate('/trainings');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showNotification, navigate]);

  useEffect(() => {
    void fetchTraining();
  }, [fetchTraining]);

  const onSubmit = useCallback(
    async (data: TrainingFormInput) => {
      if (!id) return;
      try {
        await api.updateTraining(id, data);
        showNotification('Training course updated successfully!', 'success');
        void navigate('/trainings');
      } catch (error) {
        console.error('Failed to update training:', error);
        showNotification('Failed to update training.', 'error');
      }
    },
    [id, navigate, showNotification]
  );

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await api.deleteTraining(id);
      showNotification('Training course deleted.', 'success');
      setDeleteDialogOpen(false);
      void navigate('/trainings');
    } catch (error) {
      console.error('Failed to delete training:', error);
      showNotification('Failed to delete training.', 'error');
    }
  }, [id, showNotification, navigate]);

  const handleCancel = useCallback(() => {
    void navigate('/trainings');
  }, [navigate]);

  const handleOpenDelete = useCallback(() => setDeleteDialogOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteDialogOpen(false), []);

  const handleConfirmDelete = useCallback(() => {
    void handleDelete();
  }, [handleDelete]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Edit Training
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              <DateController control={control} />
              <TitleController control={control} />
              <DescriptionController control={control} />
              <UrlController control={control} />

              <Box sx={styles.buttonContainer}>
                <Button
                  color="error"
                  onClick={handleOpenDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
                <Box sx={styles.rightButtons}>
                  <Button onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
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
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
