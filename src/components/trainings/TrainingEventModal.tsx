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
import { Training, TrainingEvent } from '~/types/training';
import { User } from '~/types/user';
import { TrainingService } from '~/services/TrainingService';
import { UserService } from '~/services/UserService';
import { useAuth } from '~/hooks/useAuth';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';

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
  uploadContainer: { mt: 1 },
  actionButtons: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
};

const validationRules = {
  member: { required: 'Member is required' },
  training: { required: 'Training is required' },
  completionDate: { required: 'Completion date is required' },
};

const inputLabelProps = { inputLabel: { shrink: true } };

interface EventFormInput {
  user_id: string | number;
  training_id: string | number;
  completion_date: string;
  comment: string;
  certificate_unavailable: boolean;
  certificate: FileList | null;
}

interface TrainingEventModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  event?: TrainingEvent | null;
  onSaveSuccess?: () => void;
  initialUserId?: number;
  initialTrainingId?: number;
}

const CertificateUnavailableCheckbox = ({
  field,
}: {
  field: ControllerRenderProps<EventFormInput, 'certificate_unavailable'>;
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
      label="Certificate Unavailable"
    />
  );
};

const CertificateFileInput = ({
  onChange,
}: {
  onChange: (files: FileList | null) => void;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.files);
    },
    [onChange]
  );

  return (
    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleChange} />
  );
};

export const TrainingEventModal = ({
  open,
  onClose,
  mode,
  event,
  onSaveSuccess,
  initialUserId,
  initialTrainingId,
}: TrainingEventModalProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput>({
    defaultValues: {
      user_id: initialUserId ?? user?.id ?? '',
      training_id: initialTrainingId ?? '',
      completion_date: new Date().toISOString().split('T')[0],
      comment: '',
      certificate_unavailable: false,
      certificate: null,
    },
  });

  const watchCertUnavailable = watch('certificate_unavailable');

  useEffect(() => {
    if (watchCertUnavailable) {
      setValue('certificate', null);
    }
  }, [watchCertUnavailable, setValue]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [trainingsData, usersData] = await Promise.all([
        TrainingService.getTrainings(),
        isManager ? UserService.getUsers() : Promise.resolve([]),
      ]);
      setTrainings(trainingsData);
      if (isManager) setUsers(usersData);

      if (mode === 'update' && event && event.id !== null) {
        const eventData = await TrainingService.getEvent(event.id);
        reset({
          completion_date: eventData.completion_date ?? '',
          comment: eventData.comment ?? '',
          certificate_unavailable: eventData.certificate_unavailable ?? false,
          certificate: null,
          user_id: eventData.user_id,
          training_id: eventData.training?.id ?? eventData.training,
        });
      } else if (mode === 'create') {
        reset({
          user_id: initialUserId ?? user?.id ?? '',
          training_id: initialTrainingId ?? '',
          completion_date: new Date().toISOString().split('T')[0],
          comment: '',
          certificate_unavailable: false,
          certificate: null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch form data:', error);
      showNotification('Could not load required data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [
    isManager,
    showNotification,
    mode,
    event,
    reset,
    initialUserId,
    initialTrainingId,
    user?.id,
  ]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  const onSubmit = useCallback(
    async (data: EventFormInput) => {
      try {
        const formData = new FormData();
        formData.append('user_id', String(data.user_id));
        formData.append('training_id', String(data.training_id));
        formData.append('completion_date', data.completion_date);
        formData.append('comment', data.comment);
        formData.append(
          'certificate_unavailable',
          String(data.certificate_unavailable)
        );

        if (data.certificate && data.certificate.length > 0) {
          formData.append('certificate', data.certificate[0]);
        }

        if (mode === 'create') {
          await TrainingService.createEvent(formData);
          showNotification('Training record saved successfully!', 'success');
        } else if (mode === 'update' && event?.id) {
          await TrainingService.updateEvent(event.id, formData);
          showNotification('Training record updated successfully!', 'success');
        }
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to save training record:', error);
        showNotification('Failed to save record.', 'error');
      }
    },
    [mode, event, onClose, showNotification, onSaveSuccess]
  );

  const renderMember = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<EventFormInput, 'user_id'>;
    }) => (
      <TextField
        {...field}
        select
        label="Member"
        fullWidth
        error={!!errors.user_id}
        helperText={errors.user_id?.message}
        disabled={mode === 'update'}
      >
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.last_name}, {u.first_name} ({u.email})
          </MenuItem>
        ))}
      </TextField>
    ),
    [users, errors.user_id, mode]
  );

  const renderTraining = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<EventFormInput, 'training_id'>;
    }) => (
      <TextField
        {...field}
        select
        label="Training Course"
        fullWidth
        error={!!errors.training_id}
        helperText={errors.training_id?.message}
        disabled={mode === 'update'}
      >
        {trainings.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.title}
          </MenuItem>
        ))}
      </TextField>
    ),
    [trainings, errors.training_id, mode]
  );

  const renderCompletionDate = useCallback(
    ({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<EventFormInput, 'completion_date'>;
      fieldState: { error?: { message?: string } };
    }) => (
      <TextField
        {...field}
        label="Completion Date"
        type="date"
        fullWidth
        slotProps={inputLabelProps}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    ),
    []
  );

  const renderCertificateUnavailable = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<EventFormInput, 'certificate_unavailable'>;
    }) => <CertificateUnavailableCheckbox field={field} />,
    []
  );

  const renderCertificateInput = useCallback(
    ({
      field: { onChange },
    }: {
      field: { onChange: (files: FileList | null) => void };
    }) => <CertificateFileInput onChange={onChange} />,
    []
  );

  const renderComment = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<EventFormInput, 'comment'>;
    }) => (
      <TextField {...field} label="Comments" fullWidth multiline rows={3} />
    ),
    []
  );

  const modalTitle = useMemo(
    () =>
      mode === 'create'
        ? 'Record Training Completion'
        : 'Update Training Record',
    [mode]
  );

  const submitButtonLabel = useMemo(
    () => (mode === 'create' ? 'Save Record' : 'Save Changes'),
    [mode]
  );

  const handleFormSubmit = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Typography variant="h4" gutterBottom>
          {modalTitle}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              {isManager && (
                <Controller
                  name="user_id"
                  control={control}
                  rules={validationRules.member}
                  render={renderMember}
                />
              )}

              <Controller
                name="training_id"
                control={control}
                rules={validationRules.training}
                render={renderTraining}
              />

              <Controller
                name="completion_date"
                control={control}
                rules={validationRules.completionDate}
                render={renderCompletionDate}
              />

              <Controller
                name="certificate_unavailable"
                control={control}
                render={renderCertificateUnavailable}
              />

              {!watchCertUnavailable && (
                <Box sx={styles.uploadContainer}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Upload Certificate (PDF or Image)
                  </Typography>
                  <Controller
                    name="certificate"
                    control={control}
                    render={renderCertificateInput}
                  />
                </Box>
              )}

              <Controller
                name="comment"
                control={control}
                render={renderComment}
              />

              <Box sx={styles.actionButtons}>
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  {submitButtonLabel}
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Box>
    </Modal>
  );
};
