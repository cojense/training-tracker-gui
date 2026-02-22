import { Theme, alpha } from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';
import { AssignedTraining } from '~/types/assignments';

/**
 * Calculates the background color for a row based on the training assignment status.
 * Consistent with legacy Flask UI behavior.
 */
export const getStatusBackgroundColor = (
  assignment: AssignedTraining,
  theme: Theme,
  now: Date = new Date()
): string => {
  if (assignment.assignment.no_nag) {
    // Gray for No Nag
    return theme.palette.mode === 'light' ? '#bae6fd' : '#1e3a5f';
  }

  if (assignment.due_date) {
    const daysUntilDue = differenceInDays(parseISO(assignment.due_date), now);

    if (daysUntilDue <= 0) {
      // Red for overdue
      return alpha(theme.palette.error.main, 0.2);
    }

    if (daysUntilDue <= 30) {
      // Yellow for almost due
      return alpha(theme.palette.warning.main, 0.2);
    }
  }

  return 'inherit';
};
