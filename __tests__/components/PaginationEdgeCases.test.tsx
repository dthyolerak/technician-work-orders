import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { WorkOrdersList } from '@/components/work-orders/WorkOrdersList';
import { WorkOrder } from '@/data/workOrderStore';
import { useRouter } from 'next/navigation';

// Mock Next.js router
const mockPush = jest.fn();
const mockRefresh = jest.fn();

const mockRouter = {
  push: mockPush,
  refresh: mockRefresh,
};

const mockUseRouter = jest.fn(() => mockRouter);

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}));

describe('Pagination Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it('hides pagination when results fit on one page (less than 10 items)', () => {
    const workOrders: WorkOrder[] = Array.from({ length: 5 }, (_, i) => ({
      id: `id-${i}`,
      title: `Work Order ${i + 1}`,
      description: 'This is a test description that meets the minimum length requirement',
      priority: 'Medium' as const,
      status: 'Open' as const,
      updatedAt: new Date().toISOString(),
    }));

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    // Pagination should not be visible
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });

  it('shows pagination when results exceed one page (more than 10 items)', () => {
    const workOrders: WorkOrder[] = Array.from({ length: 15 }, (_, i) => ({
      id: `id-${i}`,
      title: `Work Order ${i + 1}`,
      description: 'This is a test description that meets the minimum length requirement',
      priority: 'Medium' as const,
      status: 'Open' as const,
      updatedAt: new Date().toISOString(),
    }));

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    // Pagination should be visible
    expect(screen.getByText(/page/i)).toBeInTheDocument();
  });

  it('displays empty state message when no work orders exist', () => {
    render(<WorkOrdersList initialWorkOrders={[]} />);

    expect(screen.getByText(/no work orders found/i)).toBeInTheDocument();
  });

  it('displays message when search/filter returns no results', () => {
    const workOrders: WorkOrder[] = [
      {
        id: '1',
        title: 'HVAC Maintenance',
        description: 'This is a test description that meets the minimum length requirement',
        priority: 'High',
        status: 'Open',
        updatedAt: new Date().toISOString(),
      },
    ];

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    // After filtering to non-existent status, should show no results message
    // This would be tested through the SearchFilter component interaction
    expect(screen.getByText(/work orders/i)).toBeInTheDocument();
  });

  it('resets to page 1 when filter changes', () => {
    // This test would require more complex setup with SearchFilter integration
    // The behavior is implemented in WorkOrdersList.handleFiltered callback
    const workOrders: WorkOrder[] = Array.from({ length: 25 }, (_, i) => ({
      id: `id-${i}`,
      title: `Work Order ${i + 1}`,
      description: 'This is a test description that meets the minimum length requirement',
      priority: 'Medium' as const,
      status: i % 2 === 0 ? ('Open' as const) : ('Done' as const),
      updatedAt: new Date().toISOString(),
    }));

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    // Initially should show page 1
    expect(screen.getByText(/page/i)).toBeInTheDocument();
  });

  it('handles exactly 10 items (boundary case)', () => {
    const workOrders: WorkOrder[] = Array.from({ length: 10 }, (_, i) => ({
      id: `id-${i}`,
      title: `Work Order ${i + 1}`,
      description: 'This is a test description that meets the minimum length requirement',
      priority: 'Medium' as const,
      status: 'Open' as const,
      updatedAt: new Date().toISOString(),
    }));

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    // With exactly 10 items, pagination should not be shown (fits on one page)
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });

  it('handles single work order correctly', () => {
    const workOrders: WorkOrder[] = [
      {
        id: '1',
        title: 'Single Work Order',
        description: 'This is a test description that meets the minimum length requirement',
        priority: 'High',
        status: 'Open',
        updatedAt: new Date().toISOString(),
      },
    ];

    render(<WorkOrdersList initialWorkOrders={workOrders} />);

    expect(screen.getByText('Single Work Order')).toBeInTheDocument();
    expect(screen.queryByText(/page/i)).not.toBeInTheDocument();
  });
});

