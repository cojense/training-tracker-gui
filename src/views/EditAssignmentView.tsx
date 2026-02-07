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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '~/types/projects';
import { Group } from '~/types/user';
import { Assignment } from '~/types/assignments';

interface EditAssignFormInput {
  project_id: string | number;
  start_date: string;
  end_date: string;
  suspense_date: string;
  cadence: string;
  no_nag: boolean;
}

export const EditAssignmentView = () => {
  const { groupId, trainingId } = useParams<{
    groupId: string;
    trainingId: string;
  }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditAssignFormInput>();

  const fetchData = useCallback(async () => {
    if (!groupId || !trainingId) return;
    try {
      setLoading(true);
      const [groupData, assignmentData, projectsData] = await Promise.all([
        api.getGroup(groupId),
        api.getAssignment(groupId, trainingId),
        api.getProjects(),
      ]);
      setGroup(groupData);
      setAssignment(assignmentData);
      setProjects(projectsData);
      reset({
        project_id: assignmentData.project.id ?? '',
        start_date: assignmentData.start_date,
        end_date: assignmentData.end_date ?? '',
        suspense_date: assignmentData.suspense_date,
        cadence: assignmentData.cadence,
        no_nag: assignmentData.no_nag,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('Could not load required data.', 'error');
      void navigate(`/groups/${groupId}`);
    } finally {
      setLoading(false);
    }
  }, [groupId, trainingId, navigate, reset, showNotification]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = async (data: EditAssignFormInput) => {
    if (!groupId || !trainingId) return;
    try {
      await api.updateAssignment(groupId, trainingId, {
        ...data,
        project_id: data.project_id,
      });
      showNotification('Assignment updated successfully!', 'success');
      void navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to update assignment:', error);
      showNotification('Failed to update assignment.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!groupId || !trainingId) return;
    try {
      await api.deleteAssignment(groupId, trainingId);
      showNotification('Assignment deleted.', 'success');
      setDeleteDialogOpen(false);
      void navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      showNotification('Failed to delete assignment.', 'error');
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
        Edit Assignment
      </Typography>
      {group && assignment && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {assignment.training.title} for {group.name}
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
                  Delete Assignment
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
        <DialogTitle>Delete Assignment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this training assignment from the
            group? This will not delete the training or any completion records.
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
