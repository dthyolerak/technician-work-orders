'use client';

import { useState, FormEvent } from 'react';
import { WorkOrder } from '@/data/workOrderStore';
import { useRouter } from 'next/navigation';

interface WorkOrderFormProps {
  initialData?: Partial<WorkOrder>;
  workOrderId?: string;
  mode: 'create' | 'edit';
}

interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
  general?: string;
}

/**
 * Form component for creating and editing work orders.
 * Handles validation, submission, and error display.
 */
export function WorkOrderForm({ initialData, workOrderId, mode }: WorkOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: (initialData?.priority || 'Medium') as WorkOrder['priority'],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const url = mode === 'create' 
        ? '/api/work-orders' 
        : `/api/work-orders/${workOrderId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(mode === 'create' && { status: 'Open' }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400 && data.details) {
          const fieldErrors: FormErrors = {};
          data.details.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path[0] as keyof FormErrors;
            if (field) {
              fieldErrors[field] = issue.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.message || 'Failed to save work order' });
        }
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to list or detail page
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={80}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={500}
          rows={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Priority Field */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority <span className="text-red-500">*</span>
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
          aria-invalid={errors.priority ? 'true' : 'false'}
          aria-describedby={errors.priority ? 'priority-error' : undefined}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <p id="priority-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.priority}
          </p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
              Saving...
            </span>
          ) : (
            mode === 'create' ? 'Create Work Order' : 'Update Work Order'
          )}
        </button>
      </div>
    </form>
  );
}

