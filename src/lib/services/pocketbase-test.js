import PocketBase from 'pocketbase';

// Create a PocketBase client instance
export const pb = new PocketBase('http://127.0.0.1:8090');

// Test connection function
export async function testConnection() {
  try {
    const health = await fetch('http://127.0.0.1:8090/api/health');
    const healthData = await health.json();
    
    if (healthData.code === 200) {
      return {
        success: true,
        message: 'Connected to PocketBase successfully!'
      };
    } else {
      return {
        success: false,
        message: 'PocketBase returned an unhealthy status.'
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Failed to connect to PocketBase: ${errorMessage}`
    };
  }
}

// Get all collections
export async function getCollections() {
  try {
    return await pb.collections.getList(1, 100);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching collections:', errorMessage);
    return { items: [] };
  }
}

// Default export for ease of use
export default {
  pb,
  testConnection,
  getCollections
}; 