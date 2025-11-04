import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  get_work_order,
  update_work_order,
  delete_work_order,
} from '@/services/workOrderRPC';

/**
 * Schema for validating work order ID parameter.
 */
const workOrderIdSchema = z.string().uuid('Invalid work order ID: must be a valid UUID');

/**
 * Schema for validating update work order request body.
 * All fields are optional for partial updates.
 */
const updateWorkOrderBodySchema = z
  .object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(80, 'Title must not exceed 80 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    status: z.enum(['Open', 'In Progress', 'Done']).optional(),
  })
  .strict(); // Prevent unknown fields

/**
 * GET /api/work-orders/[id]
 * 
 * Retrieves a single work order by its ID.
 * Validates the ID format and returns 404 if not found.
 * Uses cache: 'no-store' to ensure fresh data.
 * 
 * @param {NextRequest} request - The Next.js request object
 * @param {Object} context - Route context containing dynamic route parameters
 * @param {Object} context.params - Route parameters containing the work order ID
 * @param {Promise<string>} context.params.id - The work order ID from the URL
 * @returns {Promise<NextResponse>} JSON response containing the work order or error
 * 
 * @example
 * ```typescript
 * // GET /api/work-orders/123e4567-e89b-12d3-a456-426614174000
 * // Returns: { "data": WorkOrder } or 404 if not found
 * ```
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    try {
      workOrderIdSchema.parse(id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid work order ID',
            message: error.issues.map((issue) => issue.message).join(', '),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const workOrder = await get_work_order(id);

    if (!workOrder) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: `Work order with ID ${id} does not exist`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: workOrder },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error retrieving work order:', error);

    // Handle validation errors from RPC function
    if (error instanceof Error && error.message.includes('Invalid work order ID')) {
      return NextResponse.json(
        {
          error: 'Invalid work order ID',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to retrieve work order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/work-orders/[id]
 * 
 * Updates an existing work order by ID.
 * Validates the ID format and request body using Zod.
 * Returns 404 if the work order does not exist.
 * Uses cache: 'no-store' to ensure fresh data.
 * 
 * @param {NextRequest} request - The Next.js request object containing update data
 * @param {Object} context - Route context containing dynamic route parameters
 * @param {Object} context.params - Route parameters containing the work order ID
 * @param {Promise<string>} context.params.id - The work order ID from the URL
 * @returns {Promise<NextResponse>} JSON response containing the updated work order or error
 * 
 * @example
 * ```typescript
 * // PUT /api/work-orders/123e4567-e89b-12d3-a456-426614174000
 * // Body: { "status": "In Progress", "priority": "High" }
 * // Returns: { "data": WorkOrder } or 404 if not found
 * ```
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    try {
      workOrderIdSchema.parse(id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid work order ID',
            message: error.issues.map((issue) => issue.message).join(', '),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const body = await request.json();

    // Validate request body using Zod
    let validatedData: z.infer<typeof updateWorkOrderBodySchema>;
    try {
      validatedData = updateWorkOrderBodySchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        return NextResponse.json(
          {
            error: 'Validation failed',
            message: errorMessages,
            details: error.issues,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check if at least one field is provided for update
    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'At least one field must be provided for update',
        },
        { status: 400 }
      );
    }

    // Update the work order using RPC function
    const updatedWorkOrder = await update_work_order(id, validatedData);

    if (!updatedWorkOrder) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: `Work order with ID ${id} does not exist`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: updatedWorkOrder },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error updating work order:', error);

    // Handle validation errors from RPC function
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: error.message,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Invalid work order ID')) {
      return NextResponse.json(
        {
          error: 'Invalid work order ID',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update work order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/work-orders/[id]
 * 
 * Deletes a work order by ID.
 * Validates the ID format and returns 404 if not found.
 * Uses cache: 'no-store' to ensure fresh data.
 * 
 * @param {NextRequest} request - The Next.js request object
 * @param {Object} context - Route context containing dynamic route parameters
 * @param {Object} context.params - Route parameters containing the work order ID
 * @param {Promise<string>} context.params.id - The work order ID from the URL
 * @returns {Promise<NextResponse>} JSON response indicating success or error
 * 
 * @example
 * ```typescript
 * // DELETE /api/work-orders/123e4567-e89b-12d3-a456-426614174000
 * // Returns: { "message": "Work order deleted successfully" } or 404 if not found
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    try {
      workOrderIdSchema.parse(id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Invalid work order ID',
            message: error.issues.map((issue) => issue.message).join(', '),
          },
          { status: 400 }
        );
      }
      throw error;
    }

    const deleted = await delete_work_order(id);

    if (!deleted) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: `Work order with ID ${id} does not exist`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Work order deleted successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting work order:', error);

    // Handle validation errors from RPC function
    if (error instanceof Error && error.message.includes('Invalid work order ID')) {
      return NextResponse.json(
        {
          error: 'Invalid work order ID',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete work order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

