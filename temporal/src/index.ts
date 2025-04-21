import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function run() {
  // Verify environment variables are loaded
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY environment variable is not set');
  }
  
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn('Warning: GOOGLE_MAPS_API_KEY environment variable is not set');
  }

  // Create a Worker
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities, // This is where we register the activities
    taskQueue: 'freight-monitoring',
  });

  console.log('Worker connected to Temporal server');
  console.log('Listening for tasks on queue: freight-monitoring');

  // Start the worker
  await worker.run();
}

run().catch((err) => {
  console.error('Worker error:', err);
  process.exit(1);
}); 