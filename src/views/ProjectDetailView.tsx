import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectService } from '~/services/ProjectService';
import { Project } from '~/types/projects';
import { useAuth } from '~/hooks/useAuth';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 2 },
  centeredBox: { textAlign: 'center', py: 4 },
};

export const ProjectDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectService.getProject(id);
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project details:', err);
      setError('Could not load project details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={styles.centeredBox}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error ?? 'Project not found'}</Alert>
      </Box>
    );
  }

  const isAdmin = user?.is_admin ?? false;

  return (
    <Stack spacing={3}>
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Project Detail</Typography>
          {isAdmin && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${id}/edit`)}
              size="small"
            >
              Edit Project
            </Button>
          )}
        </Box>
        <Divider />
        <CardContent sx={styles.contentRoot}>
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
  );
};
