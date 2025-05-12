import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function checkSchema() {
  // Import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  console.log('PocketBase client initialized with URL:', config.pocketbase.url);
  
  try {
    // Login as admin
    console.log('Attempting to authenticate as admin:', config.pocketbase.admin.email);
    await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin');
    
    // Get the collections list
    console.log('Fetching collections...');
    const collections = await pb.collections.getFullList();
    console.log(`Found ${collections.length} collections`);
    
    // Find and examine the users collection
    const usersCollection = collections.find(c => c.name === 'users');
    
    if (!usersCollection) {
      console.error('Users collection not found. Available collections:');
      collections.forEach(c => console.log(`- ${c.name} (${c.id})`));
      return;
    }
    
    console.log('\nUsers Collection Details:');
    console.log('-------------------------');
    console.log('ID:', usersCollection.id);
    console.log('Name:', usersCollection.name);
    console.log('Type:', usersCollection.type);
    
    console.log('\nPermissions:');
    console.log('- Create Rule:', usersCollection.createRule || '(empty)');
    console.log('- List Rule:', usersCollection.listRule || '(empty)');
    console.log('- View Rule:', usersCollection.viewRule || '(empty)');
    console.log('- Update Rule:', usersCollection.updateRule || '(empty)');
    console.log('- Delete Rule:', usersCollection.deleteRule || '(empty)');
    
    console.log('\nAuthentication Options:');
    console.log(JSON.stringify(usersCollection.options, null, 2));
    
    console.log('\nSchema Fields:');
    if (usersCollection.schema && usersCollection.schema.length > 0) {
      usersCollection.schema.forEach(field => {
        console.log(`- ${field.name} (${field.type})`);
        console.log('  Required:', field.required);
        console.log('  System:', field.system);
        if (field.options) {
          console.log('  Options:', JSON.stringify(field.options));
        }
        console.log();
      });
    } else {
      console.log('No schema fields found');
    }
    
    // Try a test registration to see the exact error
    try {
      console.log('\nTrying a test registration...');
      const testUser = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'Test User'
      };
      
      const result = await pb.collection('users').create(testUser);
      console.log('Test registration successful!', result.id);
    } catch (error) {
      console.error('Test registration failed:');
      console.error('Error message:', error.message);
      
      if (error.data) {
        console.error('Error data:', JSON.stringify(error.data, null, 2));
      }
      
      if (error.response && error.response.data) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
  } catch (err) {
    console.error('Error checking schema:', err);
  }
}

checkSchema(); 