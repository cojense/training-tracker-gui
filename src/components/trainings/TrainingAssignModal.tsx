import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  Modal,
  Stack,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { Training } from '~/types/training';
import { Group } from '~/types/user';
import { Project } from '~/types/projects';
import { TrainingService } from '~/services/TrainingService';
import { ProjectService } from '~/services/ProjectService';
import { GroupService } from '~/services/GroupService';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 2,
    borderColor: 'divider',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  actionButtons: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
};

const validationRules = {
  training: { required: 'Training is required' },
  project: { required: 'Project is required' },
  startDate: { required: 'Start date is required' },
};

const inputLabelProps = { shrink: true };

interface AssignFormInput {
  training_id: string | number;
  project_id: string | number;
  start_date: string;
  end_date: string;
  suspense_date: string;
  cadence: string;
  no_nag: boolean;
}

interface TrainingAssignModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onSaveSuccess?: () => void;
}

const NoNagCheckbox = ({
  field,
}: {
  field: ControllerRenderProps<AssignFormInput, 'no_nag'>;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e.target.checked);
    },
    [field]
  );

  return (
    <FormControlLabel
      control={<Checkbox checked={field.value} onChange={handleChange} />}
      label="No Nag"
    />
  );
};

export const TrainingAssignModal = ({
  open,
  onClose,
  group,
  onSaveSuccess,
}: TrainingAssignModalProps) => {
  const { showNotification } = useNotification();
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
    if (!group) return;
    try {
      setLoading(true);
      const [trainingsData, projectsData] = await Promise.all([
        TrainingService.getTrainings(),
        ProjectService.getProjects(),
      ]);
      setTrainings(trainingsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('Could not load required data.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [group, onClose, showNotification]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  const onSubmit = useCallback(
    async (data: AssignFormInput) => {
      if (group?.id == null) return;
      try {
        await GroupService.updateAssignment(
          group.id,
          String(data.training_id),
          {
            ...data,
            project_id: data.project_id,
          }
        );
        showNotification('Training assigned successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to assign training:', error);
        showNotification('Failed to assign training.', 'error');
      }
    },
    [group, onSaveSuccess, onClose, showNotification]
  );

  const renderTrainingField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'training_id'>;
    }) => (
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
    ),
    [trainings, errors.training_id]
  );

  const renderProjectField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'project_id'>;
    }) => (
      <TextField
        {...field}
        select
        label="Bill To"
        fullWidth
        error={!!errors.project_id}
        helperText={errors.project_id?.message}
      >
        {projects.map((p) => (
          <MenuItem key={p.id} value={p.id ?? ''}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>
    ),
    [projects, errors.project_id]
  );

  const renderStartDateField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'start_date'>;
    }) => (
      <TextField
        {...field}
        label="Start Date"
        type="date"
        fullWidth
        InputLabelProps={inputLabelProps}
        error={!!errors.start_date}
        helperText={errors.start_date?.message}
      />
    ),
    [errors.start_date]
  );

  const renderEndDateField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'end_date'>;
    }) => (
      <TextField
        {...field}
        label="End Date (Optional)"
        type="date"
        fullWidth
        InputLabelProps={inputLabelProps}
      />
    ),
    []
  );

  const renderSuspenseDateField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'suspense_date'>;
    }) => (
      <TextField
        {...field}
        label="Suspense Date (Optional)"
        type="date"
        fullWidth
        InputLabelProps={inputLabelProps}
      />
    ),
    []
  );

  const renderCadenceField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'cadence'>;
    }) => (
      <TextField
        {...field}
        label="Cadence (e.g. '1 year')"
        fullWidth
        placeholder="1 year"
      />
    ),
    []
  );

  const renderNoNagField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<AssignFormInput, 'no_nag'>;
    }) => <NoNagCheckbox field={field} />,
    []
  );

  const handleFormSubmit = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Typography variant="h4" gutterBottom>
          Assign Training
        </Typography>
        {group && (
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Group: {group.name}
          </Typography>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              <Controller
                name="training_id"
                control={control}
                rules={validationRules.training}
                render={renderTrainingField}
              />

              <Controller
                name="project_id"
                control={control}
                rules={validationRules.project}
                render={renderProjectField}
              />

              <Controller
                name="start_date"
                control={control}
                rules={validationRules.startDate}
                render={renderStartDateField}
              />

              <Controller
                name="end_date"
                control={control}
                render={renderEndDateField}
              />

              <Controller
                name="suspense_date"
                control={control}
                render={renderSuspenseDateField}
              />

              <Controller
                name="cadence"
                control={control}
                render={renderCadenceField}
              />

              <Controller
                name="no_nag"
                control={control}
                render={renderNoNagField}
              />

              <Box sx={styles.actionButtons}>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Create Assignment
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Box>
    </Modal>
  );
};
