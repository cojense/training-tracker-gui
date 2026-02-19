import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  CircularProgress,
  Modal,
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { User, Group } from '~/types/user';
import { UserService } from '~/services/UserService';
import { GroupService } from '~/services/GroupService';
import { useNotification } from '~/hooks/useNotification';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  borderRadius: '12px',
  bgcolor: 'background.paper',
  border: 2, borderColor: 'divider',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface UserGroupsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

export const UserGroupsModal = ({ user, open, onClose, onSaveSuccess }: UserGroupsModalProps) => {
  const { showNotification } = useNotification();
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [memberGroupIds, setMemberGroupIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [groupsData, userGroupsData] = await Promise.all([
        GroupService.getGroups(),
        UserService.getUserGroups(user.id),
      ]);

      setAllGroups(groupsData);
      setMemberGroupIds(
        new Set(userGroupsData.map((g) => g.id as unknown as number))
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('Could not load group details.', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [user, showNotification, onClose]);

  useEffect(() => {
    if (open && user) {
      void fetchData();
    }
  }, [open, user, fetchData]);

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

  const handleSave = useCallback(async () => {
    if (!user) return;
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

      await UserService.updateUserGroups(user.id, groupStates);
      showNotification('Group memberships updated successfully!', 'success');
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update groups:', error);
      showNotification('Failed to update group memberships.', 'error');
    } finally {
      setSaving(false);
    }
  }, [user, allGroups, memberGroupIds, showNotification, onClose, onSaveSuccess]);

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Change Group Membership
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              For user: {user.first_name} {user.last_name} ({user.email})
            </Typography>
            <Card elevation={2}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
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
                          onChange={() => handleToggleGroup(group.id as unknown as number)}
                        />
                      }
                      label={group.name}
                    />
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button onClick={onClose} disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    onClick={() => void handleSave()}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Modal>
  );
};
