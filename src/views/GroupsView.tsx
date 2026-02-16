import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  TableSortLabel,
  Modal,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { GroupService } from '~/services/GroupService';
import { Group, User } from '~/types/user';
import { Assignment } from '~/types/assignments';
import { AssignmentEditModal } from '~/components/modals/AssignmentEditModal';
import { TrainingAssignModal } from '~/components/modals/TrainingAssignModal';

const styles = {
  headerBox: {
    p: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentRoot: { p: 0 },
  centeredBox: { textAlign: 'center', py: 4 },
  headerCell: { fontWeight: 'bold' },
  errorBox: { p: 2 },
  searchField: {
    bgcolor: 'background.paper',
    borderRadius: 1,
    width: { xs: '100%', sm: 250 },
  },
};

interface GroupRowProps {
  group: Group;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}
const GroupRow = ({ group, onDetails, onEdit }: GroupRowProps) => {
  const handleDetails = useCallback(
    () => onDetails(group.id),
    [group.id, onDetails]
  );
  const handleEdit = useCallback(() => onEdit(group.id), [group.id, onEdit]);

  return (
    <TableRow hover>
      <TableCell>{group.id}</TableCell>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.is_admin ? 'Yes' : 'No'}</TableCell>
      <TableCell>{group.is_training_manager ? 'Yes' : 'No'}</TableCell>
      <TableCell>
        <Tooltip title="View Details">
          <IconButton size="small" onClick={handleDetails} aria-label="Details">
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Group">
          <IconButton size="small" onClick={handleEdit} aria-label="Edit">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

type Order = 'asc' | 'desc';

export const GroupsView = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof Group>('name');
  const [order, setOrder] = useState<Order>('asc');

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [editAssignment, setEditAssignment] = useState<{groupId: number, trainingId: number} | null>(null);
  const [assignGroup, setAssignGroup] = useState<Group | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GroupService.getGroups();
      setGroups(data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Could not load the groups list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  const handleRequestSort = (property: keyof Group) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredGroups = useMemo(() => {
    return groups
      .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const valA = (a[orderBy] as string | number) ?? '';
        const valB = (b[orderBy] as string | number) ?? '';
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [groups, search, order, orderBy]);

  const handleCreateClick = useCallback(() => {
    setOpenCreateModal(true);
  }, []);

  const handleDetailsClick = useCallback(
    (id: number | null) => {
      if (id !== null) {
        const group = groups.find((g) => g.id === id);
        if (group) {
          setSelectedGroup(group);
          setOpenDetailModal(true);
        }
      }
    },
    [groups]
  );

  const handleEditClick = useCallback(
    (id: number | null) => {
      if (id !== null) {
        const group = groups.find((g) => g.id === id);
        if (group) {
          setSelectedGroup(group);
          setOpenEditModal(true);
        }
      }
    },
    [groups]
  );

  const handleCloseModal = useCallback(() => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setOpenDetailModal(false);
    setSelectedGroup(null);
    setEditAssignment(null);
    setAssignGroup(null);
    void fetchGroups();
  }, [fetchGroups]);

  return (
    <>
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Groups Management</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={styles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateClick}
              size="small"
            >
              Create Group
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
                    <TableCell sx={styles.headerCell}>Admin</TableCell>
                    <TableCell sx={styles.headerCell}>Manager</TableCell>
                    <TableCell sx={styles.headerCell}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGroups.map((g) => (
                    <GroupRow
                      key={g.id ?? 'new'}
                      group={g}
                      onDetails={handleDetailsClick}
                      onEdit={handleEditClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {openCreateModal && (
        <GroupCreateModal
          onClose={handleCloseModal}
          onGroupCreated={handleCloseModal}
        />
      )}

      {openEditModal && (
        <GroupEditModal
          open={openEditModal}
          onClose={handleCloseModal}
          onGroupUpdated={handleCloseModal}
          group={selectedGroup}
        />
      )}

      {openDetailModal && selectedGroup && (
        <GroupDetailModal
          open={openDetailModal}
          onClose={handleCloseModal}
          group={selectedGroup}
          onEditAssignment={(trainingId) => setEditAssignment({groupId: selectedGroup.id, trainingId})}
          onAddAssignment={() => setAssignGroup(selectedGroup)}
        />
      )}

      <AssignmentEditModal
        open={!!editAssignment}
        onClose={() => setEditAssignment(null)}
        groupId={editAssignment?.groupId ?? null}
        trainingId={editAssignment?.trainingId ?? null}
        onSaveSuccess={handleCloseModal}
      />

      <TrainingAssignModal
        open={!!assignGroup}
        onClose={() => setAssignGroup(null)}
        group={assignGroup}
        onSaveSuccess={handleCloseModal}
      />
    </>
  );
};

interface GroupFormProps {
  initialData?: Partial<Group>;
  onSubmit: (group: Partial<Group>) => Promise<void>;
  onCancel: () => void;
  title: string;
}

const GroupForm = ({ initialData = {}, onSubmit, onCancel, title }: GroupFormProps) => {
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
    <Modal open onClose={onCancel}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
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

interface GroupCreateModalProps {
  onClose: () => void;
  onGroupCreated: () => void;
}
const GroupCreateModal = ({ onClose, onGroupCreated }: GroupCreateModalProps) => {
  const handleSubmit = async (group: Partial<Group>) => {
    await GroupService.createGroup(group);
    onGroupCreated();
  };

  return (
    <GroupForm
      initialData={{ name: '', is_admin: false, is_training_manager: false }}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Create New Group"
    />
  );
};

interface GroupEditModalProps {
  open: boolean;
  onClose: () => void;
  onGroupUpdated: () => void;
  group: Group | null;
}
const GroupEditModal = ({ open, onClose, onGroupUpdated, group }: GroupEditModalProps) => {
  const handleSubmit = async (groupData: Partial<Group>) => {
    if (group && group.id) {
      await GroupService.updateGroup(group.id, groupData);
      onGroupUpdated();
    }
  };

  return (
    <GroupForm
      initialData={group || {}}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title={`Edit Group: ${group?.name || ''}`}
    />
  );
};

interface GroupDetailModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onEditAssignment: (trainingId: number) => void;
  onAddAssignment: () => void;
}
const GroupDetailModal = ({ open, onClose, group, onEditAssignment, onAddAssignment }: GroupDetailModalProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const [assignData, membersData] = await Promise.all([
        GroupService.getGroupAssignments(group.id),
        GroupService.getGroupMembers(group.id),
      ]);
      setAssignments(assignData);
      setMembers(membersData);
    } catch (err) {
      console.error('Failed to fetch group details:', err);
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    if (open && group) void fetchData();
  }, [open, group, fetchData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h5" gutterBottom>
          Group Details: {group?.name || ''}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Stack spacing={3}>
            <Card variant="outlined">
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Assignments</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onAddAssignment}
                >
                  Assign Training
                </Button>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.headerCell}>Training</TableCell>
                      <TableCell sx={styles.headerCell}>Project</TableCell>
                      <TableCell sx={styles.headerCell}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((a) => (
                      <TableRow key={a.training.id}>
                        <TableCell>{a.training.title}</TableCell>
                        <TableCell>{a.project.name}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => onEditAssignment(a.training.id)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <Box sx={styles.headerBox}>
                <Typography variant="h6">Members</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.headerCell}>Name</TableCell>
                      <TableCell sx={styles.headerCell}>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.last_name}, {m.first_name}</TableCell>
                        <TableCell>{m.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
