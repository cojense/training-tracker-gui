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
  modalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  buttonBox: { display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 },
  stackContainer: { mt: 2 },
};

const NAME_RULES = { required: 'Project name is required' };

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

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  const renderNameField = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ field }: { field: any }) => (
      <TextField
        {...field}
        label="Project Name"
        fullWidth
        error={!!errors.name}
        helperText={errors.name?.message}
      />
    ),
    [errors.name]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalContainer}>
        <Typography variant="h5" gutterBottom>
          Create New Project
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Stack spacing={3} sx={styles.stackContainer}>
            <Controller
              name="name"
              control={control}
              rules={NAME_RULES}
              render={renderNameField}
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
