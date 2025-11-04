/**
 * Table header component for work orders table.
 * Defines column headers with proper accessibility attributes.
 */
export function WorkOrderTableHeader() {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900">
      <tr>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-6"
        >
          Title
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-6"
        >
          Priority
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-6"
        >
          Status
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-6"
        >
          Updated At
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 sm:px-6"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}

