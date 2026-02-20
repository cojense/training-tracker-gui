import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
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
  Modal,
} from '@mui/material';
import { GroupService } from '~/services/GroupService';
import { ProjectService } from '~/services/ProjectService';
import { useNotification } from '~/hooks/useNotification';
import { Project } from '~/types/projects';
import { Group } from '~/types/user';
import { Assignment } from '~/types/assignments';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    border: 2,
    borderColor: 'divider',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  actionContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
  },
  buttonGroup: { display: 'flex', gap: 2 },
};

const validationRules = {
  project: { required: 'Project is required' },
  startDate: { required: 'Start date is required' },
};

const inputLabelProps = { shrink: true };

interface EditAssignFormInput {
  project_id: string | number;
  start_date: string;
  end_date: string;
  suspense_date: string;
  cadence: string;
  no_nag: boolean;
}

interface AssignmentEditModalProps {
  open: boolean;
  onClose: () => void;
  groupId: number | string | null;
  trainingId: number | string | null;
  onSaveSuccess?: () => void;
}

const NoNagCheckbox = ({
  field,
}: {
  field: ControllerRenderProps<EditAssignFormInput, 'no_nag'>;
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

export const AssignmentEditModal = ({
  open,
  onClose,
  groupId,
  trainingId,
  onSaveSuccess,
}: AssignmentEditModalProps) => {
  const { showNotification } = useNotification();
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
        GroupService.getGroup(groupId),
        GroupService.getAssignment(groupId, trainingId),
        ProjectService.getProjects(),
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
      onClose();
    } finally {
      setLoading(false);
    }
  }, [groupId, trainingId, reset, showNotification, onClose]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  const onSubmit = useCallback(
    async (data: EditAssignFormInput) => {
      if (!groupId || !trainingId) return;
      try {
        await GroupService.updateAssignment(groupId, trainingId, {
          ...data,
          project_id: data.project_id,
        });
        showNotification('Assignment updated successfully!', 'success');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to update assignment:', error);
        showNotification('Failed to update assignment.', 'error');
      }
    },
    [groupId, trainingId, onSaveSuccess, onClose, showNotification]
  );

  const handleDelete = useCallback(async () => {
    if (!groupId || !trainingId) return;
    try {
      await GroupService.deleteAssignment(groupId, trainingId);
      showNotification('Assignment deleted.', 'success');
      setDeleteDialogOpen(false);
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
      showNotification('Failed to delete assignment.', 'error');
    }
  }, [groupId, trainingId, onSaveSuccess, onClose, showNotification]);

  const renderProjectField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<EditAssignFormInput, 'project_id'>;
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
      field: ControllerRenderProps<EditAssignFormInput, 'start_date'>;
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
      field: ControllerRenderProps<EditAssignFormInput, 'end_date'>;
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
      field: ControllerRenderProps<EditAssignFormInput, 'suspense_date'>;
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
      field: ControllerRenderProps<EditAssignFormInput, 'cadence'>;
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
      field: ControllerRenderProps<EditAssignFormInput, 'no_nag'>;
    }) => <NoNagCheckbox field={field} />,
    []
  );

  const handleOpenDelete = useCallback(() => setDeleteDialogOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteDialogOpen(false), []);

  const handleFormSubmit = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit]
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={styles.modal}>
          <Typography variant="h4" gutterBottom>
            Edit Assignment
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {group && assignment && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {assignment.training.title} for {group.name}
                </Typography>
              )}
              <form onSubmit={handleFormSubmit}>
                <Stack spacing={3}>
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

                  <Box sx={styles.actionContainer}>
                    <Button
                      color="error"
                      onClick={handleOpenDelete}
                      disabled={isSubmitting}
                    >
                      Delete Assignment
                    </Button>
                    <Box sx={styles.buttonGroup}>
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
            </>
          )}
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Assignment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this training assignment from the
            group? This will not delete the training or any completion records.
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
