import { render, screen } from '@testing-library/react';
import { TrainingRecordTable } from '../TrainingRecordTable';
import { BrowserRouter } from 'react-router-dom';
import { TrainingEvent } from '~/types/training';

const mockRecord: TrainingEvent[] = [
  {
    id: 1,
    user_id: 1,
    completion_date: '2023-01-01',
    approved_by: null,
    approved_date: null,
    comment: 'Finished',
    certificate_unavailable: true,
    training_certificates: [],
    training: { id: 101, title: 'Safety 101', date: null, url: null },
  },
  {
    id: 2,
    user_id: 1,
    completion_date: '2023-02-01',
    approved_by: null,
    approved_date: null,
    comment: 'Missing cert',
    certificate_unavailable: false,
    training_certificates: [],
    training: { id: 102, title: 'Ethics 101', date: null, url: null },
  },
  {
    id: 3,
    user_id: 1,
    completion_date: '2023-03-01',
    approved_by: 2,
    approved_date: '2023-03-02',
    comment: 'Done',
    certificate_unavailable: false,
    training_certificates: [
      {
        id: 10,
        event_id: 3,
        original_filename: 'cert.pdf',
        upload_date: '2023-03-01',
        storage_key: 'key',
        comment: '',
      },
    ],
    training: { id: 103, title: 'IT Security', date: null, url: null },
  },
];

describe('TrainingRecordTable', () => {
  it('displays correct certificate status', () => {
    render(
      <BrowserRouter>
        <TrainingRecordTable record={mockRecord} />
      </BrowserRouter>
    );

    expect(screen.getByText('unavailable')).toBeInTheDocument();
    expect(screen.getByText('missing')).toBeInTheDocument();
    expect(screen.getByText('certificate')).toBeInTheDocument();
  });

  it('shows edit button only for unapproved records', () => {
    render(
      <BrowserRouter>
        <TrainingRecordTable record={mockRecord} />
      </BrowserRouter>
    );

    // Should have 2 edit buttons (for id 1 and 2)
    // approved_date is null for those
    const editButtons = screen.getAllByRole('button');
    // Note: The table might have other buttons if I added icons as buttons
    // TrainingRecordTable uses IconButton with EditIcon
    expect(editButtons).toHaveLength(2);
  });
});
