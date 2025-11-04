import { list_work_orders } from '@/services/workOrderRPC';
import { WorkOrdersList } from '@/components/work-orders/WorkOrdersList';
import { WorkOrder } from '@/data/workOrderStore';

/**
 * Home page displaying the list of work orders.
 * This is a Server Component that fetches data and passes it to the client component.
 */
export default async function HomePage() {
  let workOrders: WorkOrder[] = [];
  let error: string | null = null;

  try {
    workOrders = await list_work_orders();
  } catch (err) {
    console.error('Error fetching work orders:', err);
    error = err instanceof Error ? err.message : 'Failed to load work orders';
    workOrders = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading work orders
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <WorkOrdersList initialWorkOrders={workOrders} isLoading={false} />
      </div>
    </div>
  );
}
