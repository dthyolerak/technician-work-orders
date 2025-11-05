'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrder } from '@/data/workOrderStore';
import { WorkOrdersTable } from './WorkOrdersTable';
import { SearchFilter } from './SearchFilter';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Pagination } from './Pagination';
import { t } from '@/lib/i18n';

interface WorkOrdersListProps {
  initialWorkOrders: WorkOrder[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

/**
 * Main client component for displaying the work orders list.
 * Handles filtering, search, pagination, and user interactions.
 */
export function WorkOrdersList({ initialWorkOrders, isLoading = false }: WorkOrdersListProps) {
  const router = useRouter();
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFiltered = useCallback((filtered: WorkOrder[]) => {
    setFilteredWorkOrders(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Paginate filtered results
  const paginatedWorkOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredWorkOrders.slice(startIndex, endIndex);
  }, [filteredWorkOrders, currentPage]);

  const totalPages = Math.ceil(filteredWorkOrders.length / ITEMS_PER_PAGE);

  const handleEdit = useCallback((id: string) => {
    router.push(`/work-orders/${id}/edit`);
  }, [router]);

  const handleDeleteClick = useCallback((id: string, title: string) => {
    setWorkOrderToDelete({ id, title });
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!workOrderToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/work-orders/${workOrderToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete work order');
      }

      // Close modal and refresh
      setDeleteModalOpen(false);
      setWorkOrderToDelete(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting work order:', error);
      alert('Failed to delete work order. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }, [workOrderToDelete, router]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setWorkOrderToDelete(null);
  }, []);

  const handleAddNew = useCallback(() => {
    router.push('/work-orders/new');
  }, [router]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('workOrders')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track technician work orders
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={t('addWorkOrder')}
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t('addWorkOrder')}
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
        <>
          <WorkOrdersTable
            workOrders={paginatedWorkOrders}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredWorkOrders.length}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {workOrderToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          workOrderTitle={workOrderToDelete.title}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

