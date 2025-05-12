import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Create a PocketBase client instance
export const pb = new PocketBase('http://127.0.0.1:8090');

// Create a store for the current user
export const currentUser = writable(pb.authStore.model);

// Listen for auth changes and update the store
pb.authStore.onChange((auth) => {
  currentUser.set(pb.authStore.model);
});

// Ticker Service
export const tickerService = {
  // Get all available tickers
  /**
   * Get all available tickers
   * @returns {Promise<Array<{id: string, symbol: string, name: string}>>}
   */
  async getAvailableTickers() {
    try {
      const records = await pb.collection('tickers').getFullList({
        sort: 'symbol',
      });
      return records.map(record => ({
        id: record.id,
        symbol: record.symbol,
        name: record.name
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching tickers:', errorMessage);
      return [];
    }
  },

  // Get user's selected tickers
  /**
   * Get user's selected tickers
   * @param {string} userId - The user ID
   * @returns {Promise<Array<{id: string, symbol: string, name: string}>>}
   */
  async getUserTickers(userId) {
    if (!userId) return [];
    
    try {
      const records = await pb.collection('users_tickers').getFullList({
        filter: `user = "${userId}"`,
        expand: 'ticker'
      });
      
      // Filter out records without valid expand.ticker and map to the required format
      return records
        .filter(record => record.expand && record.expand.ticker)
        .map(record => {
          // We've already filtered for valid expand.ticker
          const ticker = record.expand.ticker;
          return {
            id: ticker.id,
            symbol: ticker.symbol,
            name: ticker.name
          };
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching user tickers:', errorMessage);
      return [];
    }
  },

  // Add ticker to user's watchlist
  /**
   * Add ticker to user's watchlist
   * @param {string} userId - The user ID
   * @param {string} tickerId - The ticker ID
   * @returns {Promise<boolean>}
   */
  async addUserTicker(userId, tickerId) {
    if (!userId) return false;
    
    try {
      await pb.collection('users_tickers').create({
        user: userId,
        ticker: tickerId
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error adding user ticker:', errorMessage);
      return false;
    }
  },

  // Remove ticker from user's watchlist
  /**
   * Remove ticker from user's watchlist
   * @param {string} userId - The user ID
   * @param {string} tickerId - The ticker ID
   * @returns {Promise<boolean>}
   */
  async removeUserTicker(userId, tickerId) {
    if (!userId) return false;
    
    try {
      const record = await pb.collection('users_tickers').getFirstListItem(`user = "${userId}" && ticker = "${tickerId}"`);
      await pb.collection('users_tickers').delete(record.id);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error removing user ticker:', errorMessage);
      return false;
    }
  }
};

// Filing Service
export const filingService = {
  // Get filings for a ticker
  /**
   * Get filings for a ticker
   * @param {string} tickerId - The ticker ID
   * @returns {Promise<Array<Object>>}
   */
  async getFilingsForTicker(tickerId) {
    try {
      const records = await pb.collection('filings').getFullList({
        filter: `ticker = "${tickerId}"`,
        sort: '-date'
      });
      
      return records.map(record => ({
        id: record.id,
        ticker: record.ticker,
        type: record.type,
        date: record.date,
        title: record.title,
        summary: record.summary,
        url: record.url
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching filings:', errorMessage);
      return [];
    }
  },
  
  // Get filings for multiple tickers
  /**
   * Get filings for multiple tickers
   * @param {string[]} tickerIds - Array of ticker IDs
   * @returns {Promise<Array<Object>>}
   */
  async getFilingsForTickers(tickerIds) {
    if (!tickerIds.length) return [];
    
    try {
      const filter = tickerIds.map(id => `ticker = "${id}"`).join(' || ');
      const records = await pb.collection('filings').getFullList({
        filter: filter,
        sort: '-date',
        expand: 'ticker'
      });
      
      return records.map(record => ({
        id: record.id,
        ticker: record.ticker,
        tickerSymbol: record.expand?.ticker?.symbol,
        tickerName: record.expand?.ticker?.name,
        type: record.type,
        date: record.date,
        title: record.title,
        summary: record.summary,
        url: record.url
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching filings for tickers:', errorMessage);
      return [];
    }
  }
};

// Auth Service
export const authService = {
  // Register a new user
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} passwordConfirm - Password confirmation
   * @param {string} name - User name
   * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
   */
  async register(email, password, passwordConfirm, name) {
    try {
      console.log('Registering user with:', { email, name, passwordLength: password.length });
      
      // Prepare the data for registration
      const userData = {
        email,
        password,
        passwordConfirm,
        name
      };
      
      // First try to create the user
      const user = await pb.collection('users').create(userData);
      console.log('User created successfully:', user);
      
      // Then authenticate the user
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log('User authenticated successfully:', authData);
      
      return { success: true, user: authData };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Registration error details:', error);
      
      // Try to extract more detailed error information if available
      let detailedError = errorMessage;
      
      // Check if error has response data (PocketBase API error)
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response) {
        const data = error.response.data;
        if (data.message) {
          detailedError = data.message;
        }
        // Check for field validation errors
        if (data.data) {
          const fields = Object.keys(data.data);
          if (fields.length > 0) {
            const fieldErrors = [];
            // Add specific field errors if available
            fields.forEach(field => {
              if (data.data[field] && data.data[field].message) {
                fieldErrors.push(`${field}: ${data.data[field].message}`);
              }
            });
            
            if (fieldErrors.length > 0) {
              detailedError = fieldErrors.join(', ');
            } else {
              detailedError = `Validation error in fields: ${fields.join(', ')}`;
            }
          }
        }
      }
      
      return { success: false, error: detailedError };
    }
  },
  
  // Login user
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
   */
  async login(email, password) {
    try {
      const user = await pb.collection('users').authWithPassword(email, password);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Login error:', error);
      
      let detailedError = errorMessage;
      // Try to extract more detailed error information if available
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response) {
        const data = error.response.data;
        if (data.message) {
          detailedError = data.message;
        }
      }
      
      return { success: false, error: detailedError };
    }
  },
  
  // Logout user
  /**
   * Logout the current user
   */
  logout() {
    pb.authStore.clear();
  },
  
  // Check if user is logged in
  /**
   * Check if a user is logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    return pb.authStore.isValid;
  },
  
  // Get current user
  /**
   * Get the current user
   * @returns {Object|null}
   */
  getCurrentUser() {
    return pb.authStore.model;
  }
};

// Default export
export default {
  pb,
  currentUser,
  tickerService,
  filingService,
  authService
}; 