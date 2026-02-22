import { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Group } from '~/types/user';

const styles = {
  modalContainer: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
  },
  actionContainer: {
    mt: 3,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 1,
  },
  alert: { mt: 2 },
};

interface GroupFormModalProps {
  initialData?: Partial<Group>;
  onSubmit: (group: Partial<Group>) => Promise<void>;
  onCancel: () => void;
  title: string;
  open: boolean;
}

export const GroupFormModal = ({
  initialData = {},
  onSubmit,
  onCancel,
  title,
  open,
}: GroupFormModalProps) => {
  const [groupData, setGroupData] = useState<Partial<Group>>(initialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = event.target;
      setGroupData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      setSubmitError(null);
      try {
        await onSubmit(groupData);
        onCancel();
      } catch (err) {
        console.error('Failed to submit group:', err);
        setSubmitError('Failed to save group. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [groupData, onCancel, onSubmit]
  );

  const isAdminCheckbox = useMemo(
    () => (
      <Checkbox
        checked={groupData.is_admin ?? false}
        onChange={handleChange}
        name="is_admin"
        disabled={submitting}
      />
    ),
    [groupData.is_admin, handleChange, submitting]
  );

  const isTrainingManagerCheckbox = useMemo(
    () => (
      <Checkbox
        checked={groupData.is_training_manager ?? false}
        onChange={handleChange}
        name="is_training_manager"
        disabled={submitting}
      />
    ),
    [groupData.is_training_manager, handleChange, submitting]
  );

  const saveButtonStartIcon = useMemo(
    () => (submitting ? <CircularProgress size={20} /> : null),
    [submitting]
  );

  const saveButtonText = useMemo(
    () => (submitting ? 'Saving...' : 'Save'),
    [submitting]
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <Modal open={open} onClose={onCancel}>
      <Box sx={styles.modalContainer}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Group Name"
            name="name"
            value={groupData.name ?? ''}
            onChange={handleChange}
            required
            disabled={submitting}
          />
          <FormControlLabel control={isAdminCheckbox} label="Is Admin Group" />
          <FormControlLabel
            control={isTrainingManagerCheckbox}
            label="Is Training Manager Group"
          />
          {submitError && (
            <Alert severity="error" sx={styles.alert}>
              {submitError}
            </Alert>
          )}
          <Box sx={styles.actionContainer}>
            <Button variant="outlined" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={saveButtonStartIcon}
            >
              {saveButtonText}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
