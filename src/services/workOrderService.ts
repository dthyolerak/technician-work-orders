import {
  getAll,
  getById,
  create,
  update,
  remove,
  type WorkOrder,
} from '@/data/workOrderStore';

/**
 * Service layer for Work Order operations.
 * Provides business logic, validation, and error handling on top of the data store.
 */

/**
 * Retrieves all work orders from the data store.
 * 
 * @returns {Promise<WorkOrder[]>} Array of all work orders
 * @throws {Error} If the data store operation fails
 * 
 * @example
 * ```typescript
 * const orders = await getAllWorkOrders();
 * ```
 */
export async function getAllWorkOrders(): Promise<WorkOrder[]> {
  try {
    return await getAll();
  } catch (error) {
    throw new Error(`Failed to retrieve work orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieves a single work order by its ID.
 * 
 * @param {string} id - The unique identifier of the work order
 * @returns {Promise<WorkOrder | null>} The work order if found, null otherwise
 * @throws {Error} If the ID is invalid or the data store operation fails
 * 
 * @example
 * ```typescript
 * const order = await getWorkOrderById('123e4567-e89b-12d3-a456-426614174000');
 * if (order) {
 *   console.log(order.title);
 * }
 * ```
 */
export async function getWorkOrderById(id: string): Promise<WorkOrder | null> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid work order ID: ID must be a non-empty string');
  }

  try {
    return await getById(id);
  } catch (error) {
    throw new Error(`Failed to retrieve work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a new work order in the data store.
 * 
 * @param {Omit<WorkOrder, 'id' | 'updatedAt'>} data - The work order data (id and updatedAt are auto-generated)
 * @returns {Promise<WorkOrder>} The newly created work order with generated ID and timestamp
 * @throws {Error} If validation fails or the data store operation fails
 * 
 * @example
 * ```typescript
 * const newOrder = await createWorkOrder({
 *   title: 'Fix HVAC System',
 *   description: 'Repair the air conditioning unit',
 *   priority: 'High',
 *   status: 'Open'
 * });
 * ```
 */
export async function createWorkOrder(
  data: Omit<WorkOrder, 'id' | 'updatedAt'>
): Promise<WorkOrder> {
  // Validate required fields
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error('Validation failed: title is required and must be a non-empty string');
  }

  if (data.title.length < 2 || data.title.length > 80) {
    throw new Error('Validation failed: title must be between 2 and 80 characters');
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    throw new Error('Validation failed: description is required and must be a non-empty string');
  }

  if (data.description.length < 10 || data.description.length > 500) {
    throw new Error('Validation failed: description must be between 10 and 500 characters');
  }

  if (!['Low', 'Medium', 'High'].includes(data.priority)) {
    throw new Error('Validation failed: priority must be one of: Low, Medium, High');
  }

  if (!['Open', 'In Progress', 'Done'].includes(data.status)) {
    throw new Error('Validation failed: status must be one of: Open, In Progress, Done');
  }

  try {
    return await create(data);
  } catch (error) {
    throw new Error(`Failed to create work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Updates an existing work order by ID.
 * Only provided fields will be updated; other fields remain unchanged.
 * 
 * @param {string} id - The unique identifier of the work order to update
 * @param {Partial<Omit<WorkOrder, 'id'>>} updates - Partial work order data to update
 * @returns {Promise<WorkOrder | null>} The updated work order, or null if not found
 * @throws {Error} If validation fails, ID is invalid, or the data store operation fails
 * 
 * @example
 * ```typescript
 * const updated = await updateWorkOrder('123e4567-e89b-12d3-a456-426614174000', {
 *   status: 'In Progress',
 *   priority: 'High'
 * });
 * ```
 */
export async function updateWorkOrder(
  id: string,
  updates: Partial<Omit<WorkOrder, 'id'>>
): Promise<WorkOrder | null> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid work order ID: ID must be a non-empty string');
  }

  // Check if work order exists before attempting update
  const existingOrder = await getById(id);
  if (!existingOrder) {
    return null;
  }

  // Validate field lengths if provided
  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || updates.title.trim().length === 0) {
      throw new Error('Validation failed: title must be a non-empty string');
    }
    if (updates.title.length < 2 || updates.title.length > 80) {
      throw new Error('Validation failed: title must be between 2 and 80 characters');
    }
  }

  if (updates.description !== undefined) {
    if (typeof updates.description !== 'string' || updates.description.trim().length === 0) {
      throw new Error('Validation failed: description must be a non-empty string');
    }
    if (updates.description.length < 10 || updates.description.length > 500) {
      throw new Error('Validation failed: description must be between 10 and 500 characters');
    }
  }

  if (updates.priority !== undefined && !['Low', 'Medium', 'High'].includes(updates.priority)) {
    throw new Error('Validation failed: priority must be one of: Low, Medium, High');
  }

  if (updates.status !== undefined && !['Open', 'In Progress', 'Done'].includes(updates.status)) {
    throw new Error('Validation failed: status must be one of: Open, In Progress, Done');
  }

  try {
    return await update(id, updates);
  } catch (error) {
    throw new Error(`Failed to update work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Deletes a work order by ID.
 * 
 * @param {string} id - The unique identifier of the work order to delete
 * @returns {Promise<boolean>} True if the work order was found and deleted, false otherwise
 * @throws {Error} If the ID is invalid or the data store operation fails
 * 
 * @example
 * ```typescript
 * const deleted = await deleteWorkOrder('123e4567-e89b-12d3-a456-426614174000');
 * if (deleted) {
 *   console.log('Work order deleted successfully');
 * }
 * ```
 */
export async function deleteWorkOrder(id: string): Promise<boolean> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid work order ID: ID must be a non-empty string');
  }

  // Check if work order exists before attempting deletion
  const existingOrder = await getById(id);
  if (!existingOrder) {
    return false;
  }

  try {
    return await remove(id);
  } catch (error) {
    throw new Error(`Failed to delete work order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Re-export the WorkOrder type for convenience
export type { WorkOrder };

