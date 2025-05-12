import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function updateUsersSchema() {
  // Import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  
  try {
    // Login as admin
    await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin');
    
    // Get all collections to find the users collection
    const collections = await pb.collections.getFullList();
    const usersCollection = collections.find(c => c.name === 'users');
    
    if (!usersCollection) {
      console.error('Users collection not found');
      return;
    }
    
    console.log('Found users collection:', usersCollection.id);
    
    // Check if the name field already exists
    const nameField = usersCollection.schema.find(field => field.name === 'name');
    
    if (nameField) {
      console.log('Name field already exists in users collection');
      return;
    }
    
    // Add the name field to the schema
    const updatedSchema = [
      ...usersCollection.schema,
      {
        name: 'name',
        type: 'text',
        required: false
      }
    ];
    
    // Update the users collection schema
    await pb.collections.update(usersCollection.id, {
      schema: updatedSchema
    });
    
    console.log('Successfully added name field to users collection');
    
  } catch (err) {
    console.error('Failed to update users schema:', err);
  }
}

updateUsersSchema(); 