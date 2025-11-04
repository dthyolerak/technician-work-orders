'use client';

import { WorkOrder } from '@/data/workOrderStore';
import { WorkOrderTableHeader } from './WorkOrderTableHeader';
import { WorkOrderTableRow } from './WorkOrderTableRow';

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Table component for displaying work orders.
 * Supports keyboard navigation and is fully responsive.
 */
export function WorkOrdersTable({ workOrders, onEdit, onDelete }: WorkOrdersTableProps) {
  if (workOrders.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table
        className="w-full min-w-[640px] border-collapse"
        role="table"
        aria-label="Work orders table"
      >
        <WorkOrderTableHeader />
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {workOrders.map((workOrder) => (
            <WorkOrderTableRow
              key={workOrder.id}
              workOrder={workOrder}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

