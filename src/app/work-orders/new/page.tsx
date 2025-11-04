import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm';

/**
 * Create new work order page.
 */
export default function NewWorkOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Work Order
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to create a new work order.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <WorkOrderForm mode="create" />
        </div>
      </div>
    </div>
  );
}

