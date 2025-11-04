/**
 * Loading state component displayed while fetching work orders.
 */
export function LoadingState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading work orders...</p>
      </div>
    </div>
  );
}

