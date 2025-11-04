import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  list_work_orders,
  create_work_order,
  type WorkOrder,
} from '@/services/workOrderRPC';

/**
 * Schema for validating create work order request body.
 */
const createWorkOrderBodySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(80, 'Title must not exceed 80 characters').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters').trim(),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Open', 'In Progress', 'Done']),
});

/**
 * GET /api/work-orders
 * 
 * Lists all work orders from the data store.
 * Uses cache: 'no-store' to ensure fresh data on every request.
 * 
 * @param {NextRequest} request - The Next.js request object
 * @returns {Promise<NextResponse>} JSON response containing an array of work orders
 * 
 * @example
 * ```typescript
 * // GET /api/work-orders
 * // Returns: { "data": WorkOrder[] }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const workOrders = await list_work_orders();

    return NextResponse.json(
      { data: workOrders },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error listing work orders:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve work orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/work-orders
 * 
 * Creates a new work order in the data store.
 * Validates the request body using Zod before processing.
 * Uses cache: 'no-store' to ensure fresh data.
 * 
 * @param {NextRequest} request - The Next.js request object containing work order data
 * @returns {Promise<NextResponse>} JSON response containing the created work order
 * 
 * @example
 * ```typescript
 * // POST /api/work-orders
 * // Body: { "title": "Fix HVAC", "description": "...", "priority": "High", "status": "Open" }
 * // Returns: { "data": WorkOrder }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body using Zod
    let validatedData: z.infer<typeof createWorkOrderBodySchema>;
    try {
      validatedData = createWorkOrderBodySchema.parse(body);
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

    // Create the work order using RPC function
    const newWorkOrder = await create_work_order(validatedData);

    return NextResponse.json(
      { data: newWorkOrder },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error creating work order:', error);

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

    return NextResponse.json(
      {
        error: 'Failed to create work order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

