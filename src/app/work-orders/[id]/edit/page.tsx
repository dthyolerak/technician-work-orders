import { get_work_order } from '@/services/workOrderRPC';
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm';
import { notFound } from 'next/navigation';

interface EditWorkOrderPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit work order page.
 * Fetches the work order data and displays the edit form.
 */
export default async function EditWorkOrderPage({ params }: EditWorkOrderPageProps) {
  const { id } = await params;

  let workOrder;
  try {
    workOrder = await get_work_order(id);
  } catch (error) {
    console.error('Error fetching work order:', error);
    notFound();
  }

  if (!workOrder) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Edit Work Order
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update the details below to modify this work order.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <WorkOrderForm
            mode="edit"
            workOrderId={id}
            initialData={{
              title: workOrder.title,
              description: workOrder.description,
              priority: workOrder.priority,
              status: workOrder.status,
            }}
          />
        </div>
      </div>
    </div>
  );
}

