import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { ProjectService } from '~/services/ProjectService';
import { useNotification } from '~/hooks/NotificationContext';
import { useNavigate } from 'react-router-dom';

interface ProjectFormInput {
  name: string;
}

export const ProjectCreateView = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: ProjectFormInput) => {
    try {
      await ProjectService.createProject(data);
      showNotification('Project created successfully!', 'success');
      void navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
      showNotification('Failed to create project.', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Project
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
                  Create Project
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
