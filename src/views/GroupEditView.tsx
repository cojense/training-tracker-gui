import { useEffect, useState, useCallback } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { GroupService } from '~/services/GroupService';
import { useNotification } from '~/hooks/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';

interface GroupFormInput {
  name: string;
  is_admin: boolean;
  is_training_manager: boolean;
}

export const GroupEditView = () => {
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
  } = useForm<GroupFormInput>();

  const fetchGroup = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await GroupService.getGroup(id);
      reset({
        name: data.name,
        is_admin: data.is_admin,
        is_training_manager: data.is_training_manager,
      });
    } catch (error) {
      console.error('Failed to fetch group:', error);
      showNotification('Could not load group details.', 'error');
      void navigate('/groups');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showNotification, navigate]);

  useEffect(() => {
    void fetchGroup();
  }, [fetchGroup]);

  const onSubmit = async (data: GroupFormInput) => {
    if (!id) return;
    try {
      await GroupService.updateGroup(id, data);
      showNotification('Group updated successfully!', 'success');
      void navigate(`/groups/${id}`);
    } catch (error) {
      console.error('Failed to update group:', error);
      showNotification('Failed to update group.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await GroupService.deleteGroup(id);
      showNotification('Group deleted.', 'success');
      setDeleteDialogOpen(false);
      void navigate('/groups');
    } catch (error) {
      console.error('Failed to delete group:', error);
      showNotification('Failed to delete group.', 'error');
    }
  };

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
        Edit Group
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
                  Delete Group
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button onClick={() => navigate(-1)} disabled={isSubmitting}>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Group?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this group? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
