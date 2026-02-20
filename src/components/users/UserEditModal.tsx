import { useEffect, useCallback, useMemo } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Modal,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { User } from '~/types/user';
import { UserService } from '~/services/UserService';
import {
  useForm,
  Controller,
  ControllerRenderProps,
  FieldError,
} from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

const firstNameRules = { required: 'First name is required' };
const lastNameRules = { required: 'Last name is required' };
const emailRules = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
};

const styles = {
  saveBox: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    border: 2,
    borderColor: 'divider',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
};
const renderTextField =
  (label: string) =>
  ({
    field,
    fieldState,
  }: {
    field: ControllerRenderProps<UserFormInput, keyof UserFormInput>;
    fieldState: { error?: FieldError };
  }) => (
    <TextField
      {...field}
      label={label}
      fullWidth
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );

interface UserFormInput {
  first_name: string;
  last_name: string;
  email: string;
  supervisor_id: string | number;
  is_active: boolean;
}
const renderActiveStatusSwitch = ({
  field,
}: {
  field: ControllerRenderProps<UserFormInput, 'is_active'>;
}) => (
  <FormControlLabel
    control={<Switch {...field} checked={field.value} />}
    label="Active"
  />
);

interface UserEditModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  users?: User[]; // Optional list of users for supervisor selection
  onSaveSuccess?: () => void;
}
export const UserEditModal = ({
  user,
  open,
  onClose,
  users = [],
  onSaveSuccess,
}: UserEditModalProps) => {
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

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
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
      <Box sx={styles.modal}>
        <Typography variant="h6" gutterBottom>
          Edit User Profile
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Stack spacing={3}>
            <Controller
              name="first_name"
              control={control}
              rules={firstNameRules}
              render={renderTextField('First Name')}
            />
            <Controller
              name="last_name"
              control={control}
              rules={lastNameRules}
              render={renderTextField('Last Name')}
            />
            <Controller
              name="email"
              control={control}
              rules={emailRules}
              render={renderTextField('Email')}
            />

            <Controller
              name="supervisor_id"
              control={control}
              render={renderSupervisor}
            />

            <Controller
              name="is_active"
              control={control}
              render={renderActiveStatusSwitch}
            />

            <Box sx={styles.saveBox}>
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
