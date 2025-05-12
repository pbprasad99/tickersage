import { writable } from 'svelte/store';
import { tickerService, filingService, currentUser } from '$lib/services/pocketbase';
import { SAMPLE_FILINGS } from '$lib/data/sample-filings';

// Mock data for testing
const MOCK_TICKERS = [
  { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc.' },
  { id: 'MSFT', symbol: 'MSFT', name: 'Microsoft Corporation' },
  { id: 'GOOGL', symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { id: 'AMZN', symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { id: 'META', symbol: 'META', name: 'Meta Platforms, Inc.' },
  { id: 'TSLA', symbol: 'TSLA', name: 'Tesla, Inc.' },
  { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { id: 'JPM', symbol: 'JPM', name: 'JPMorgan Chase & Co.' }
];

// Initial state
const initialState = {
  selectedTickers: [],
  availableTickers: [],
  filings: {},
  isLoading: false,
  error: null,
  useMockData: false  // Flag to use mock data when backend isn't available
};

// Create the writable store
const createTickerStore = () => {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    // Initialize the store with data from PocketBase
    init: async () => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Fetch available tickers
        const availableTickers = await tickerService.getAvailableTickers();
        
        if (availableTickers.length === 0) {
          // If no tickers available from backend, use mock data
          console.log('No tickers available from backend, using mock data');
          update(state => ({
            ...initialState,
            availableTickers: MOCK_TICKERS,
            useMockData: true,
            isLoading: false
          }));
        } else {
          // Initialize with real data from backend
          set({
            ...initialState,
            availableTickers,
            isLoading: false
          });
        }
        
        // If user is logged in, fetch their selected tickers
        currentUser.subscribe(async (user) => {
          if (user) {
            try {
              // Try to get user's tickers from backend
              const userTickers = await tickerService.getUserTickers(user.id);
              
              update(state => {
                // If using mock data or no tickers yet, add some defaults
                if (state.useMockData || userTickers.length === 0) {
                  // For mock data, provide some default selections
                  const mockSelections = [MOCK_TICKERS[0], MOCK_TICKERS[1], MOCK_TICKERS[2]];
                  
                  // Add sample filings for these tickers
                  const mockFilingsMap = {};
                  mockSelections.forEach(ticker => {
                    const symbol = ticker.symbol;
                    if (SAMPLE_FILINGS[symbol]) {
                      mockFilingsMap[ticker.id] = SAMPLE_FILINGS[symbol];
                    }
                  });
                  
                  return { 
                    ...state, 
                    selectedTickers: mockSelections,
                    filings: mockFilingsMap
                  };
                }
                
                return { ...state, selectedTickers: userTickers };
              });
              
              // For real data, fetch filings
              if (!state.useMockData && userTickers.length > 0) {
                await this.fetchFilingsForTickers(userTickers.map(t => t.id));
              }
            } catch (error) {
              console.error('Error fetching user tickers:', error);
              
              // Fall back to mock data on error
              update(state => {
                if (!state.useMockData) {
                  const mockSelections = [MOCK_TICKERS[0], MOCK_TICKERS[1]];
                  const mockFilingsMap = {};
                  mockSelections.forEach(ticker => {
                    const symbol = ticker.symbol;
                    if (SAMPLE_FILINGS[symbol]) {
                      mockFilingsMap[ticker.id] = SAMPLE_FILINGS[symbol];
                    }
                  });
                  
                  return { 
                    ...state, 
                    useMockData: true,
                    selectedTickers: mockSelections,
                    filings: mockFilingsMap
                  };
                }
                return state;
              });
            }
          }
        });
      } catch (error) {
        console.error('Error initializing ticker store:', error);
        
        // Fall back to mock data
        update(state => {
          const mockFilingsMap = {};
          MOCK_TICKERS.slice(0, 3).forEach(ticker => {
            const symbol = ticker.symbol;
            if (SAMPLE_FILINGS[symbol]) {
              mockFilingsMap[ticker.id] = SAMPLE_FILINGS[symbol];
            }
          });
  
          return { 
            ...initialState, 
            availableTickers: MOCK_TICKERS,
            selectedTickers: MOCK_TICKERS.slice(0, 3),
            filings: mockFilingsMap,
            useMockData: true,
            isLoading: false
          };
        });
      }
    },
    
    // Fetch filings for selected tickers
    fetchFilingsForTickers: async (tickerIds) => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Get current state
        const currentState = get_store_value(subscribe);
        
        if (currentState.useMockData) {
          // Use sample filings data
          const mockFilingsMap = {};
          tickerIds.forEach(id => {
            // Look up the ticker symbol from the selected tickers
            const ticker = currentState.selectedTickers.find(t => t.id === id);
            if (ticker && SAMPLE_FILINGS[ticker.symbol]) {
              mockFilingsMap[id] = SAMPLE_FILINGS[ticker.symbol];
            } else {
              mockFilingsMap[id] = [];
            }
          });
          
          update(state => ({
            ...state,
            filings: mockFilingsMap,
            isLoading: false
          }));
          return;
        }
        
        // Use real backend data
        const filings = await filingService.getFilingsForTickers(tickerIds);
        
        // Group filings by ticker
        const filingsMap = {};
        tickerIds.forEach(id => { filingsMap[id] = []; });
        
        filings.forEach(filing => {
          if (!filingsMap[filing.ticker]) {
            filingsMap[filing.ticker] = [];
          }
          filingsMap[filing.ticker].push(filing);
        });
        
        update(state => ({
          ...state,
          filings: filingsMap,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching filings:', error);
        
        // Fall back to mock data on error
        update(state => {
          const currentState = get_store_value(subscribe);
          
          if (!currentState.useMockData) {
            // Find which of the requested ticker IDs have sample data
            const mockFilingsMap = {};
            tickerIds.forEach(id => {
              // Look up the ticker symbol from the selected tickers
              const ticker = currentState.selectedTickers.find(t => t.id === id);
              if (ticker && SAMPLE_FILINGS[ticker.symbol]) {
                mockFilingsMap[id] = SAMPLE_FILINGS[ticker.symbol];
              } else {
                mockFilingsMap[id] = [];
              }
            });
            
            return {
              ...state,
              useMockData: true,
              filings: mockFilingsMap,
              isLoading: false
            };
          }
          return {
            ...state,
            isLoading: false,
            error: 'Failed to fetch SEC filings'
          };
        });
      }
    },
    
    // Add a ticker to the watchlist
    addTicker: async (ticker) => {
      update(state => {
        if (state.selectedTickers.some(t => t.id === ticker.id)) {
          return state;
        }
        
        // First update the UI immediately for better user experience
        return {
          ...state,
          selectedTickers: [...state.selectedTickers, ticker]
        };
      });
      
      // Get the current state
      const state = get_store_value(subscribe);
      
      // If using mock data, add sample filings
      if (state.useMockData) {
        update(state => {
          const mockFilings = SAMPLE_FILINGS[ticker.symbol] || [];
          return {
            ...state,
            filings: {
              ...state.filings,
              [ticker.id]: mockFilings
            }
          };
        });
        return;
      }
      
      // Then persist to the backend if user is logged in
      const user = get_current_user();
      if (user) {
        try {
          await tickerService.addUserTicker(user.id, ticker.id);
          
          // Fetch filings for the new ticker
          const filings = await filingService.getFilingsForTicker(ticker.id);
          
          update(state => ({
            ...state,
            filings: {
              ...state.filings,
              [ticker.id]: filings
            }
          }));
        } catch (error) {
          console.error('Error adding ticker to watchlist:', error);
          
          // Revert the UI change if the backend operation failed
          update(state => ({
            ...state,
            selectedTickers: state.selectedTickers.filter(t => t.id !== ticker.id),
            error: 'Failed to add ticker to watchlist'
          }));
        }
      }
    },
    
    // Remove a ticker from the watchlist
    removeTicker: async (tickerId) => {
      // Store the ticker before removing for potential rollback
      let removedTicker;
      
      update(state => {
        removedTicker = state.selectedTickers.find(t => t.id === tickerId);
        return {
          ...state,
          selectedTickers: state.selectedTickers.filter(t => t.id !== tickerId)
        };
      });
      
      // Get the current state
      const state = get_store_value(subscribe);
      
      // If using mock data, no need to update backend
      if (state.useMockData) {
        return;
      }
      
      // Persist to the backend if user is logged in
      const user = get_current_user();
      if (user && removedTicker) {
        try {
          await tickerService.removeUserTicker(user.id, tickerId);
        } catch (error) {
          console.error('Error removing ticker from watchlist:', error);
          
          // Revert the UI change if the backend operation failed
          update(state => ({
            ...state,
            selectedTickers: [...state.selectedTickers, removedTicker],
            error: 'Failed to remove ticker from watchlist'
          }));
        }
      }
    },
    
    // Reset the store to its initial state
    reset: () => set(initialState)
  };
};

// Helper to get current value from store
function get_store_value(subscribe) {
  let value;
  const unsubscribe = subscribe(v => value = v);
  unsubscribe();
  return value;
}

// Helper to get current user
function get_current_user() {
  let user;
  const unsubscribe = currentUser.subscribe(u => user = u);
  unsubscribe();
  return user;
}

export const tickerStore = createTickerStore(); 