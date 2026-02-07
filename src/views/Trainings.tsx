import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Training } from '~/types/training';
import { mockTrainingList as TestTrainingList } from '~/utilities/testData';

const Trainings: React.FC = () => {
  return (
    <Card elevation={2}>
      <Box
        sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}
      >
        <Typography variant="h6">
          Training List (All Courses in System)
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="training table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Training Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>External URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {TestTrainingList.map((training: Training) => (
                <TableRow key={training.id} hover>
                  <TableCell component="th" scope="row">
                    {training.id}
                  </TableCell>
                  <TableCell>{training.date}</TableCell>
                  <TableCell>
                    <MuiLink
                      component={RouterLink}
                      to={`/training/${training.id}`}
                      underline="hover"
                    >
                      {training.title}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    <MuiLink
                      component="a"
                      href={`${training.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {training.url}
                    </MuiLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Trainings;
