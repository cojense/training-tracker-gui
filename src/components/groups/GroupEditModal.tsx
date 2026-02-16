import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';
import { GroupFormModal } from './GroupFormModal';

interface GroupEditModalProps {
  open: boolean;
  onClose: () => void;
  onGroupUpdated: () => void;
  group: Group | null;
}

export const GroupEditModal = ({ open, onClose, onGroupUpdated, group }: GroupEditModalProps) => {
  const handleSubmit = async (groupData: Partial<Group>) => {
    if (group && group.id) {
      await GroupService.updateGroup(group.id, groupData);
      onGroupUpdated();
    }
  };

  return (
    <GroupFormModal
      open={open}
      initialData={group || {}}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title={`Edit Group: ${group?.name || ''}`}
    />
  );
};
