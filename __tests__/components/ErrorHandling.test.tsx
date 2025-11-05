import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm';
import { WorkOrdersList } from '@/components/work-orders/WorkOrdersList';
import { WorkOrder } from '@/data/workOrderStore';
import { useRouter } from 'next/navigation';

// Mock Next.js router
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

describe('Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockBack.mockClear();
    mockRefresh.mockClear();
    mockUseRouter.mockReturnValue(mockRouter);
    global.fetch = jest.fn() as jest.Mock;
  });

  describe('API Error Scenarios', () => {
    it('displays network error when fetch fails', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      render(<WorkOrderForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), 'Test Work Order');
      await user.type(
        screen.getByLabelText(/description/i),
        'This is a test description that meets the minimum length requirement'
      );
      await user.selectOptions(screen.getByLabelText(/priority/i), 'High');

      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
      });
    });

    it('handles 500 server errors gracefully', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Internal server error',
          message: 'Something went wrong on the server',
        }),
      });

      render(<WorkOrderForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), 'Test Work Order');
      await user.type(
        screen.getByLabelText(/description/i),
        'This is a test description that meets the minimum length requirement'
      );
      await user.selectOptions(screen.getByLabelText(/priority/i), 'High');

      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
      });
    });

    it('displays field-level errors from server validation', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: [
            { path: ['title'], message: 'Title must be at least 2 characters' },
            { path: ['description'], message: 'Description must be at least 10 characters' },
          ],
        }),
      });

      render(<WorkOrderForm mode="create" />);

      await user.type(screen.getByLabelText(/title/i), 'T');
      await user.type(screen.getByLabelText(/description/i), 'Short');

      const submitButton = screen.getByRole('button', { name: /create work order/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
        expect(
          screen.getByText(/description must be at least 10 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('handles 404 errors when work order not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          error: 'Work order not found',
        }),
      });

      render(<WorkOrderForm mode="edit" workOrderId="non-existent-id" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Form Error Clearing', () => {
    it('clears field error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'T');
      await user.tab(); // Blur to trigger validation

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });

      // Start typing again - error should clear
      await user.type(titleInput, 'es');
      await waitFor(() => {
        expect(screen.queryByText(/title must be at least 2 characters/i)).not.toBeInTheDocument();
      });
    });

    it('validates field on blur', async () => {
      const user = userEvent.setup();
      render(<WorkOrderForm mode="create" />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'T');
      await user.tab(); // Blur

      await waitFor(() => {
        expect(screen.getByText(/title must be at least 2 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('List Component Error Handling', () => {
    const mockWorkOrders: WorkOrder[] = [
      {
        id: '1',
        title: 'Test Work Order',
        description: 'This is a test description that meets requirements',
        priority: 'High',
        status: 'Open',
        updatedAt: new Date().toISOString(),
      },
    ];

    it('handles delete API errors gracefully', async () => {
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Failed to delete' }),
      });

      // Mock window.alert
      window.alert = jest.fn();

      render(<WorkOrdersList initialWorkOrders={mockWorkOrders} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('Failed to delete')
        );
      });
    });
  });
});

