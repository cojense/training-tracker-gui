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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ProjectService } from '~/services/ProjectService';
import { useNotification } from '~/hooks/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';

interface ProjectFormInput {
  name: string;
}

export const ProjectEditView = () => {
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
  } = useForm<ProjectFormInput>();

  const fetchProject = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await ProjectService.getProject(id);
      reset({
        name: data.name,
      });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      showNotification('Could not load project details.', 'error');
      void navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showNotification, navigate]);

  useEffect(() => {
    void fetchProject();
  }, [fetchProject]);

  const onSubmit = async (data: ProjectFormInput) => {
    if (!id) return;
    try {
      await ProjectService.updateProject(id, data);
      showNotification('Project updated successfully!', 'success');
      void navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Failed to update project:', error);
      showNotification('Failed to update project.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await ProjectService.deleteProject(id);
      showNotification('Project deleted.', 'success');
      setDeleteDialogOpen(false);
      void navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showNotification('Failed to delete project.', 'error');
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
        Edit Project
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
                rules={{ required: 'Project name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
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
                  Delete Project
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
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this project? This
            action cannot be undone.
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
