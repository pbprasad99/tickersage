import fs from 'fs';
import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function applySchema() {
  // Read the schema file
  const schemaData = fs.readFileSync('./pb_schema.json', 'utf8');
  const schema = JSON.parse(schemaData);
  
  // Import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  
  try {
    // Login as admin
    await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin');
    
    // Process each collection in the schema
    for (const collection of schema.collections) {
      try {
        // Check if collection exists
        try {
          await pb.collections.getOne(collection.name);
          console.log(`Collection ${collection.name} already exists, updating...`);
          
          // Update collection
          await pb.collections.update(collection.name, collection);
        } catch (err) {
          if (err.status === 404) {
            // Collection doesn't exist, create it
            console.log(`Creating collection ${collection.name}...`);
            await pb.collections.create(collection);
          } else {
            throw err;
          }
        }
        
        console.log(`Collection ${collection.name} processed successfully`);
      } catch (err) {
        console.error(`Error processing collection ${collection.name}:`, err);
      }
    }
    
    console.log('Schema application completed successfully');
  } catch (err) {
    console.error('Failed to apply schema:', err);
  }
}

applySchema(); 