import { Training } from '~/types/training';
import { AssignedTraining } from '~/types/assignments';
import { User } from '~/types/user';
import { addDays, subDays, format } from 'date-fns';

const today = new Date();

export const getDaysRemaining = (dateString: string | null): number | null => {
  if (!dateString) return null;
  const due = new Date(dateString);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Define mock Trainings
export const mockTrainingList: Training[] = [
  {
    id: 12,
    date: '2020-02-15',
    title: '557WW Critical Information List',
    url: 'https://usaf.dps.mil/sites/10192/Utilities/CCPrograms/OPSEC/OPSEC%20DOC2/SitePages/Home.aspx',
  },
];

// Define mock User
export const mockCurrentUser: User = {
  id: 1,
  email: 'dev@company.com',
  first_name: 'Jane',
  last_name: 'Doe',
  is_active: true,
  is_admin: false,
  is_training_manager: true,
  is_authenticated: true,
  is_anonymous: false,
  groups: [
    { id: 5, name: 'Collateral', is_admin: true, is_training_manager: true },
    { id: 3, name: 'T3R', is_admin: true, is_training_manager: false },
  ],
  supervisor_id: 2,
};

export const mockAssignments: AssignedTraining[] = [
  {
    member: mockCurrentUser,
    assignment: {
      group_id: 1,
      no_nag: false,
      training: {
        id: 101,
        title: 'Cyber Security Basics',
        date: null,
        url: null,
      },
      project: { id: 5, name: 'Primary Project' },
      start_date: format(subDays(today, 60), 'yyyy-MM-dd'),
      end_date: null,
      suspense_date: format(addDays(today, 30), 'yyyy-MM-dd'),
      cadence: 'Annual',
    },
    projects: [
      { id: 5, name: 'Primary Project' },
      { id: 6, name: 'Ops Support' },
    ],
    completion_date: format(subDays(today, 400), 'yyyy-MM-dd'),
    approved_date: format(subDays(today, 399), 'yyyy-MM-dd'),
    due_date: format(subDays(today, 5), 'yyyy-MM-dd'), // OVERDUE (-5 days)
  },
  {
    member: mockCurrentUser,
    assignment: {
      group_id: 1,
      no_nag: false,
      training: {
        id: 102,
        title: 'React Safety Protocols',
        date: null,
        url: null,
      },
      project: { id: 5, name: 'Primary Project' },
      start_date: format(subDays(today, 10), 'yyyy-MM-dd'),
      end_date: null,
      suspense_date: format(addDays(today, 60), 'yyyy-MM-dd'),
      cadence: 'One Time',
    },
    projects: [{ id: 5, name: 'Primary Project' }],
    completion_date: null,
    approved_date: null,
    due_date: format(addDays(today, 15), 'yyyy-MM-dd'), // ALMOST DUE (15 days)
  },
  {
    member: mockCurrentUser,
    assignment: {
      group_id: 1,
      no_nag: true, // NO NAG
      training: {
        id: 103,
        title: 'Optional Knitting Workshop',
        date: null,
        url: null,
      },
      project: { id: 7, name: 'Recreation' },
      start_date: format(subDays(today, 100), 'yyyy-MM-dd'),
      end_date: null,
      suspense_date: format(addDays(today, 100), 'yyyy-MM-dd'),
      cadence: 'Optional',
    },
    projects: [{ id: 7, name: 'Recreation' }],
    completion_date: null,
    approved_date: null,
    due_date: format(addDays(today, 5), 'yyyy-MM-dd'), // Would be overdue, but is "No Nag"
  },
];
