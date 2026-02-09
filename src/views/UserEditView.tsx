import { useEffect, useState, useCallback, useMemo } from 'react';
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
  FormControlLabel,
  Switch,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { UserService } from '~/services/UserService';
import { useNotification } from '~/hooks/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '~/types/user';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  buttonContainer: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
};

const firstNameRules = { required: 'First name is required' };
const lastNameRules = { required: 'Last name is required' };
const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
};

interface UserFormInput {
  first_name: string;
  last_name: string;
  email: string;
  supervisor_id: string | number;
  is_active: boolean;
}

/**
 * Pure Render Functions (Module Scope)
 */
const renderFirstNameField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<UserFormInput, 'first_name'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="First Name"
    fullWidth
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderLastNameField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<UserFormInput, 'last_name'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="Last Name"
    fullWidth
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderEmailField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<UserFormInput, 'email'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="Email"
    fullWidth
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const ActiveStatusSwitch = ({
  field,
}: {
  field: ControllerRenderProps<UserFormInput, 'is_active'>;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e.target.checked);
    },
    [field]
  );

  return (
    <FormControlLabel
      control={<Switch checked={field.value} onChange={handleChange} />}
      label="Active Status"
    />
  );
};

const renderActiveSwitchField = ({
  field,
}: {
  field: ControllerRenderProps<UserFormInput, 'is_active'>;
}) => <ActiveStatusSwitch field={field} />;

/**
 * Controller Wrappers
 */
const FirstNameController = ({
  control,
}: {
  control: Control<UserFormInput>;
}) => (
  <Controller
    name="first_name"
    control={control}
    rules={firstNameRules}
    render={renderFirstNameField}
  />
);

const LastNameController = ({
  control,
}: {
  control: Control<UserFormInput>;
}) => (
  <Controller
    name="last_name"
    control={control}
    rules={lastNameRules}
    render={renderLastNameField}
  />
);

const EmailController = ({ control }: { control: Control<UserFormInput> }) => (
  <Controller
    name="email"
    control={control}
    rules={emailRules}
    render={renderEmailField}
  />
);

const ActiveStatusController = ({
  control,
}: {
  control: Control<UserFormInput>;
}) => (
  <Controller
    name="is_active"
    control={control}
    render={renderActiveSwitchField}
  />
);

export const UserEditView = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormInput>();

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const userData = await UserService.getUser(id);
      const allUsersData = await UserService.getUsers();

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

  const onSubmit = useCallback(
    async (data: UserFormInput) => {
      if (!id) return;
      try {
        const supervisorId = data.supervisor_id
          ? Number(data.supervisor_id)
          : undefined;
        await UserService.updateUser(id, {
          ...data,
          supervisor_id: supervisorId,
        });
        showNotification('User profile updated successfully!', 'success');
        void navigate('/users');
      } catch (error) {
        console.error('Failed to update user:', error);
        showNotification('Failed to update user profile.', 'error');
      }
    },
    [id, navigate, showNotification]
  );

  const handleCancel = useCallback(() => {
    void navigate('/users');
  }, [navigate]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  // Memoize the supervisor render function to satisfy react-perf
  const renderSupervisor = useMemo(
    () =>
      ({
        field,
      }: {
        field: ControllerRenderProps<UserFormInput, 'supervisor_id'>;
      }) => (
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
      ),
    [users]
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
        Edit User Profile
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              <FirstNameController control={control} />
              <LastNameController control={control} />
              <EmailController control={control} />

              <Controller
                name="supervisor_id"
                control={control}
                render={renderSupervisor}
              />

              <ActiveStatusController control={control} />

              <Box sx={styles.buttonContainer}>
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
