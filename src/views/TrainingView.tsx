import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
} from '@mui/material';
import { TestTrainingList } from '../testData';
import { TrainingCourse } from '../types';

const TrainingView = () => {
  return (
    <>
      <Typography>Training List</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="training table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Training Name</TableCell>
              <TableCell>Training Link</TableCell>
              <TableCell>External URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TestTrainingList.map((course: TrainingCourse) => (
              <TableRow key={course.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {course.id}
                </TableCell>
                <TableCell>{course.date}</TableCell>
                <TableCell>{course.training_name}</TableCell>
                <TableCell>
                  <Link href={course.training_link} target="_blank" rel="noopener">
                    View Training
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={course.external_url} target="_blank" rel="noopener">
                    View External Link
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TrainingView;
