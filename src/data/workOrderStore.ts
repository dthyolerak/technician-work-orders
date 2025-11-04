import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Done';
  updatedAt: string;
};

const DATA_FILE_PATH = join(process.cwd(), 'src', 'data', 'work-orders.json');

/**
 * Reads the work orders from the JSON file.
 * Initializes the file with an empty array if it doesn't exist or is invalid.
 */
async function readWorkOrders(): Promise<WorkOrder[]> {
  try {
    const data = await readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid data format: expected an array');
    }
    
    return parsed;
  } catch (error) {
    // If file doesn't exist or is invalid, initialize with empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError) {
      await writeWorkOrders([]);
      return [];
    }
    throw error;
  }
}

/**
 * Writes work orders to the JSON file.
 */
async function writeWorkOrders(orders: WorkOrder[]): Promise<void> {
  const data = JSON.stringify(orders, null, 2);
  await writeFile(DATA_FILE_PATH, data, 'utf-8');
}

/**
 * Retrieves all work orders.
 */
export async function getAll(): Promise<WorkOrder[]> {
  return readWorkOrders();
}

/**
 * Retrieves a work order by ID.
 * Returns null if not found.
 */
export async function getById(id: string): Promise<WorkOrder | null> {
  const orders = await readWorkOrders();
  return orders.find((order) => order.id === id) || null;
}

/**
 * Creates a new work order.
 * Automatically generates an ID and sets updatedAt timestamp.
 */
export async function create(
  order: Omit<WorkOrder, 'id' | 'updatedAt'>
): Promise<WorkOrder> {
  const orders = await readWorkOrders();
  
  const newOrder: WorkOrder = {
    ...order,
    id: uuidv4(),
    updatedAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  await writeWorkOrders(orders);
  
  return newOrder;
}

/**
 * Updates an existing work order by ID.
 * Automatically updates the updatedAt timestamp.
 * Returns null if the work order is not found.
 */
export async function update(
  id: string,
  updates: Partial<Omit<WorkOrder, 'id'>>
): Promise<WorkOrder | null> {
  const orders = await readWorkOrders();
  const index = orders.findIndex((order) => order.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedOrder: WorkOrder = {
    ...orders[index],
    ...updates,
    id, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  };
  
  orders[index] = updatedOrder;
  await writeWorkOrders(orders);
  
  return updatedOrder;
}

/**
 * Removes a work order by ID.
 * Returns true if the work order was found and removed, false otherwise.
 */
export async function remove(id: string): Promise<boolean> {
  const orders = await readWorkOrders();
  const initialLength = orders.length;
  const filteredOrders = orders.filter((order) => order.id !== id);
  
  if (filteredOrders.length === initialLength) {
    return false;
  }
  
  await writeWorkOrders(filteredOrders);
  return true;
}

