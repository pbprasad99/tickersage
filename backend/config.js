/**
 * Configuration variables for the TickerSage backend.
 * 
 * Note: For production, these should be loaded from environment variables.
 * Passwords should never be hardcoded in a real application.
 */

export default {
  // PocketBase configuration
  pocketbase: {
    url: process.env.PB_URL || 'http://127.0.0.1:8090',
    admin: {
      email: process.env.PB_ADMIN_EMAIL || 'admin@tickersage.com',
      // Password is loaded from environment variable and not stored in code
    }
  }
}; 