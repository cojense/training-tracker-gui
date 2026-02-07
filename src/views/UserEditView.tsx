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
  Switch,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '~/types/user';

interface UserFormInput {
  first_name: string;
  last_name: string;
  email: string;
  supervisor_id: string | number;
  is_active: boolean;
}

export const UserEditView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInput>();

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const userData = await api.getUser(id);
      const allUsersData = await api.getUsers();

      setUsers(allUsersData);
      reset({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        supervisor_id: userData.supervisor_id ?? '',
        is_active: userData.is_active,
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      showNotification('Could not load user details.', 'error');
      void navigate('/users');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showNotification, navigate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = async (data: UserFormInput) => {
    if (!id) return;
    try {
      await api.updateUser(id, data);
      showNotification('User profile updated successfully!', 'success');
      void navigate('/users');
    } catch (error) {
      console.error('Failed to update user:', error);
      showNotification('Failed to update user profile.', 'error');
    }
  };

  const handleCancel = useCallback(() => {
    void navigate('/users');
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
        Edit User Profile
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
                name="first_name"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                )}
              />

              <Controller
                name="last_name"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="supervisor_id"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Supervisor" fullWidth>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.last_name}, {u.first_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Active Status"
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
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
