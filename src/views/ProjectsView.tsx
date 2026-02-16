import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ProjectService } from '~/services/ProjectService';
import { Project } from '~/types/projects';
import { useForm, Controller } from 'react-hook-form';
import { useNotification } from '~/hooks/useNotification';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  Paper,
} from '@mui/material';
import { Modal, Stack } from '@mui/material'; // Add Modal and Stack
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  headerCell: { fontWeight: 'bold' },
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
  buttonBox: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  spaceBetween: {
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
  },
};

interface ProjectFormInput {
  name: string;
}

interface ProjectCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}
const ProjectCreateModal = ({
  open,
  onClose,
  onSaveSuccess,
}: ProjectCreateModalProps) => {
  const { showNotification } = useNotification();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormInput>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (data: ProjectFormInput) => {
      try {
        await ProjectService.createProject(data);
        showNotification('Project created successfully!', 'success');
        onSaveSuccess();
        onClose();
        reset();
      } catch (error) {
        console.error('Failed to create project:', error);
        showNotification('Failed to create project.', 'error');
      }
    },
    [onClose, onSaveSuccess, reset, showNotification]
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Typography variant="h6" gutterBottom>
          Create New Project
        </Typography>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
        >
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Project name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Project Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Box sx={styles.buttonBox}>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
              >
                Create Project
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

interface ProjectEditModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onSaveSuccess: () => void;
}
const ProjectEditModal = ({
  open,
  onClose,
  project,
  onSaveSuccess,
}: ProjectEditModalProps) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>();

  const fetchProject = useCallback(async () => {
    if (!project) return;
    try {
      setLoading(true);
      const data = await ProjectService.getProject(String(project.id));
      reset({
        name: data.name ?? '',
      });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      showNotification('Could not load project details.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [project, reset, showNotification, onClose]);

  useEffect(() => {
    if (open) {
      void fetchProject();
    }
  }, [open, fetchProject]);

  const onSubmit = useCallback(
    async (data: ProjectFormInput) => {
      if (!project) return;
      try {
        await ProjectService.updateProject(String(project.id), data);
        showNotification('Project updated successfully!', 'success');
        onSaveSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to update project:', error);
        showNotification('Failed to update project.', 'error');
      }
    },
    [project, onClose, onSaveSuccess, showNotification]
  );

  const handleDelete = useCallback(async () => {
    if (!project) return;
    try {
      await ProjectService.deleteProject(String(project.id));
      showNotification('Project deleted.', 'success');
      setDeleteDialogOpen(false);
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
      showNotification('Failed to delete project.', 'error');
    }
  }, [project, showNotification, onSaveSuccess, onClose]);

  const handleOpenDelete = useCallback(() => setDeleteDialogOpen(true), []);
  const handleCloseDelete = useCallback(() => setDeleteDialogOpen(false), []);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={styles.modal}>
          <Typography variant="h6" gutterBottom>
            Edit Project
          </Typography>
          {loading ? (
            <Box sx={styles.centeredBox}>
              <CircularProgress />
            </Box>
          ) : (
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
            >
              <Stack spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Project name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Project Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Box sx={styles.spaceBetween}>
                  <Button
                    color="error"
                    onClick={handleOpenDelete}
                    disabled={isSubmitting}
                  >
                    Delete Project
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </form>
          )}
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete Project?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this project? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}
const ProjectDetailModal = ({
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

interface ProjectRowProps {
  project: Project;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}

const ProjectRow = ({ project, onDetails, onEdit }: ProjectRowProps) => {
  const handleDetails = useCallback(
    () => onDetails(project.id),
    [project.id, onDetails]
  );
  const handleEdit = useCallback(
    () => onEdit(project.id),
    [project.id, onEdit]
  );

  return (
    <TableRow hover>
      <TableCell>{project.id}</TableCell>
      <TableCell>{project.name}</TableCell>
      <TableCell>
        <Tooltip title="View Details">
          <IconButton size="small" onClick={handleDetails}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Project">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
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
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.headerCell}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={styles.headerCell}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={styles.headerCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.map((p) => (
                  <ProjectRow
                    key={p.id ?? 'new'}
                    project={p}
                    onDetails={handleDetailsClick}
                    onEdit={handleEditClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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