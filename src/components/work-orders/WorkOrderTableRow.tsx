'use client';

import { useRouter } from 'next/navigation';
import { WorkOrder } from '@/data/workOrderStore';
import { formatDistanceToNow } from 'date-fns';

interface WorkOrderTableRowProps {
  workOrder: WorkOrder;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

/**
 * Individual table row component for a work order.
 * Displays work order data with formatted dates and priority/status badges.
 */
export function WorkOrderTableRow({ workOrder, onEdit, onDelete }: WorkOrderTableRowProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/work-orders/${workOrder.id}`);
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Done':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <tr
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
      tabIndex={0}
      role="row"
      aria-label={`Work order: ${workOrder.title}`}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick(e as any);
        }
      }}
    >
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 sm:px-6">
        <div className="max-w-xs truncate" title={workOrder.title}>
          {workOrder.title}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(workOrder.priority)}`}
        >
          {workOrder.priority}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(workOrder.status)}`}
        >
          {workOrder.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
        {formatDate(workOrder.updatedAt)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(workOrder.id)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label={`Edit work order: ${workOrder.title}`}
            tabIndex={0}
          >
            Edit
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => onDelete(workOrder.id, workOrder.title)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            aria-label={`Delete work order: ${workOrder.title}`}
            tabIndex={0}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

