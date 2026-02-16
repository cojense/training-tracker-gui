import { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Modal,
  Stack,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ProjectService } from '~/services/ProjectService';
import { Project } from '~/types/projects';
import { useAuth } from '~/hooks/useAuth';

const styles = {
  modal: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  centeredBox: { textAlign: 'center', py: 4 },
  errorBox: { p: 2 },
};

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectDetailModal = ({
  project,
  open,
  onClose,
  onEdit,
}: ProjectDetailModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!project) return;
    try {
      setLoading(true);
      setError(null);
      await ProjectService.getProject(String(project.id)); // Fetch again to ensure fresh data
    } catch (err) {
      console.error('Failed to fetch project details:', err);
      setError('Could not load project details.');
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  if (!project) {
    return null;
  }

  const isAdmin = user?.is_admin ?? false;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={styles.errorBox}>
            <Alert severity="error">{error ?? 'Project not found'}</Alert>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Card elevation={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Project Detail</Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(project)}
                    size="small"
                  >
                    Edit Project
                  </Button>
                )}
              </Box>
              <Divider />
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="body1">{project.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{project.name}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
