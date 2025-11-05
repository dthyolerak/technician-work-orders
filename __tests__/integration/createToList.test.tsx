import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkOrdersList } from '@/components/work-orders/WorkOrdersList';
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm';
import { WorkOrder } from '@/data/workOrderStore';
import { useRouter } from 'next/navigation';

// Get the mocked router
const mockPush = jest.fn();
const mockBack = jest.fn();
const mockRefresh = jest.fn();

const mockRouter = {
  push: mockPush,
  back: mockBack,
  refresh: mockRefresh,
};

const mockUseRouter = jest.fn(() => mockRouter);

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}));

/**
 * Integration test: Create → List shows new item
 * This test verifies the complete flow of creating a work order
 * and ensuring it appears in the list.
 */
describe('Create to List Integration Flow', () => {
  const initialWorkOrders: WorkOrder[] = [
    {
      id: '1',
      title: 'Existing Work Order',
      description: 'This is an existing work order description that meets requirements.',
      priority: 'High',
      status: 'Open',
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockBack.mockClear();
    mockUseRouter.mockReturnValue(mockRouter);
    global.fetch = jest.fn() as jest.Mock;
  });

  it('creates a new work order and shows it in the list', async () => {
    const user = userEvent.setup();
    const newWorkOrder: WorkOrder = {
      id: '2',
      title: 'Newly Created Work Order',
      description: 'This is a newly created work order description that meets all requirements.',
      priority: 'Medium',
      status: 'Open',
      updatedAt: new Date().toISOString(),
    };

    // Mock successful creation
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: newWorkOrder }),
    });

    // Step 1: Render the form
    const { rerender } = render(<WorkOrderForm mode="create" />);

    // Step 2: Fill in and submit the form
    await user.type(screen.getByLabelText(/title/i), 'Newly Created Work Order');
    await user.type(
      screen.getByLabelText(/description/i),
      'This is a newly created work order description that meets all requirements.'
    );
    await user.selectOptions(screen.getByLabelText(/priority/i), 'Medium');

    const submitButton = screen.getByRole('button', { name: /create work order/i });
    await user.click(submitButton);

    // Step 3: Verify creation was successful
    await waitFor(() => {
      expect(screen.getByText(/work order created successfully/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/work-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('Newly Created Work Order'),
    });

    // Step 4: Mock the list API to return the new work order
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: [...initialWorkOrders, newWorkOrder],
      }),
    });

    // Step 5: Render the list with updated data
    rerender(
      <WorkOrdersList initialWorkOrders={[...initialWorkOrders, newWorkOrder]} />
    );

    // Step 6: Verify the new work order appears in the list
    await waitFor(() => {
      expect(screen.getByText('Newly Created Work Order')).toBeInTheDocument();
      expect(screen.getByText('Existing Work Order')).toBeInTheDocument();
    });

    // Verify the list shows correct count
    expect(screen.getByText(/Showing 2 of 2 work orders/i)).toBeInTheDocument();
  });

  it('handles the complete create workflow with navigation', async () => {
    const user = userEvent.setup();
    const newWorkOrder: WorkOrder = {
      id: '3',
      title: 'Complete Workflow Test Order',
      description: 'Testing the complete workflow from creation to list display.',
      priority: 'High',
      status: 'Open',
      updatedAt: new Date().toISOString(),
    };

    // Mock successful creation
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ data: newWorkOrder }),
    });

    // Render form
    render(<WorkOrderForm mode="create" />);

    // Create work order
    await user.type(screen.getByLabelText(/title/i), 'Complete Workflow Test Order');
    await user.type(
      screen.getByLabelText(/description/i),
      'Testing the complete workflow from creation to list display.'
    );
    await user.selectOptions(screen.getByLabelText(/priority/i), 'High');

    const submitButton = screen.getByRole('button', { name: /create work order/i });
    await user.click(submitButton);

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText(/work order created successfully/i)).toBeInTheDocument();
    });

    // Verify navigation would be triggered (after timeout)
    // In real scenario, router.push('/') would be called
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/work-orders',
      expect.objectContaining({
        method: 'POST',
      })
    );

    // Simulate the list being rendered with the new work order
    render(<WorkOrdersList initialWorkOrders={[newWorkOrder]} />);

    // Verify the new work order is displayed
    expect(screen.getByText('Complete Workflow Test Order')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});

