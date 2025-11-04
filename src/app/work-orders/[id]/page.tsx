import { get_work_order } from '@/services/workOrderRPC';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface WorkOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Work order detail page.
 * Displays full information about a single work order.
 */
export default async function WorkOrderDetailPage({ params }: WorkOrderDetailPageProps) {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        absolute: date.toLocaleString(),
      };
    } catch {
      return {
        relative: dateString,
        absolute: dateString,
      };
    }
  };

  const dateInfo = formatDate(workOrder.updatedAt);

  const getPriorityColor = (priority: typeof workOrder.priority) => {
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

  const getStatusColor = (status: typeof workOrder.status) => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Work Orders
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Work Order Details
            </h1>
          </div>
          <Link
            href={`/work-orders/${id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Edit
          </Link>
        </div>

        {/* Detail Card */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Title */}
            <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {workOrder.title}
              </h2>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </h3>
              <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {workOrder.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Priority */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </h3>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(workOrder.priority)}`}
                >
                  {workOrder.priority}
                </span>
              </div>

              {/* Status */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </h3>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(workOrder.status)}`}
                >
                  {workOrder.status}
                </span>
              </div>

              {/* Updated At */}
              <div className="sm:col-span-2">
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Updated
                </h3>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {dateInfo.relative}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {dateInfo.absolute}
                </p>
              </div>

              {/* ID */}
              <div className="sm:col-span-2">
                <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Work Order ID
                </h3>
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {workOrder.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

