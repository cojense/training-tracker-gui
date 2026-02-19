import { useCallback } from 'react';
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  Paper,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Project } from '~/types/projects';

interface ProjectRowProps {
  project: Project;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}

const ProjectRow = ({ project, onDetails, onEdit }: ProjectRowProps) => {
  const handleDetails = useCallback(
    () => onDetails(project.id),
    [project.id, onDetails]
  );
  const handleEdit = useCallback(
    () => onEdit(project.id),
    [project.id, onEdit]
  );

  return (
    <TableRow hover>
      <TableCell>{project.id}</TableCell>
      <TableCell>{project.name}</TableCell>
      <TableCell>
        <Tooltip title="View Details">
          <IconButton size="small" onClick={handleDetails}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Project">
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

type Order = 'asc' | 'desc';

interface ProjectTableProps {
  projects: Project[];
  orderBy: keyof Project;
  order: Order;
  onRequestSort: (property: keyof Project) => void;
  onDetails: (id: number | null) => void;
  onEdit: (id: number | null) => void;
}

export const ProjectTable = ({
  projects,
  orderBy,
  order,
  onRequestSort,
  onDetails,
  onEdit,
}: ProjectTableProps) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={() => onRequestSort('id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => onRequestSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <ProjectRow
              key={p.id ?? 'new'}
              project={p}
              onDetails={onDetails}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
