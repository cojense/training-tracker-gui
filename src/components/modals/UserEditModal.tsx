import { useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Modal,
} from '@mui/material';
import { User } from '~/types/user';
import { UserService } from '~/services/UserService';
import { useForm, Controller, Control, ControllerRenderProps } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';
import { ActiveStatusSwitch } from './shared/FormFields';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface UserFormInput {
  first_name: string;
  last_name: string;
  email: string;
  supervisor_id: string | number;
  is_active: boolean;
}

const firstNameRules = { required: 'First name is required' };
const lastNameRules = { required: 'Last name is required' };
const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
};

interface UserEditModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  users?: User[]; // Optional list of users for supervisor selection
  onSaveSuccess?: () => void;
}

export const UserEditModal = ({ user, open, onClose, users = [], onSaveSuccess }: UserEditModalProps) => {
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormInput>();

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        supervisor_id: user.supervisor_id ?? '',
        is_active: user.is_active,
      });
    }
  }, [user, reset]);

  const onSubmit = useCallback(
    async (data: UserFormInput) => {
      if (!user) return;
      try {
        const supervisorId = data.supervisor_id
          ? Number(data.supervisor_id)
          : undefined;
        await UserService.updateUser(user.id, {
          ...data,
          supervisor_id: supervisorId,
        });
        showNotification('User profile updated successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to update user:', error);
        showNotification('Failed to update user profile.', 'error');
      }
    },
    [user, onClose, showNotification, onSaveSuccess]
  );

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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit User Profile
        </Typography>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Stack spacing={3}>
            <Controller
              name="first_name"
              control={control}
              rules={firstNameRules}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              rules={lastNameRules}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={emailRules}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="supervisor_id"
              control={control}
              render={renderSupervisor}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <ActiveStatusSwitch field={field} />
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
                Save Changes
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
