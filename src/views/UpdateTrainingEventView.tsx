import { ChangeEvent, useEffect, useState, useCallback } from 'react';
import {
  useForm,
  Controller,
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
  CircularProgress,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';
import { TrainingEvent } from '~/types/training';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  buttonContainer: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
  certBox: { mt: 1 },
};

const dateRules = { required: 'Completion date is required' };

interface UpdateFormInput {
  completion_date: string;
  comment: string;
  certificate_unavailable: boolean;
  certificate: FileList | null;
}

/**
 * Components & Render Functions (Module Scope)
 */

interface renderDateFieldProps {
  field: ControllerRenderProps<UpdateFormInput, 'completion_date'>;
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

// CertificateToggle Component
interface CertificateToggleProps {
  field: ControllerRenderProps<UpdateFormInput, 'certificate_unavailable'>;
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
  field: ControllerRenderProps<UpdateFormInput, 'certificate_unavailable'>;
}) => <CertificateToggle field={field} />;

interface CertificateFileProps {
  field: ControllerRenderProps<UpdateFormInput, 'certificate'>;
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
  field: ControllerRenderProps<UpdateFormInput, 'certificate'>;
}) => <CertificateFile field={field} />;

const renderCommentField = ({ field }: { field: FieldValues }) => (
  <TextField {...field} label="Comments" fullWidth multiline rows={3} />
);

export const UpdateTrainingEventView = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [event, setEvent] = useState<TrainingEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateFormInput>({
    defaultValues: {
      completion_date: '',
      comment: '',
      certificate_unavailable: false,
      certificate: null,
    },
  });

  const watchCertUnavailable = watch('certificate_unavailable');

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getEvent(id);
      setEvent(data);
      reset({
        completion_date: data.completion_date,
        comment: data.comment ?? '',
        certificate_unavailable: data.certificate_unavailable ?? false,
        certificate: null,
      });
    } catch (error) {
      console.error('Failed to fetch event data:', error);
      showNotification('Could not load training record.', 'error');
      void navigate('/profile');
    } finally {
      setLoading(false);
    }
  }, [id, reset, showNotification, navigate]);

  useEffect(() => {
    void fetchEvent();
  }, [fetchEvent]);

  const onSubmit = useCallback(
    async (data: UpdateFormInput) => {
      if (!id) return;
      try {
        const formData = new FormData();
        formData.append('completion_date', data.completion_date);
        formData.append('comment', data.comment);
        formData.append(
          'certificate_unavailable',
          String(data.certificate_unavailable)
        );

        if (data.certificate && data.certificate.length > 0) {
          formData.append('certificate', data.certificate[0]);
        }

        await api.updateEvent(id, formData);
        showNotification('Training record updated successfully!', 'success');
        void navigate('/profile');
      } catch (error) {
        console.error('Failed to update training record:', error);
        showNotification('Failed to update record.', 'error');
      }
    },
    [id, navigate, showNotification]
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
        Update Training Record
      </Typography>
      {event && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {event.training.title}
        </Typography>
      )}
      <Card elevation={2}>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
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
                    Upload New Certificate (Optional, PDF or Image)
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
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
