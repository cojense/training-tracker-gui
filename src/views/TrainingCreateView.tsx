import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Training } from '~/types/training';

interface TrainingFormInput {
  date: string;
  title: string;
  description: string;
  url: string;
}

export const TrainingCreateView: React.FC = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainingFormInput>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      url: '',
    },
  });

  const onSubmit = async (data: TrainingFormInput) => {
    try {
      const newTraining: Partial<Training> = {
        ...data,
        id: undefined, // Let the backend generate the ID
      };
      await api.createTraining(newTraining);
      showNotification('Training course created successfully!', 'success');
      void navigate('/trainings');
    } catch (error) {
      console.error('Failed to create training:', error);
      showNotification(
        'Failed to create training. Please check your input.',
        'error'
      );
    }
  };

  const handleCancel = useCallback(() => {
    void navigate('/trainings');
  }, [navigate]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Training
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

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  Create Training
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
