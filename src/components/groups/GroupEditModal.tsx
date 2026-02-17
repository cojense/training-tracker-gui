import { useCallback, useMemo } from 'react';
import { GroupService } from '~/services/GroupService';
import { Group } from '~/types/user';
import { GroupFormModal } from './GroupFormModal';

interface GroupEditModalProps {
  open: boolean;
  onClose: () => void;
  onGroupUpdated: () => void;
  group: Group | null;
}

export const GroupEditModal = ({
  open,
  onClose,
  onGroupUpdated,
  group,
}: GroupEditModalProps) => {
  const handleSubmit = useCallback(
    async (groupData: Partial<Group>) => {
      if (group?.id) {
        await GroupService.updateGroup(group.id, groupData);
        onGroupUpdated();
      }
    },
    [group?.id, onGroupUpdated]
  );

  const initialData = useMemo(() => group ?? {}, [group]);
  const title = useMemo(
    () => `Edit Group: ${group?.name ?? ''}`,
    [group?.name]
  );

  return (
    <GroupFormModal
      open={open}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onClose}
      title={title}
    />
  );
};
