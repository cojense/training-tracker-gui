import { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Modal,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { ProjectService } from '~/services/ProjectService';
import { useNotification } from '~/hooks/useNotification';
import { Project } from '~/types/projects';
import { ProjectFormInput } from './ProjectCreateModal';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    border: 2, borderColor: 'divider',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  centeredBox: { textAlign: 'center', py: 4 },
  spaceBetween: {
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
  },
};

interface ProjectEditModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSaveSuccess: () => void;
}

export const ProjectEditModal = ({
  open,
  onClose,
  project,
  onSaveSuccess,
}: ProjectEditModalProps) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>();

  const fetchProject = useCallback(async () => {
    if (!project) return;
    try {
      setLoading(true);
      const data = await ProjectService.getProject(String(project.id));
      reset({
        name: data.name ?? '',
      });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      showNotification('Could not load project details.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [project, reset, showNotification, onClose]);

  useEffect(() => {
    if (open) {
      void fetchProject();
    }
  }, [open, fetchProject]);

  const onSubmit = useCallback(
    async (data: ProjectFormInput) => {
      if (!project) return;
      try {
        await ProjectService.updateProject(String(project.id), data);
        showNotification('Project updated successfully!', 'success');
        onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to update project:', error);
        showNotification('Failed to update project.', 'error');
      }
    },
    [project, onClose, onSaveSuccess, showNotification]
  );

  const handleDelete = useCallback(async () => {
    if (!project) return;
    try {
      await ProjectService.deleteProject(String(project.id));
      showNotification('Project deleted.', 'success');
      setDeleteDialogOpen(false);
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
      showNotification('Failed to delete project.', 'error');
    }
  }, [project, showNotification, onSaveSuccess, onClose]);

  const handleOpenDelete = useCallback(() => setDeleteDialogOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteDialogOpen(false), []);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={styles.modal}>
          <Typography variant="h6" gutterBottom>
            Edit Project
          </Typography>
          {loading ? (
            <Box sx={styles.centeredBox}>
              <CircularProgress />
            </Box>
          ) : (
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

                <Box sx={styles.spaceBetween}>
                  <Button
                    color="error"
                    onClick={handleOpenDelete}
                    disabled={isSubmitting}
                  >
                    Delete Project
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
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
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete Project?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this project? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
