import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { WorkOrder } from '../src/data/workOrderStore';

const DATA_FILE_PATH = join(process.cwd(), 'src', 'data', 'work-orders.json');

/**
 * Generates sample work orders with realistic dummy data for testing and development.
 */
function generateSampleWorkOrders(): WorkOrder[] {
  const now = new Date();
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

  return [
    {
      id: uuidv4(),
      title: 'HVAC System Maintenance - Building A',
      description: 'Perform routine maintenance on the central air conditioning unit in Building A. Check filters, inspect refrigerant levels, and test thermostat functionality.',
      priority: 'High',
      status: 'Open',
      updatedAt: hoursAgo(2).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Electrical Panel Inspection - Warehouse',
      description: 'Complete quarterly inspection of the main electrical panel in the warehouse. Verify all connections are secure and check for any signs of overheating or corrosion.',
      priority: 'Medium',
      status: 'In Progress',
      updatedAt: hoursAgo(5).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Plumbing Leak Repair - Restroom 3rd Floor',
      description: 'Fix leaking faucet in the men\'s restroom on the 3rd floor. Replace worn-out washer and ensure proper water pressure after repair.',
      priority: 'Low',
      status: 'Done',
      updatedAt: hoursAgo(24).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Elevator Safety Inspection',
      description: 'Conduct monthly safety inspection for Elevator #2. Test emergency stop button, verify door sensors, and check cable tension.',
      priority: 'High',
      status: 'Open',
      updatedAt: hoursAgo(1).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Fire Alarm System Testing',
      description: 'Perform comprehensive testing of the fire alarm system across all floors. Test smoke detectors, heat sensors, and emergency notification systems.',
      priority: 'High',
      status: 'In Progress',
      updatedAt: hoursAgo(3).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Generator Fuel Filter Replacement',
      description: 'Replace fuel filter on the backup generator. Test generator operation after replacement to ensure proper startup and power output.',
      priority: 'Medium',
      status: 'Open',
      updatedAt: hoursAgo(8).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Parking Lot Lighting Repair',
      description: 'Replace burned-out LED fixtures in the north parking lot. Ensure all fixtures are properly secured and wired according to code.',
      priority: 'Low',
      status: 'Done',
      updatedAt: hoursAgo(48).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Boiler Temperature Calibration',
      description: 'Calibrate temperature sensors on the main boiler system. Verify accurate readings and adjust controls as needed for optimal efficiency.',
      priority: 'Medium',
      status: 'In Progress',
      updatedAt: hoursAgo(6).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Security Camera Installation - Loading Dock',
      description: 'Install new security camera at the loading dock entrance. Run cables, mount camera, and configure recording system integration.',
      priority: 'Medium',
      status: 'Open',
      updatedAt: hoursAgo(12).toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Roof Inspection and Minor Repairs',
      description: 'Inspect roof for any signs of damage or leaks. Seal minor cracks and ensure all drainage systems are clear and functioning properly.',
      priority: 'Low',
      status: 'Done',
      updatedAt: hoursAgo(72).toISOString(),
    },
  ];
}

/**
 * Seeds the work-orders.json file with sample data.
 */
async function seed(): Promise<void> {
  try {
    const workOrders = generateSampleWorkOrders();
    const data = JSON.stringify(workOrders, null, 2);
    
    await writeFile(DATA_FILE_PATH, data, 'utf-8');
    
    console.log(`✅ Successfully seeded ${workOrders.length} work orders to ${DATA_FILE_PATH}`);
  } catch (error) {
    console.error('❌ Error seeding work orders:', error);
    process.exit(1);
  }
}

// Run the seed script
seed();

