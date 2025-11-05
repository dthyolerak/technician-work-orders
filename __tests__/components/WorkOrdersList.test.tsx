import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkOrdersList } from '@/components/work-orders/WorkOrdersList';
import { WorkOrder } from '@/data/workOrderStore';
import { useRouter } from 'next/navigation';

// Get the mocked router
const mockPush = jest.fn();
const mockRefresh = jest.fn();

const mockRouter = {
  push: mockPush,
  refresh: mockRefresh,
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

describe('WorkOrdersList Component', () => {
  const mockWorkOrders: WorkOrder[] = [
    {
      id: '1',
      title: 'HVAC System Maintenance',
      description: 'Perform routine maintenance on the central air conditioning unit.',
      priority: 'High',
      status: 'Open',
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Electrical Panel Inspection',
      description: 'Complete quarterly inspection of the main electrical panel.',
      priority: 'Medium',
      status: 'In Progress',
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockRefresh.mockClear();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn() as jest.Mock;
  });

  it('renders work orders list correctly', () => {
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    expect(screen.getByText('Work Orders')).toBeInTheDocument();
    expect(screen.getByText('HVAC System Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Electrical Panel Inspection')).toBeInTheDocument();
  });

  it('renders empty state when no work orders exist', () => {
    render(<WorkOrdersList initialWorkOrders={[]} />);

    expect(screen.getByText('No work orders found')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first work order.')).toBeInTheDocument();
  });

  it('displays correct work order count', () => {
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    expect(screen.getByText(/Showing 2 of 2 work orders/i)).toBeInTheDocument();
  });

  it('navigates to create page when Add Work Order button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    const addButton = screen.getByRole('button', { name: /add work order/i });
    await user.click(addButton);

    expect(mockPush).toHaveBeenCalledWith('/work-orders/new');
  });

  it('navigates to edit page when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/work-orders/1/edit');
  });

  it('opens delete confirmation modal when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Delete Work Order')).toBeInTheDocument();
    expect(screen.getByText(/HVAC System Maintenance/i)).toBeInTheDocument();
  });

  it('deletes work order when confirmed in modal', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Work order deleted successfully' }),
    });

    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/work-orders/1', {
        method: 'DELETE',
      });
    });

    expect(mockRefresh).toHaveBeenCalled();
  });

  it('filters work orders by status', async () => {
    const user = userEvent.setup();
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    const statusFilter = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(statusFilter, 'In Progress');

    await waitFor(() => {
      expect(screen.getByText('Electrical Panel Inspection')).toBeInTheDocument();
      expect(screen.queryByText('HVAC System Maintenance')).not.toBeInTheDocument();
    });
  });

  it('searches work orders by title', async () => {
    const user = userEvent.setup();
    render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

    const searchInput = screen.getByLabelText(/search work orders/i);
    await user.type(searchInput, 'HVAC');

    await waitFor(() => {
      expect(screen.getByText('HVAC System Maintenance')).toBeInTheDocument();
      expect(screen.queryByText('Electrical Panel Inspection')).not.toBeInTheDocument();
    });
  });
});

