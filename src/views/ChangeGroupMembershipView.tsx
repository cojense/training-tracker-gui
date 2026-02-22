import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
} from '@mui/material';
import { api } from '~/utilities/api';
import { useNotification } from '~/utilities/NotificationContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Group, User } from '~/types/user';

const styles = {
  container: { maxWidth: 600, mx: 'auto', mt: 4 },
  headerBox: { p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' },
  buttonContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    mt: 3,
  },
  centeredBox: { display: 'flex', justifyContent: 'center', py: 8 },
};

interface GroupCheckboxProps {
  group: Group;
  isMember: boolean;
  onToggle: (id: number) => void;
}

const GroupCheckbox = ({ group, isMember, onToggle }: GroupCheckboxProps) => {
  const handleChange = useCallback(
    () => onToggle(group.id as unknown as number),
    [group.id, onToggle]
  );

  return (
    <FormControlLabel
      control={<Checkbox checked={isMember} onChange={handleChange} />}
      label={group.name}
    />
  );
};

export const ChangeGroupMembershipView = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [memberGroupIds, setMemberGroupIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const userData = await api.getUser(id);
      const groupsData = await api.getGroups();
      const userGroupsData = await api.getUserGroups(id);

      setUser(userData);
      setAllGroups(groupsData);
      setMemberGroupIds(
        new Set(userGroupsData.map((g) => g.id as unknown as number))
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('Could not load group details.', 'error');
      void navigate('/users');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification, navigate]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleToggleGroup = useCallback((groupId: number) => {
    setMemberGroupIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(groupId)) {
        nextSet.delete(groupId);
      } else {
        nextSet.add(groupId);
      }
      return nextSet;
    });
  }, []);

  const handleSave = useCallback((): void => {
    if (!id) return;

    const executeSave = async () => {
      try {
        setSaving(true);
        const groupStates: Record<number, boolean> = {};
        allGroups.forEach((g) => {
          if (g.id !== null) {
            groupStates[g.id as unknown as number] = memberGroupIds.has(
              g.id as unknown as number
            );
          }
        });

        await api.updateUserGroups(id, groupStates);
        showNotification('Group memberships updated successfully!', 'success');
        void navigate('/profile');
      } catch (error) {
        console.error('Failed to update groups:', error);
        showNotification('Failed to update group memberships.', 'error');
      } finally {
        setSaving(false);
      }
    };

    void executeSave();
  }, [id, allGroups, memberGroupIds, showNotification, navigate]);

  const handleCancel = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

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
        Change Group Membership
      </Typography>
      {user && (
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          For user: {user.first_name} {user.last_name} ({user.email})
        </Typography>
      )}
      <Card elevation={2}>
        <Box sx={styles.headerBox}>
          <Typography variant="h6">Available Groups</Typography>
        </Box>
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            {allGroups.map((group) => (
              <GroupCheckbox
                key={group.id}
                group={group}
                isMember={memberGroupIds.has(group.id as unknown as number)}
                onToggle={handleToggleGroup}
              />
            ))}
          </Stack>

          <Box sx={styles.buttonContainer}>
            <Button onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
