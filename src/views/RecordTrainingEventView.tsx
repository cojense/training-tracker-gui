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
  FormControlLabel,
  Checkbox,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/utilities/useAuth';
import { User } from '~/types/user';
import { Training } from '~/types/training';

interface RecordFormInput {
  user_id: string | number;
  training_id: string | number;
  completion_date: string;
  comment: string;
  certificate_unavailable: boolean;
  certificate: FileList | null;
}

export const RecordTrainingEventView: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  // Extract initial IDs from query params if present (e.g. from Dashboard "Record" button)
  const queryParams = new URLSearchParams(location.search);
  const initialTrainingId = queryParams.get('training_id') ?? '';
  const initialUserId = queryParams.get('user_id') ?? user?.id ?? '';

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormInput>({
    defaultValues: {
      user_id: initialUserId,
      training_id: initialTrainingId,
      completion_date: new Date().toISOString().split('T')[0],
      comment: '',
      certificate_unavailable: false,
      certificate: null,
    },
  });

  const watchCertUnavailable = watch('certificate_unavailable');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [trainingsData, usersData] = await Promise.all([
        api.getTrainings(),
        isManager ? api.getUsers() : Promise.resolve([]),
      ]);
      setTrainings(trainingsData);
      if (isManager) setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
      showNotification('Could not load required data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [isManager, showNotification]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = async (data: RecordFormInput) => {
    try {
      const formData = new FormData();
      formData.append('user_id', String(data.user_id));
      formData.append('training_id', String(data.training_id));
      formData.append('completion_date', data.completion_date);
      formData.append('comment', data.comment);
      formData.append(
        'certificate_unavailable',
        String(data.certificate_unavailable)
      );

      if (data.certificate && data.certificate.length > 0) {
        formData.append('certificate', data.certificate[0]);
      }

      await api.createEvent(formData);
      showNotification('Training record saved successfully!', 'success');
      void navigate('/');
    } catch (error) {
      console.error('Failed to record training:', error);
      showNotification('Failed to save record.', 'error');
    }
  };

  const handleCancel = useCallback(() => {
    void navigate(-1);
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
        Record Training Completion
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
          >
            <Stack spacing={3}>
              {isManager && (
                <Controller
                  name="user_id"
                  control={control}
                  rules={{ required: 'Member is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Member"
                      fullWidth
                      error={!!errors.user_id}
                      helperText={errors.user_id?.message}
                    >
                      {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.last_name}, {u.first_name} ({u.email})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              )}

              <Controller
                name="training_id"
                control={control}
                rules={{ required: 'Training is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Training Course"
                    fullWidth
                    error={!!errors.training_id}
                    helperText={errors.training_id?.message}
                  >
                    {trainings.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="completion_date"
                control={control}
                rules={{ required: 'Completion date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Completion Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.completion_date}
                    helperText={errors.completion_date?.message}
                  />
                )}
              />

              <Controller
                name="certificate_unavailable"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Certificate Unavailable"
                  />
                )}
              />

              {!watchCertUnavailable && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Upload Certificate (PDF or Image)
                  </Typography>
                  <Controller
                    name="certificate"
                    control={control}
                    render={({ field: { onChange, ...fieldProps } }) => (
                      <input
                        {...fieldProps}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => onChange(e.target.files)}
                      />
                    )}
                  />
                </Box>
              )}

              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Comments"
                    fullWidth
                    multiline
                    rows={3}
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
                  Save Record
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
