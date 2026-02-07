import { ChangeEvent, useEffect, useState, useCallback, useMemo } from 'react';
import {
  useForm,
  Controller,
  Control,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form';
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
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/utilities/useAuth';
import { User } from '~/types/user';
import { Training } from '~/types/training';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  buttonContainer: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
  certBox: { mt: 1 },
};

const memberRules = { required: 'Member is required' };
const trainingRules = { required: 'Training is required' };
const dateRules = { required: 'Completion date is required' };

interface RecordFormInput {
  user_id: string | number;
  training_id: string | number;
  completion_date: string;
  comment: string;
  certificate_unavailable: boolean;
  certificate: FileList | null;
}

/**
 * Components & Render Functions (Module Scope)
 */

interface renderDateFieldProps {
  field: ControllerRenderProps<RecordFormInput, 'completion_date'>;
  fieldState: { error?: { message?: string } };
}
const renderDateField = ({ field, fieldState }: renderDateFieldProps) => (
  <TextField
    {...field}
    label="Completion Date"
    type="date"
    fullWidth
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

// 2. CertificateToggle Component & Render Function
interface CertificateToggleProps {
  field: ControllerRenderProps<RecordFormInput, 'certificate_unavailable'>;
}
const CertificateToggle = ({ field }: CertificateToggleProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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

const renderCertificateToggle = ({
  field,
}: {
  field: ControllerRenderProps<RecordFormInput, 'certificate_unavailable'>;
}) => <CertificateToggle field={field} />;

interface CertificateFileProps {
  field: ControllerRenderProps<RecordFormInput, 'certificate'>;
}
const CertificateFile = ({ field }: CertificateFileProps) => {
  const { onChange, ...fieldProps } = field;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.files);
    },
    [onChange]
  );

  return (
    <input
      {...fieldProps}
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      onChange={handleChange}
    />
  );
};

const renderCertificateFile = ({
  field,
}: {
  field: ControllerRenderProps<RecordFormInput, 'certificate'>;
}) => <CertificateFile field={field} />;

const renderCommentField = ({ field }: { field: FieldValues }) => (
  <TextField {...field} label="Comments" fullWidth multiline rows={3} />
);

/**
 * Sub-components
 */
interface UserSelectProps {
  control: Control<RecordFormInput>;
  users: User[];
  error?: string;
}
const UserSelect = ({ control, users, error }: UserSelectProps) => {
  const renderUserField = useMemo(
    () =>
      ({
        field,
      }: {
        field: ControllerRenderProps<RecordFormInput, 'user_id'>;
      }) => (
        <TextField
          {...field}
          select
          label="Member"
          fullWidth
          error={!!error}
          helperText={error}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.last_name}, {u.first_name} ({u.email})
            </MenuItem>
          ))}
        </TextField>
      ),
    [users, error]
  );

  return (
    <Controller
      name="user_id"
      control={control}
      rules={memberRules}
      render={renderUserField}
    />
  );
};

interface TrainingSelectProps {
  control: Control<RecordFormInput>;
  trainings: Training[];
  error?: string;
}
const TrainingSelect = ({ control, trainings, error }: TrainingSelectProps) => {
  const renderTrainingField = useMemo(
    () =>
      ({
        field,
      }: {
        field: ControllerRenderProps<RecordFormInput, 'training_id'>;
      }) => (
        <TextField
          {...field}
          select
          label="Training Course"
          fullWidth
          error={!!error}
          helperText={error}
        >
          {trainings.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.title}
            </MenuItem>
          ))}
        </TextField>
      ),
    [trainings, error]
  );

  return (
    <Controller
      name="training_id"
      control={control}
      rules={trainingRules}
      render={renderTrainingField}
    />
  );
};

export const RecordTrainingEventView = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const isManager = user?.is_admin ?? user?.is_training_manager ?? false;

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialTrainingId = queryParams.get('training_id') ?? '';
  const initialUserId = queryParams.get('user_id') ?? user?.id ?? '';

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormInput>({
    defaultValues: {
      user_id: initialUserId,
      training_id: initialTrainingId,
      completion_date: new Date().toISOString().split('T')[0],
      comment: '',
      certificate_unavailable: false,
      certificate: null,
    },
  });

  const watchCertUnavailable = watch('certificate_unavailable');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [trainingsData, usersData] = await Promise.all([
        api.getTrainings(),
        isManager ? api.getUsers() : Promise.resolve([]),
      ]);
      setTrainings(trainingsData);
      if (isManager) setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
      showNotification('Could not load required data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [isManager, showNotification]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSubmit = useCallback(
    async (data: RecordFormInput) => {
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

        await api.createEvent(formData);
        showNotification('Training record saved successfully!', 'success');
        void navigate('/');
      } catch (error) {
        console.error('Failed to record training:', error);
        showNotification('Failed to save record.', 'error');
      }
    },
    [navigate, showNotification]
  );

  const handleCancel = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Record Training Completion
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              {isManager && (
                <UserSelect
                  control={control}
                  users={users}
                  error={errors.user_id?.message}
                />
              )}

              <TrainingSelect
                control={control}
                trainings={trainings}
                error={errors.training_id?.message}
              />

              <Controller
                name="completion_date"
                control={control}
                rules={dateRules}
                render={renderDateField}
              />

              <Controller
                name="certificate_unavailable"
                control={control}
                render={renderCertificateToggle}
              />

              {!watchCertUnavailable && (
                <Box sx={styles.certBox}>
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
                    render={renderCertificateFile}
                  />
                </Box>
              )}

              <Controller
                name="comment"
                control={control}
                render={renderCommentField}
              />

              <Box sx={styles.buttonContainer}>
                <Button onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  Save Record
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
