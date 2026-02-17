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
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { GroupService } from '~/services/GroupService';
import { TrainingService } from '~/services/TrainingService';
import { ProjectService } from '~/services/ProjectService';
import { GroupService } from '~/services/GroupService';
import { useForm, Controller } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 2, borderColor: 'divider',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface AssignFormInput {
  training_id: string | number;
  project_id: string | number;
  start_date: string;
  end_date: string;
  suspense_date: string;
  cadence: string;
  no_nag: boolean;
}

export const AssignTrainingView = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignFormInput>({
    defaultValues: {
      training_id: '',
      project_id: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      suspense_date: '',
      cadence: '',
      no_nag: false,
    },
  });

  const fetchData = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const [groupData, trainingsData, projectsData] = await Promise.all([
        GroupService.getGroup(groupId),
        TrainingService.getTrainings(),
        ProjectService.getProjects(),
      ]);
      setGroup(groupData);
      setTrainings(trainingsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('Could not load required data.', 'error');
      void navigate('/groups');
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate, showNotification]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = async (data: AssignFormInput) => {
    if (!groupId) return;
    try {
      await GroupService.updateAssignment(groupId, data.training_id, {
        ...data,
        project_id: data.project_id,
      });
      showNotification('Training assigned successfully!', 'success');
      void navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to assign training:', error);
      showNotification('Failed to assign training.', 'error');
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
        Assign Training
      </Typography>
      {group && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Group: {group.name}
        </Typography>
      )}
      <Card elevation={2}>
        <CardContent>
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
          >
            <Stack spacing={3}>
              <Controller
                name="training_id"
                control={control}
                rules={{ required: 'Training is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Training Course"
                    fullWidth
                    error={!!errors.training_id}
                    helperText={errors.training_id?.message}
                  >
                    {trainings.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="project_id"
                control={control}
                rules={{ required: 'Project is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Bill To"
                    fullWidth
                    error={!!errors.project_id}
                    helperText={errors.project_id?.message}
                  >
                    {projects.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="start_date"
                control={control}
                rules={{ required: 'Start date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.start_date}
                    helperText={errors.start_date?.message}
                  />
                )}
              />

              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="End Date (Optional)"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <Controller
                name="suspense_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Suspense Date (Optional)"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <Controller
                name="cadence"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cadence (e.g. '1 year')"
                    fullWidth
                    placeholder="1 year"
                  />
                )}
              />

              <Controller
                name="no_nag"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="No Nag"
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
                  Create Assignment
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
