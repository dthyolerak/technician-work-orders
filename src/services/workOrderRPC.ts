import { z } from 'zod';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  type WorkOrder,
} from '@/data/workOrderStore';

/**
 * RPC-style service functions for Work Order operations.
 * These functions provide a clean interface for API routes and RPC endpoints,
 * directly interfacing with the data store layer.
 * All input validation is performed using Zod schemas.
 */

// Zod schemas for validation

/**
 * Schema for validating work order IDs (UUID format).
 */
const workOrderIdSchema = z.string().uuid('Invalid work order ID: must be a valid UUID').min(1, 'Work order ID cannot be empty');

/**
 * Schema for validating priority values.
 */
const prioritySchema = z.enum(['Low', 'Medium', 'High']);

/**
 * Schema for validating status values.
 */
const statusSchema = z.enum(['Open', 'In Progress', 'Done']);

/**
 * Schema for validating title field.
 * Title must be between 2 and 80 characters.
 */
const titleSchema = z
  .string()
  .min(2, 'Title must be at least 2 characters')
  .max(80, 'Title must not exceed 80 characters')
  .trim();

/**
 * Schema for validating description field.
 * Description must be between 10 and 500 characters.
 */
const descriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(500, 'Description must not exceed 500 characters')
  .trim();

/**
 * Schema for creating a new work order.
 * All fields are required except id and updatedAt (which are auto-generated).
 */
const createWorkOrderSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
});

/**
 * Schema for updating an existing work order.
 * All fields are optional for partial updates.
 */
const updateWorkOrderSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  updatedAt: z.string().optional(), // Will be overridden by the store
}).strict(); // Prevent unknown fields

/**
 * Lists all work orders from the data store.
 * 
 * @returns {Promise<WorkOrder[]>} Array of all work orders, empty array if none exist
 * @throws {Error} If the data store operation fails
 * 
 * @example
 * ```typescript
 * const orders = await list_work_orders();
 * ```
 */
export async function list_work_orders(): Promise<WorkOrder[]> {
  try {
    return await getAll();
  } catch (error) {
    throw new Error(
      `Failed to list work orders: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retrieves a single work order by its unique identifier.
 * Validates the ID format using Zod before querying the data store.
 * 
 * @param {string} id - The unique identifier (UUID) of the work order
 * @returns {Promise<WorkOrder | null>} The work order if found, null if not found
 * @throws {Error} If ID validation fails or the data store operation fails
 * 
 * @example
 * ```typescript
 * const order = await get_work_order('123e4567-e89b-12d3-a456-426614174000');
 * if (order) {
 *   console.log(order.title);
 * }
 * ```
 */
export async function get_work_order(id: string): Promise<WorkOrder | null> {
  try {
    // Validate ID format using Zod
    workOrderIdSchema.parse(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid work order ID: ${error.issues.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }

  try {
    return await getById(id);
  } catch (error) {
    throw new Error(
      `Failed to get work order: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Creates a new work order in the data store.
 * Validates all input fields using Zod schema before creation.
 * Automatically generates a unique ID and sets the updatedAt timestamp.
 * 
 * @param {Omit<WorkOrder, 'id' | 'updatedAt'>} data - Work order data without id and updatedAt (auto-generated)
 * @returns {Promise<WorkOrder>} The newly created work order with generated ID and timestamp
 * @throws {Error} If Zod validation fails or the data store operation fails
 * 
 * @example
 * ```typescript
 * const newOrder = await create_work_order({
 *   title: 'Fix HVAC System',
 *   description: 'Repair the air conditioning unit in Building A',
 *   priority: 'High',
 *   status: 'Open'
 * });
 * ```
 */
export async function create_work_order(
  data: Omit<WorkOrder, 'id' | 'updatedAt'>
): Promise<WorkOrder> {
  // Validate input using Zod schema
  let validatedData: z.infer<typeof createWorkOrderSchema>;
  try {
    validatedData = createWorkOrderSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }

  try {
    return await create(validatedData);
  } catch (error) {
    throw new Error(
      `Failed to create work order: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Updates an existing work order by ID.
 * Validates the ID format and any provided fields using Zod schemas.
 * Only provided fields will be updated; omitted fields remain unchanged.
 * Automatically updates the updatedAt timestamp.
 * Returns null if the work order does not exist.
 * 
 * @param {string} id - The unique identifier of the work order to update
 * @param {Partial<Omit<WorkOrder, 'id'>>} data - Partial work order data to update
 * @returns {Promise<WorkOrder | null>} The updated work order, or null if not found
 * @throws {Error} If ID or field validation fails, or the data store operation fails
 * 
 * @example
 * ```typescript
 * const updated = await update_work_order('123e4567-e89b-12d3-a456-426614174000', {
 *   status: 'In Progress',
 *   priority: 'High'
 * });
 * if (!updated) {
 *   console.log('Work order not found');
 * }
 * ```
 */
export async function update_work_order(
  id: string,
  data: Partial<Omit<WorkOrder, 'id'>>
): Promise<WorkOrder | null> {
  // Validate ID format using Zod
  try {
    workOrderIdSchema.parse(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid work order ID: ${error.issues.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }

  // Validate update data using Zod schema
  let validatedData: z.infer<typeof updateWorkOrderSchema>;
  try {
    validatedData = updateWorkOrderSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }

  // Check if work order exists before attempting update
  const existingOrder = await getById(id);
  if (!existingOrder) {
    return null;
  }

  try {
    // Remove updatedAt from validatedData as it's auto-managed by the store
    const { updatedAt, ...updateFields } = validatedData;
    return await update(id, updateFields);
  } catch (error) {
    throw new Error(
      `Failed to update work order: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Deletes a work order by ID.
 * Validates the ID format using Zod before deletion.
 * Returns false if the work order does not exist, true if successfully deleted.
 * 
 * @param {string} id - The unique identifier of the work order to delete
 * @returns {Promise<boolean>} True if deleted successfully, false if not found
 * @throws {Error} If ID validation fails or the data store operation fails
 * 
 * @example
 * ```typescript
 * const deleted = await delete_work_order('123e4567-e89b-12d3-a456-426614174000');
 * if (deleted) {
 *   console.log('Work order deleted successfully');
 * } else {
 *   console.log('Work order not found');
 * }
 * ```
 */
export async function delete_work_order(id: string): Promise<boolean> {
  // Validate ID format using Zod
  try {
    workOrderIdSchema.parse(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid work order ID: ${error.issues.map((e) => e.message).join(', ')}`);
    }
    throw error;
  }

  // Check if work order exists before attempting deletion
  const existingOrder = await getById(id);
  if (!existingOrder) {
    return false;
  }

  try {
    return await remove(id);
  } catch (error) {
    throw new Error(
      `Failed to delete work order: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Re-export the WorkOrder type for convenience
export type { WorkOrder };
