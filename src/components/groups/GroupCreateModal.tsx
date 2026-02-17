import { useCallback } from 'react';
import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';
import { GroupFormModal } from './GroupFormModal';

interface GroupCreateModalProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
}

const initialData = { name: '', is_admin: false, is_training_manager: false };

export const GroupCreateModal = ({
  open,
  onClose,
  onGroupCreated,
}: GroupCreateModalProps) => {
  const handleSubmit = useCallback(
    async (group: Partial<Group>) => {
      await GroupService.createGroup(group);
      onGroupCreated();
    },
    [onGroupCreated]
  );

  return (
    <GroupFormModal
      open={open}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Create New Group"
    />
  );
};
