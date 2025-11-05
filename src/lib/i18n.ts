/**
 * Simple i18n dictionary for static UI text.
 * This minimal implementation provides a centralized location
 * for all user-facing strings, making it easy to add full
 * internationalization support in the future.
 */

type TranslationKey =
  | 'addWorkOrder'
  | 'workOrders'
  | 'title'
  | 'description'
  | 'priority'
  | 'status'
  | 'submit'
  | 'cancel'
  | 'edit'
  | 'delete'
  | 'createWorkOrder'
  | 'editWorkOrder'
  | 'deleteWorkOrder'
  | 'deleteConfirmation'
  | 'deleteConfirmationMessage'
  | 'deleting'
  | 'searchPlaceholder'
  | 'filterByStatus'
  | 'all'
  | 'open'
  | 'inProgress'
  | 'done'
  | 'low'
  | 'medium'
  | 'high'
  | 'noWorkOrders'
  | 'noWorkOrdersDescription'
  | 'updatedAt'
  | 'actions'
  | 'back'
  | 'save'
  | 'create'
  | 'loading'
  | 'error'
  | 'success';

type Translations = Record<TranslationKey, string>;

/**
 * English translations dictionary.
 * To add support for other languages, create a similar object
 * and switch based on locale.
 */
const translations: Translations = {
  addWorkOrder: 'Add Work Order',
  workOrders: 'Work Orders',
  title: 'Title',
  description: 'Description',
  priority: 'Priority',
  status: 'Status',
  submit: 'Submit',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  createWorkOrder: 'Create Work Order',
  editWorkOrder: 'Edit Work Order',
  deleteWorkOrder: 'Delete Work Order',
  deleteConfirmation: 'Delete Work Order',
  deleteConfirmationMessage: 'Are you sure you want to delete the work order "{title}"? This action cannot be undone.',
  deleting: 'Deleting...',
  searchPlaceholder: 'Search by title...',
  filterByStatus: 'Filter by status:',
  all: 'All',
  open: 'Open',
  inProgress: 'In Progress',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  noWorkOrders: 'No work orders found',
  noWorkOrdersDescription: 'Get started by creating your first work order.',
  updatedAt: 'Updated At',
  actions: 'Actions',
  back: 'Back',
  save: 'Save',
  create: 'Create',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
};

/**
 * Simple translation function.
 * 
 * @param key - Translation key
 * @param params - Optional parameters for string interpolation
 * @returns Translated string
 * 
 * @example
 * ```typescript
 * t('addWorkOrder') // Returns: "Add Work Order"
 * t('deleteConfirmationMessage', { title: 'Fix HVAC' }) // Returns: "Are you sure you want to delete the work order "Fix HVAC"? This action cannot be undone."
 * ```
 */
export function t(key: TranslationKey, params?: Record<string, string>): string {
  let translation = translations[key];

  // Simple string interpolation
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{${paramKey}}`, paramValue);
    });
  }

  return translation;
}

/**
 * Get all available translation keys (useful for type checking)
 */
export type { TranslationKey };

