'use client';

import { WorkOrder } from '@/data/workOrderStore';
import { useState, useMemo, useEffect } from 'react';

interface SearchFilterProps {
  workOrders: WorkOrder[];
  onFiltered: (filtered: WorkOrder[]) => void;
}

type StatusFilter = 'All' | WorkOrder['status'];

/**
 * Search and filter component for work orders.
 * Allows searching by title and filtering by status.
 */
export function SearchFilter({ workOrders, onFiltered }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredOrders = useMemo(() => {
    let filtered = workOrders;

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search by title
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) =>
        order.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [workOrders, searchQuery, statusFilter]);

  // Notify parent of filtered results
  useEffect(() => {
    onFiltered(filteredOrders);
  }, [filteredOrders, onFiltered]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">
          Search work orders
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:w-64"
          aria-label="Search work orders by title"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
          aria-label="Filter work orders by status"
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div>
  );
}

