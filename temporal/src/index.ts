import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

async function run() {
  // Create a Worker
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'freight-monitoring',
  });

  // Start the worker
  await worker.run();
}

run().catch((err) => {
  console.error('Worker error:', err);
  process.exit(1);
}); 