import { Connection, Client } from '@temporalio/client';
import { MonitorRouteWorkflow } from './workflows';
import { RouteData, MonitoringResult } from '@/types';

// Create a Temporal client connection
async function getTemporalClient() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  });
  
  return new Client({
    connection,
  });
}

// Execute the monitoring workflow
export async function monitorRoute(routeData: RouteData): Promise<MonitoringResult> {
  try {
    const client = await getTemporalClient();
    
    // Start a new workflow execution
    const handle = await client.workflow.start('MonitorRouteWorkflow', {
      args: [routeData],
      taskQueue: 'freight-monitoring',
      workflowId: `route-monitor-${Date.now()}`,
    });
    
    console.log(`Started workflow with ID: ${handle.workflowId}`);
    
    // Wait for the workflow to complete
    const result = await handle.result();
    return result;
  } catch (error) {
    console.error('Error executing Temporal workflow:', error);
    throw error;
  }
} 