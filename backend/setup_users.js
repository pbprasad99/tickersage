import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function setupUsers() {
  // Import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  console.log('PocketBase client initialized with URL:', config.pocketbase.url);
  
  try {
    // Login as admin
    console.log('Attempting to authenticate as admin:', config.pocketbase.admin.email);
    const adminAuth = await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin', adminAuth ? 'with auth data' : 'but no auth data returned');
    
    // Configure users collection to allow registration
    try {
      console.log('Configuring users collection...');
      
      // Get the ID of the users collection
      console.log('Fetching collections...');
      const collections = await pb.collections.getFullList();
      console.log(`Found ${collections.length} collections`);
      
      const usersCollection = collections.find(c => c.name === 'users');
      
      if (!usersCollection) {
        console.error('Users collection not found. Available collections:');
        collections.forEach(c => console.log(`- ${c.name} (${c.id})`));
        throw new Error('Users collection not found');
      }
      
      console.log('Found users collection:', usersCollection.id);
      console.log('Current permissions:');
      console.log('- createRule:', usersCollection.createRule || '(empty)');
      console.log('- listRule:', usersCollection.listRule || '(empty)');
      console.log('- viewRule:', usersCollection.viewRule || '(empty)');
      
      // Update the users collection permissions only (not changing schema)
      console.log('Updating users collection permissions...');
      const result = await pb.collections.update(usersCollection.id, {
        // Only update the rules
        createRule: "",  // Allow anyone to create a user (register)
        listRule: "",  // Anyone can list users (just for testing)
        viewRule: "",  // Anyone can view users (just for testing)
      });
      
      console.log('Users collection permissions updated successfully:', result.id);
      console.log('New permissions:');
      console.log('- createRule:', result.createRule || '(empty)');
      console.log('- listRule:', result.listRule || '(empty)');
      console.log('- viewRule:', result.viewRule || '(empty)');
      
      // Try to enable email auth if needed
      try {
        console.log('Checking authentication options...');
        console.log('Current options:', usersCollection.options);
        
        console.log('Updating authentication options...');
        const optionsResult = await pb.collections.update(usersCollection.id, {
          options: {
            ...usersCollection.options,
            allowEmailAuth: true,
            requireEmail: true,
            minPasswordLength: 8
          }
        });
        
        console.log('Email authentication options updated:', optionsResult.options);
      } catch (err) {
        console.error('Error updating authentication options:', err);
      }
      
    } catch (err) {
      console.error('Error configuring users collection:', err);
    }
    
    console.log('Users setup completed');
  } catch (err) {
    console.error('Failed to set up users collection:', err);
  }
}

setupUsers(); 