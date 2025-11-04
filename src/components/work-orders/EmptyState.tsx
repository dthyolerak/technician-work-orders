interface EmptyStateProps {
  onAddNew?: () => void;
}

/**
 * Empty state component displayed when no work orders exist.
 */
export function EmptyState({ onAddNew }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
      <svg
        className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        No work orders found
      </h3>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Get started by creating your first work order.
      </p>
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Add Work Order
        </button>
      )}
    </div>
  );
}

