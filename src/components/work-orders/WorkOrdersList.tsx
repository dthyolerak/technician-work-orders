'use client';

import { useState, useCallback } from 'react';
import { WorkOrder } from '@/data/workOrderStore';
import { WorkOrdersTable } from './WorkOrdersTable';
import { SearchFilter } from './SearchFilter';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

interface WorkOrdersListProps {
  initialWorkOrders: WorkOrder[];
  isLoading?: boolean;
}

/**
 * Main client component for displaying the work orders list.
 * Handles filtering, search, and user interactions.
 */
export function WorkOrdersList({ initialWorkOrders, isLoading = false }: WorkOrdersListProps) {
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleFiltered = useCallback((filtered: WorkOrder[]) => {
    setFilteredWorkOrders(filtered);
  }, []);

  const handleEdit = useCallback((id: string) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit work order:', id);
    // For now, just show an alert
    alert(`Edit functionality for work order ${id} will be implemented next.`);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this work order?')) {
      return;
    }

    setIsDeleting(id);
    try {
      const response = await fetch(`/api/work-orders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete work order');
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting work order:', error);
      alert('Failed to delete work order. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  }, []);

  const handleAddNew = useCallback(() => {
    // TODO: Navigate to create page or open create modal
    console.log('Add new work order');
    // For now, just show an alert
    alert('Create work order functionality will be implemented next.');
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Work Orders
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track technician work orders
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new work order"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Work Order
        </button>
      </div>

      {/* Search and Filter */}
      {initialWorkOrders.length > 0 && (
        <SearchFilter workOrders={initialWorkOrders} onFiltered={handleFiltered} />
      )}

      {/* Results Count */}
      {initialWorkOrders.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredWorkOrders.length} of {initialWorkOrders.length} work order
          {initialWorkOrders.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Table or Empty State */}
      {filteredWorkOrders.length === 0 && initialWorkOrders.length === 0 ? (
        <EmptyState onAddNew={handleAddNew} />
      ) : filteredWorkOrders.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No work orders match your search or filter criteria.
          </p>
        </div>
      ) : (
        <WorkOrdersTable
          workOrders={filteredWorkOrders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Loading overlay for delete operation */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Deleting work order...</p>
          </div>
        </div>
      )}
    </div>
  );
}

