import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';
import { GroupFormModal } from './GroupFormModal';

interface GroupCreateModalProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
}

export const GroupCreateModal = ({ open, onClose, onGroupCreated }: GroupCreateModalProps) => {
  const handleSubmit = async (group: Partial<Group>) => {
    await GroupService.createGroup(group);
    onGroupCreated();
  };

  return (
    <GroupFormModal
      open={open}
      initialData={{ name: '', is_admin: false, is_training_manager: false }}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Create New Group"
    />
  );
};
