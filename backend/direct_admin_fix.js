// This script uses direct API requests to configure the users collection
// since we're having issues with the PocketBase SDK

import { exec } from 'child_process';
import fs from 'fs';

// Admin credentials
const ADMIN_EMAIL = 'admin@tickersage.com';
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const API_URL = 'http://127.0.0.1:8090/api';

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

// Function to run a curl command
function runCurl(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
        return;
      }
      
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Response was:', stdout);
        reject(parseError);
      }
    });
  });
}

async function fixUsersCollection() {
  try {
    console.log('Logging in as admin to get auth token...');
    
    // Login as admin to get an auth token
    const loginCmd = `curl -s -X POST "${API_URL}/admins/auth-with-password" \\
      -H "Content-Type: application/json" \\
      -d '{"identity":"${ADMIN_EMAIL}","password":"${ADMIN_PASSWORD}"}'`;
    
    const loginResult = await runCurl(loginCmd);
    
    // Debug the login response structure
    console.log('Login response structure:', Object.keys(loginResult));
    
    // Check different possible structures for the token
    let adminToken;
    if (loginResult.token) {
      adminToken = loginResult.token;
    } else if (loginResult.data && loginResult.data.token) {
      adminToken = loginResult.data.token;
    } else {
      console.error('Failed to extract token from response:', loginResult);
      return;
    }
    
    console.log('Successfully authenticated as admin');
    console.log('Using admin token:', adminToken.substring(0, 10) + '...');
    
    // Get the users collection ID
    console.log('Getting collections list...');
    const collectionsCmd = `curl -s "${API_URL}/collections" \\
      -H "Authorization: Admin ${adminToken}"`;
    
    const collections = await runCurl(collectionsCmd);
    
    // Debug the response to see its structure
    console.log('Collections response structure:', Object.keys(collections));
    
    // Check if we got an error response
    if (collections.code && collections.code !== 200) {
      console.error('Error getting collections:', collections.message || 'Unknown error');
      return;
    }
    
    // Check if the response has an items property
    let usersCollection;
    let collectionsList = [];
    
    if (collections.items && Array.isArray(collections.items)) {
      collectionsList = collections.items;
    } else if (Array.isArray(collections)) {
      collectionsList = collections;
    } else if (collections.data && Array.isArray(collections.data)) {
      collectionsList = collections.data;
    }
    
    // Look for the users collection
    usersCollection = collectionsList.find(c => c.name === 'users');
    
    if (!usersCollection) {
      console.error('Users collection not found. Collections available:', 
        collectionsList.length > 0 
          ? collectionsList.map(c => c.name || 'unnamed').join(', ')
          : 'None');
      // Dump collection data for debugging
      console.log('Collections data:', JSON.stringify(collections, null, 2));
      return;
    }
    
    console.log('Found users collection:', usersCollection.id);
    
    // Update the users collection to allow registration and set permissions
    const updateData = {
      createRule: "", // Allow anyone to create a user (register)
      listRule: "", // Anyone can list users (for testing)
      viewRule: "", // Anyone can view users (for testing)
    };
    
    console.log('Updating users collection with permissions:', updateData);
    
    // Save update data to a temp file for curl
    fs.writeFileSync('temp_update.json', JSON.stringify(updateData));
    
    // Update the collection
    const updateCmd = `curl -s -X PATCH "${API_URL}/collections/${usersCollection.id}" \\
      -H "Authorization: Admin ${adminToken}" \\
      -H "Content-Type: application/json" \\
      -d @temp_update.json`;
    
    const updateResult = await runCurl(updateCmd);
    
    console.log('Collection update result:', updateResult);
    
    // Clean up temp file
    fs.unlinkSync('temp_update.json');
    
    console.log('Users collection successfully configured');
    
  } catch (error) {
    console.error('Failed to fix users collection:', error);
  }
}

fixUsersCollection(); 