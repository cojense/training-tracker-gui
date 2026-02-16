import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ProjectService } from '~/services/ProjectService';
import { Project } from '~/types/projects';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  InputAdornment,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectCreateModal } from '~/components/projects/ProjectCreateModal';
import { ProjectEditModal } from '~/components/projects/ProjectEditModal';
import { ProjectDetailModal } from '~/components/projects/ProjectDetailModal';
import { ProjectTable } from '~/components/projects/ProjectTable';

const styles = {
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  errorBox: { p: 2 },
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchField: {
    bgcolor: 'background.paper',
    borderRadius: 1,
    width: { xs: '100%', sm: 250 },
  },
};

type Order = 'asc' | 'desc';

export const ProjectsView = () => {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Project>('name');
  const [order, setOrder] = useState<Order>('asc');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Could not load the projects list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const handleRequestSort = (property: keyof Project) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) =>
        (p.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[orderBy]! ?? '';
        const valB = b[orderBy]! ?? '';
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [projects, search, order, orderBy]);

  const handleCreateClick = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleDetailsClick = useCallback(
    (id: number | null) => {
      const project = projects.find((p) => p.id === id);
      if (project) {
        setDetailProject(project);
      }
    },
    [projects]
  );

  const handleEditClick = useCallback(
    (id: number | null) => {
      const project = projects.find((p) => p.id === id);
      if (project) {
        setEditProject(project);
      }
    },
    [projects]
  );

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditProject(null);
    setDetailProject(null);
    void fetchProjects(); // Refresh data after any modal action
  };

  return (
    <Card elevation={2}>
      <Box sx={styles.headerBox}>
        <Typography variant="h6">Projects List</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={styles.searchField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            size="small"
          >
            Create Project
          </Button>
        </Box>
      </Box>
      <Divider />
      <CardContent sx={styles.contentRoot}>
        {loading ? (
          <Box sx={styles.centeredBox}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={styles.errorBox}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <ProjectTable
            projects={filteredProjects}
            orderBy={orderBy}
            order={order}
            onRequestSort={handleRequestSort}
            onDetails={handleDetailsClick}
            onEdit={handleEditClick}
          />
        )}
      </CardContent>
      <ProjectCreateModal
        open={createModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={fetchProjects}
      />
      <ProjectEditModal
        project={editProject}
        open={!!editProject}
        onClose={handleCloseModal}
        onSaveSuccess={fetchProjects}
      />
      <ProjectDetailModal
        project={detailProject}
        open={!!detailProject}
        onClose={handleCloseModal}
        onEdit={(project) => handleEditClick(project.id)}
      />
    </Card>
  );
};