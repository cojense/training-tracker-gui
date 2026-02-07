import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

interface TrainingFormInput {
  date: string;
  title: string;
  description: string;
  url: string;
}

export const TrainingEditView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const onSubmit = async (data: TrainingFormInput) => {
    if (!id) return;
    try {
      await api.updateTraining(id, data);
      showNotification('Training course updated successfully!', 'success');
      void navigate('/trainings');
    } catch (error) {
      console.error('Failed to update training:', error);
      showNotification('Failed to update training.', 'error');
    }
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Training
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
          >
            <Stack spacing={3}>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                )}
              />

              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
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
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Training?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this training course? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              void handleDelete();
            }}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
