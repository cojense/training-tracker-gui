import { useCallback } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Modal,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { ProjectService } from '~/services/ProjectService';
import { useNotification } from '~/hooks/useNotification';

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
  buttonBox: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
};

export interface ProjectFormInput {
  name: string;
}

interface ProjectCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const ProjectCreateModal = ({
  open,
  onClose,
  onSaveSuccess,
}: ProjectCreateModalProps) => {
  const { showNotification } = useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormInput>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ProjectFormInput) => {
      try {
        await ProjectService.createProject(data);
        showNotification('Project created successfully!', 'success');
        onSaveSuccess();
        onClose();
        reset();
      } catch (error) {
        console.error('Failed to create project:', error);
        showNotification('Failed to create project.', 'error');
      }
    },
    [onClose, onSaveSuccess, reset, showNotification]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Typography variant="h6" gutterBottom>
          Create New Project
        </Typography>
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

            <Box sx={styles.buttonBox}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                Create Project
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
