import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';
import { AssignmentEditModal } from '~/components/trainings/AssignmentEditModal';
import { TrainingAssignModal } from '~/components/trainings/TrainingAssignModal';
import { GroupCreateModal } from '~/components/groups/GroupCreateModal';
import { GroupEditModal } from '~/components/groups/GroupEditModal';
import { GroupDetailModal } from '~/components/groups/GroupDetailModal';
import { GroupTable } from '~/components/groups/GroupTable';

const textFieldProps = {
  input: {
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    ),
  },
};

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
  errorBox: { p: 2 },
  searchField: {
    bgcolor: 'background.paper',
    borderRadius: 1,
    width: { xs: '100%', sm: 250 },
  },
  headerControls: { display: 'flex', gap: 2, alignItems: 'center' },
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

  const [editAssignment, setEditAssignment] = useState<{
    groupId: number;
    trainingId: number;
  } | null>(null);
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

  const handleRequestSort = useCallback(
    (property: keyof Group) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [orderBy, order]
  );

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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleDetailEditAssignment = useCallback(
    (trainingId: number | null) => {
      if (selectedGroup?.id != null && trainingId != null) {
        setEditAssignment({ groupId: selectedGroup.id, trainingId });
      } else {
        setEditAssignment(null);
      }
    },
    [selectedGroup]
  );

  const handleAddAssignment = useCallback(() => {
    setAssignGroup(selectedGroup);
  }, [selectedGroup]);

  const handleCloseEditAssignment = useCallback(() => {
    setEditAssignment(null);
  }, []);

  const handleCloseAssignGroup = useCallback(() => {
    setAssignGroup(null);
  }, []);

  return (
    <>
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Groups Management</Typography>
          <Box sx={styles.headerControls}>
            <TextField
              size="small"
              placeholder="Search groups..."
              value={search}
              onChange={handleSearchChange}
              sx={styles.searchField}
              slotProps={textFieldProps}
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
            <GroupTable
              groups={filteredGroups}
              orderBy={orderBy}
              order={order}
              onRequestSort={handleRequestSort}
              onDetails={handleDetailsClick}
              onEdit={handleEditClick}
            />
          )}
        </CardContent>
      </Card>

      <GroupCreateModal
        open={openCreateModal}
        onClose={handleCloseModal}
        onGroupCreated={handleCloseModal}
      />

      <GroupEditModal
        open={openEditModal}
        onClose={handleCloseModal}
        onGroupUpdated={handleCloseModal}
        group={selectedGroup}
      />

      <GroupDetailModal
        open={openDetailModal}
        onClose={handleCloseModal}
        group={selectedGroup}
        onEditAssignment={handleDetailEditAssignment}
        onAddAssignment={handleAddAssignment}
      />

      <AssignmentEditModal
        open={!!editAssignment}
        onClose={handleCloseEditAssignment}
        groupId={editAssignment?.groupId ?? null}
        trainingId={editAssignment?.trainingId ?? null}
        onSaveSuccess={handleCloseModal}
      />

      <TrainingAssignModal
        open={!!assignGroup}
        onClose={handleCloseAssignGroup}
        group={assignGroup}
        onSaveSuccess={handleCloseModal}
      />
    </>
  );
};
