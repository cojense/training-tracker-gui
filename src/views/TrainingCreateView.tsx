import { useCallback } from 'react';
import {
  useForm,
  Controller,
  Control,
  ControllerRenderProps,
} from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Training } from '~/types/training';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  buttonContainer: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
};

const dateRules = { required: 'Date is required' };
const titleRules = { required: 'Title is required' };
const descriptionRules = { required: 'Description is required' };

interface TrainingFormInput {
  date: string;
  title: string;
  description: string;
  url: string;
}

const shrinkLabel = { shrink: true };

/**
 * Stable Render Functions
 */
const renderDateField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<TrainingFormInput, 'date'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="Date"
    type="date"
    fullWidth
    InputLabelProps={shrinkLabel}
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderTitleField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<TrainingFormInput, 'title'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="Title"
    fullWidth
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderDescriptionField = ({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<TrainingFormInput, 'description'>;
  fieldState: { error?: { message?: string } };
}) => (
  <TextField
    {...field}
    label="Description"
    fullWidth
    multiline
    rows={4}
    error={!!fieldState.error}
    helperText={fieldState.error?.message}
  />
);

const renderUrlField = ({
  field,
}: {
  field: ControllerRenderProps<TrainingFormInput, 'url'>;
}) => (
  <TextField
    {...field}
    label="External URL (Optional)"
    fullWidth
    placeholder="https://example.com"
  />
);

/**
 * Controller Wrappers
 */
const DateController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="date"
    control={control}
    rules={dateRules}
    render={renderDateField}
  />
);

const TitleController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="title"
    control={control}
    rules={titleRules}
    render={renderTitleField}
  />
);

const DescriptionController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => (
  <Controller
    name="description"
    control={control}
    rules={descriptionRules}
    render={renderDescriptionField}
  />
);

const UrlController = ({
  control,
}: {
  control: Control<TrainingFormInput>;
}) => <Controller name="url" control={control} render={renderUrlField} />;

export const TrainingCreateView = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TrainingFormInput>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      url: '',
    },
  });

  const onSubmit = useCallback(
    async (data: TrainingFormInput) => {
      try {
        const newTraining: Partial<Training> = {
          ...data,
          id: undefined, // Let the backend generate the ID
        };
        await api.createTraining(newTraining);
        showNotification('Training course created successfully!', 'success');
        void navigate('/trainings');
      } catch (error) {
        console.error('Failed to create training:', error);
        showNotification(
          'Failed to create training. Please check your input.',
          'error'
        );
      }
    },
    [navigate, showNotification]
  );

  const handleCancel = useCallback(() => {
    void navigate('/trainings');
  }, [navigate]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit]
  );

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Create New Training
      </Typography>
      <Card elevation={2}>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
              <DateController control={control} />
              <TitleController control={control} />
              <DescriptionController control={control} />
              <UrlController control={control} />

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
                  Create Training
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
