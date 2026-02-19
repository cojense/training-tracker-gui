import { useState } from 'react';
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

interface GroupFormModalProps {
  initialData?: Partial<Group>;
  onSubmit: (group: Partial<Group>) => Promise<void>;
  onCancel: () => void;
  title: string;
  open: boolean;
}

export const GroupFormModal = ({ initialData = {}, onSubmit, onCancel, title, open }: GroupFormModalProps) => {
  const [groupData, setGroupData] = useState<Partial<Group>>(initialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
  };

  return (
    <Modal open={open} onClose={onCancel}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '12px',
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <TextField
            fullWidth
            margin="normal"
            label="Group Name"
            name="name"
            value={groupData.name || ''}
            onChange={handleChange}
            required
            disabled={submitting}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={groupData.is_admin || false}
                onChange={handleChange}
                name="is_admin"
                disabled={submitting}
              />
            }
            label="Is Admin Group"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={groupData.is_training_manager || false}
                onChange={handleChange}
                name="is_training_manager"
                disabled={submitting}
              />
            }
            label="Is Training Manager Group"
          />
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
