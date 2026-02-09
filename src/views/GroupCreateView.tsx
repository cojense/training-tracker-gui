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
} from '@mui/material';
import { GroupService } from '~/services/GroupService';
import { useNotification } from '~/hooks/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface GroupFormInput {
  name: string;
  is_admin: boolean;
  is_training_manager: boolean;
}

export const GroupCreateView = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormInput>({
    defaultValues: {
      name: '',
      is_admin: false,
      is_training_manager: false,
    },
  });

  const onSubmit = async (data: GroupFormInput) => {
    try {
      await GroupService.createGroup(data);
      showNotification('Group created successfully!', 'success');
      void navigate('/groups');
    } catch (error) {
      console.error('Failed to create group:', error);
      showNotification('Failed to create group.', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Group
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
                name="name"
                control={control}
                rules={{ required: 'Group name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Group Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="is_admin"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Is Admin Group"
                  />
                )}
              />

              <Controller
                name="is_training_manager"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Is Training Manager Group"
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate(-1)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  Create Group
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
