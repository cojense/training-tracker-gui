import React, { useEffect, useState, useCallback } from 'react';
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

export const ChangeGroupMembershipView: React.FC = () => {
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

  const handleToggleGroup = (groupId: number) => {
    const nextSet = new Set(memberGroupIds);
    if (nextSet.has(groupId)) {
      nextSet.delete(groupId);
    } else {
      nextSet.add(groupId);
    }
    setMemberGroupIds(nextSet);
  };

  const handleSave = async () => {
    if (!id) return;
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

  const handleCancel = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Change Group Membership
      </Typography>
      {user && (
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          For user: {user.first_name} {user.last_name} ({user.email})
        </Typography>
      )}
      <Card elevation={2}>
        <Box
          sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Typography variant="h6">Available Groups</Typography>
        </Box>
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            {allGroups.map((group) => (
              <FormControlLabel
                key={group.id}
                control={
                  <Checkbox
                    checked={memberGroupIds.has(group.id as unknown as number)}
                    onChange={() =>
                      handleToggleGroup(group.id as unknown as number)
                    }
                  />
                }
                label={group.name}
              />
            ))}
          </Stack>

          <Box
            sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}
          >
            <Button onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              loading={saving}
              onClick={() => {
                void handleSave();
              }}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
