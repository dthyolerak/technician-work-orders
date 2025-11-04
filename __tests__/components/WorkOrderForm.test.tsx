import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => mockRouter),
}));

describe('WorkOrderForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
    mockRefresh.mockClear();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn() as jest.Mock;
  });

  describe('Create Mode', () => {
    it('renders create form with all required fields', () => {
      render(<WorkOrderForm mode="create" />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument(); // Status hidden in create mode
      expect(screen.getByRole('button', { name: /create work order/i })).toBeInTheDocument();
    });

    it('validates required fields on submit', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('validates title length', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'A'); // Too short

      await user.tab(); // Trigger blur validation

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('validates description length', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'Short'); // Too short

      await user.tab(); // Trigger blur validation

      await waitFor(() => {
        expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('successfully creates a work order', async () => {
      const user = userEvent.setup();
      const mockWorkOrder: WorkOrder = {
        id: 'new-id',
        title: 'New Work Order',
        description: 'This is a test description that meets the minimum length requirement.',
        priority: 'High',
        status: 'Open',
        updatedAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ data: mockWorkOrder }),
      });

      render(<WorkOrderForm mode="create" />);

      // Fill in the form
      await user.type(screen.getByLabelText(/title/i), 'New Work Order');
      await user.type(
        screen.getByLabelText(/description/i),
        'This is a test description that meets the minimum length requirement.'
      );
      await user.selectOptions(screen.getByLabelText(/priority/i), 'High');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/work order created successfully/i)).toBeInTheDocument();
      });

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Work Order',
          description: 'This is a test description that meets the minimum length requirement.',
          priority: 'High',
          status: 'Open',
        }),
      });
    });

    it('displays server validation errors', async () => {
      const user = userEvent.setup();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          message: 'title: Title must be at least 2 characters',
          details: [
            { path: ['title'], message: 'Title must be at least 2 characters' },
          ],
        }),
      });

      render(<WorkOrderForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), 'A');
      await user.type(
        screen.getByLabelText(/description/i),
        'This is a valid description that meets the minimum length requirement.'
      );

      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    const existingWorkOrder: Partial<WorkOrder> = {
      title: 'Existing Work Order',
      description: 'This is an existing work order description that meets requirements.',
      priority: 'Medium',
      status: 'In Progress',
    };

    it('renders edit form with pre-filled data and status field', () => {
      render(
        <WorkOrderForm
          mode="edit"
          workOrderId="123"
          initialData={existingWorkOrder}
        />
      );

      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Work Order');
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        'This is an existing work order description that meets requirements.'
      );
      expect(screen.getByLabelText(/priority/i)).toHaveValue('Medium');
      expect(screen.getByLabelText(/status/i)).toHaveValue('In Progress'); // Status visible in edit mode
      expect(screen.getByRole('button', { name: /update work order/i })).toBeInTheDocument();
    });

    it('successfully updates a work order', async () => {
      const user = userEvent.setup();
      const updatedWorkOrder: WorkOrder = {
        id: '123',
        title: 'Updated Work Order',
        description: 'This is an updated description that meets all requirements.',
        priority: 'High',
        status: 'Done',
        updatedAt: new Date().toISOString(),
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: updatedWorkOrder }),
      });

      render(
        <WorkOrderForm
          mode="edit"
          workOrderId="123"
          initialData={existingWorkOrder}
        />
      );

      // Update the form
      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Work Order');

      await user.selectOptions(screen.getByLabelText(/status/i), 'Done');
      await user.selectOptions(screen.getByLabelText(/priority/i), 'High');

      // Submit
      const submitButton = screen.getByRole('button', { name: /update work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/work order updated successfully/i)).toBeInTheDocument();
      });

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith('/api/work-orders/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Updated Work Order'),
      });
    });

    it('cancels edit and navigates back', async () => {
      const user = userEvent.setup();
      render(
        <WorkOrderForm
          mode="edit"
          workOrderId="123"
          initialData={existingWorkOrder}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('clears field errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'A');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });

      // Clear error by typing more
      await user.type(titleInput, 'Valid Title');

      await waitFor(() => {
        expect(screen.queryByText(/title must be at least 2 characters/i)).not.toBeInTheDocument();
      });
    });

    it('shows character count for description', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'Test description');

      expect(screen.getByText(/16\/500 characters/i)).toBeInTheDocument();
    });
  });
});

