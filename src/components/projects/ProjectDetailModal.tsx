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
  modalContainer: {
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
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centeredBox: { textAlign: 'center', py: 4 },
  errorBox: { p: 2 },
  errorFooter: { mt: 2, textAlign: 'right' },
  cardContent: { p: 2 },
  footerBox: { display: 'flex', justifyContent: 'flex-end' },
};

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectDetailModal = ({
  project: initialProject,
  open,
  onClose,
  onEdit,
}: ProjectDetailModalProps) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(initialProject);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!initialProject) return;
    try {
      setLoading(true);
      setError(null);
      const freshProject = await ProjectService.getProject(
        String(initialProject.id)
      );
      setProject(freshProject);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
      setError('Could not load project details.');
    } finally {
      setLoading(false);
    }
  }, [initialProject]);

  useEffect(() => {
    if (open) {
      void fetchData();
    }
  }, [open, fetchData]);

  const handleEdit = useCallback(() => {
    if (project) {
      onEdit(project);
    }
  }, [onEdit, project]);

  if (!initialProject) {
    return null;
  }

  const isAdmin = user?.is_admin ?? false;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modalContainer}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error || !project ? (
          <Box sx={styles.errorBox}>
            <Alert severity="error">{error ?? 'Project not found'}</Alert>
            <Box sx={styles.errorFooter}>
              <Button onClick={onClose}>Close</Button>
            </Box>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Typography variant="h5">Project Details</Typography>
            <Card variant="outlined">
              <Box sx={styles.headerBox}>
                <Typography variant="h6">{project.name}</Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </Box>
              <Divider />
              <CardContent sx={styles.cardContent}>
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
            <Box sx={styles.footerBox}>
              <Button variant="contained" onClick={onClose}>
                Close
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
