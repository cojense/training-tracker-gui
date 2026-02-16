import { useCallback } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';

interface ActiveStatusSwitchProps {
  field: ControllerRenderProps<any, 'is_active'>;
}

export const ActiveStatusSwitch = ({ field }: ActiveStatusSwitchProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(!!e.target.checked);
    },
    [field]
  );

  return (
    <FormControlLabel
      control={<Switch checked={!!field.value} onChange={handleChange} />}
      label="Active Status"
    />
  );
};
