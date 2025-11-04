'use client';

import { useState, FormEvent } from 'react';
import { z } from 'zod';
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
  status?: string;
  general?: string;
}

// Client-side Zod schemas matching server validation
const titleSchema = z
  .string()
  .min(2, 'Title must be at least 2 characters')
  .max(80, 'Title must not exceed 80 characters')
  .trim();

const descriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(500, 'Description must not exceed 500 characters')
  .trim();

const prioritySchema = z.enum(['Low', 'Medium', 'High']);

const statusSchema = z.enum(['Open', 'In Progress', 'Done']);

// Create schema - all fields required
const createFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
});

// Edit schema - all fields optional but validated if provided
const editFormSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

type CreateFormData = z.infer<typeof createFormSchema>;
type EditFormData = z.infer<typeof editFormSchema>;

/**
 * Enhanced form component for creating and editing work orders.
 * Features:
 * - Client-side Zod validation
 * - Field-level error messages
 * - Safe description rendering
 * - Status field for edit mode
 * - Loading and success states
 */
export function WorkOrderForm({ initialData, workOrderId, mode }: WorkOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: (initialData?.priority || 'Medium') as WorkOrder['priority'],
    status: (initialData?.status || 'Open') as WorkOrder['status'],
  });

  // Client-side validation
  const validateForm = (): boolean => {
    setErrors({});

    try {
      if (mode === 'create') {
        createFormSchema.parse(formData);
      } else {
        // For edit, validate all fields if they're provided
        const editData: EditFormData = {};
        if (formData.title.trim()) editData.title = formData.title.trim();
        if (formData.description.trim()) editData.description = formData.description.trim();
        if (formData.priority) editData.priority = formData.priority;
        if (formData.status) editData.status = formData.status;

        editFormSchema.parse(editData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormErrors;
          if (field) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = mode === 'create' 
        ? '/api/work-orders' 
        : `/api/work-orders/${workOrderId}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      // Prepare request body
      const requestBody = mode === 'create' 
        ? {
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            status: formData.status,
          }
        : {
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            status: formData.status,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side validation errors
        if (response.status === 400 && data.details) {
          const fieldErrors: FormErrors = {};
          data.details.forEach((issue: { path: (string | number)[]; message: string }) => {
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

      // Success state
      setIsSuccess(true);
      setIsSubmitting(false);

      // Redirect after brief success message
      setTimeout(() => {
        if (mode === 'create') {
          router.push('/');
        } else {
          router.push(`/work-orders/${workOrderId}`);
        }
        router.refresh();
      }, 1500);
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

  const handleBlur = (fieldName: 'title' | 'description' | 'priority' | 'status') => {
    // Validate individual field on blur
    if (mode === 'create') {
      try {
        if (fieldName === 'title' && formData.title) {
          titleSchema.parse(formData.title);
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        } else if (fieldName === 'description' && formData.description) {
          descriptionSchema.parse(formData.description);
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        } else if (fieldName === 'priority' && formData.priority) {
          prioritySchema.parse(formData.priority);
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        } else if (fieldName === 'status' && formData.status) {
          statusSchema.parse(formData.status);
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: error.issues[0]?.message,
          }));
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Success Message */}
      {isSuccess && (
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {mode === 'create' 
                  ? 'Work order created successfully!' 
                  : 'Work order updated successfully!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {errors.general}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur('title')}
          required
          minLength={2}
          maxLength={80}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
            errors.title
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-50 dark:text-red-900 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.title}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.title.length}/80 characters
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description <span className="text-red-500" aria-label="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          required
          minLength={10}
          maxLength={500}
          rows={6}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
            errors.description
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-50 dark:text-red-900 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Priority Field */}
      <div>
        <label 
          htmlFor="priority" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Priority <span className="text-red-500" aria-label="required">*</span>
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          onBlur={() => handleBlur('priority')}
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
            errors.priority
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-50 dark:text-red-900 dark:focus:border-red-500 dark:focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          aria-invalid={errors.priority ? 'true' : 'false'}
          aria-describedby={errors.priority ? 'priority-error' : undefined}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.priority && (
          <p id="priority-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.priority}
          </p>
        )}
      </div>

      {/* Status Field - Only shown in edit mode */}
      {mode === 'edit' && (
        <div>
          <label 
            htmlFor="status" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Status <span className="text-red-500" aria-label="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            onBlur={() => handleBlur('status')}
            required
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
              errors.status
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-50 dark:text-red-900 dark:focus:border-red-500 dark:focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
            }`}
            aria-invalid={errors.status ? 'true' : 'false'}
            aria-describedby={errors.status ? 'status-error' : undefined}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <p id="status-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.status}
            </p>
          )}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
            </>
          ) : isSuccess ? (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved!
            </>
          ) : (
            mode === 'create' ? 'Create Work Order' : 'Update Work Order'
          )}
        </button>
      </div>
    </form>
  );
}
