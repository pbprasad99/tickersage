import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function setupCollections() {
  // Import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  
  try {
    // Login as admin
    await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    console.log('Successfully authenticated as admin');
    
    // Create collections one by one with simpler schema
    
    // 0. Configure users collection to allow registration
    try {
      console.log('Configuring users collection...');
      // Get the existing users collection
      const usersCollection = await pb.collections.getOne('users');
      
      // Update it to allow self-registration and enable email/password auth
      await pb.collections.update(usersCollection.id, {
        name: usersCollection.name,
        type: usersCollection.type,
        schema: [
          ...usersCollection.schema,
          {
            name: 'name',
            type: 'text',
            required: false
          }
        ],
        // Rules
        listRule: "",
        viewRule: "",
        createRule: "",  // Allow anyone to create a user (register)
        updateRule: "@request.auth.id = id", // Users can only update their own records
        deleteRule: "@request.auth.id = id", // Users can only delete their own records
        // Options
        options: {
          ...usersCollection.options,
          allowEmailAuth: true,
          allowOAuth2Auth: false,
          allowUsernameAuth: false,
          exceptEmailDomains: null,
          minPasswordLength: 8,
          onlyEmailDomains: null,
          requireEmail: true
        }
      });
      console.log('Users collection configured successfully');
    } catch (err) {
      console.error('Error configuring users collection:', err);
    }
    
    // 1. Update tickers collection permissions to allow public read
    try {
      const tickersCollection = await pb.collections.getOne('tickers');
      console.log('Updating permissions for tickers collection...');
      await pb.collections.update(tickersCollection.id, {
        name: tickersCollection.name,
        type: tickersCollection.type,
        schema: tickersCollection.schema,
        listRule: "", // Allow anyone to list tickers
        viewRule: "", // Allow anyone to view ticker details
        createRule: "@request.auth.id != ''", // Only authenticated users can create
        updateRule: "@request.auth.id != ''", // Only authenticated users can update
        deleteRule: "@request.auth.id != ''" // Only authenticated users can delete
      });
      console.log('Updated permissions for tickers collection');
    } catch (err) {
      console.error('Error updating tickers collection:', err);
    }
    
    // 2. Try to create filings collection
    try {
      // Check if collection exists
      try {
        const filingsCollection = await pb.collections.getOne('filings');
        console.log('Updating permissions for filings collection...');
        await pb.collections.update(filingsCollection.id, {
          name: filingsCollection.name,
          type: filingsCollection.type,
          schema: filingsCollection.schema,
          listRule: "", // Allow anyone to list filings
          viewRule: "", // Allow anyone to view filing details
          createRule: "@request.auth.id != ''", // Only authenticated users can create
          updateRule: "@request.auth.id != ''", // Only authenticated users can update
          deleteRule: "@request.auth.id != ''" // Only authenticated users can delete
        });
        console.log('Updated permissions for filings collection');
      } catch (err) {
        if (err.status === 404) {
          // Create filings collection
          console.log('Creating filings collection...');
          await pb.collections.create({
            name: 'filings',
            type: 'base',
            schema: [
              {
                name: 'ticker',
                type: 'text',
                required: true
              },
              {
                name: 'type',
                type: 'text',
                required: true
              },
              {
                name: 'date',
                type: 'date',
                required: true
              },
              {
                name: 'title',
                type: 'text',
                required: true
              },
              {
                name: 'summary',
                type: 'text',
                required: true
              },
              {
                name: 'url',
                type: 'url',
                required: false
              }
            ],
            listRule: "", // Allow anyone to list filings
            viewRule: "", // Allow anyone to view filing details
            createRule: "@request.auth.id != ''", // Only authenticated users can create
            updateRule: "@request.auth.id != ''", // Only authenticated users can update
            deleteRule: "@request.auth.id != ''" // Only authenticated users can delete
          });
          console.log('Collection filings created successfully');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error processing filings collection:', err);
    }
    
    // 3. Try to create users_tickers collection
    try {
      // Check if collection exists
      try {
        const usersTickersCollection = await pb.collections.getOne('users_tickers');
        console.log('Updating permissions for users_tickers collection...');
        await pb.collections.update(usersTickersCollection.id, {
          name: usersTickersCollection.name,
          type: usersTickersCollection.type,
          schema: usersTickersCollection.schema,
          listRule: "@request.auth.id = user", // Only allow users to list their own watchlist
          viewRule: "@request.auth.id = user", // Only allow users to view their own watchlist items
          createRule: "@request.auth.id = user", // Only allow users to create items in their own watchlist
          updateRule: "@request.auth.id = user", // Only allow users to update their own watchlist items
          deleteRule: "@request.auth.id = user" // Only allow users to delete their own watchlist items
        });
        console.log('Updated permissions for users_tickers collection');
      } catch (err) {
        if (err.status === 404) {
          // Create users_tickers collection
          console.log('Creating users_tickers collection...');
          await pb.collections.create({
            name: 'users_tickers',
            type: 'base',
            schema: [
              {
                name: 'user',
                type: 'text',
                required: true
              },
              {
                name: 'ticker',
                type: 'text',
                required: true
              }
            ],
            listRule: "@request.auth.id = user", // Only allow users to list their own watchlist
            viewRule: "@request.auth.id = user", // Only allow users to view their own watchlist items
            createRule: "@request.auth.id = user", // Only allow users to create items in their own watchlist
            updateRule: "@request.auth.id = user", // Only allow users to update their own watchlist items
            deleteRule: "@request.auth.id = user" // Only allow users to delete their own watchlist items
          });
          console.log('Collection users_tickers created successfully');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Error processing users_tickers collection:', err);
    }
    
    console.log('Manual setup completed');
  } catch (err) {
    console.error('Failed to set up collections:', err);
  }
}

setupCollections(); 