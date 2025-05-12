# State Management

TickerSage uses Svelte's built-in store system for state management. This document describes how state is managed throughout the application.

## Store Overview

The application's state is centralized in a single Svelte store called `tickerStore`, defined in `src/lib/stores/tickerStore.js`. This store manages:

1. Available tickers
2. Selected tickers (watchlist)
3. SEC filings data
4. Application status (loading, errors)

## Store Implementation

The `tickerStore` is implemented as a writable store with custom methods:

```javascript
// Create the writable store
const createTickerStore = () => {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    addTicker: (ticker) => {
      update(state => {
        if (state.selectedTickers.some(t => t.symbol === ticker.symbol)) {
          return state;
        }
        return {
          ...state,
          selectedTickers: [...state.selectedTickers, ticker]
        };
      });
    },
    removeTicker: (symbol) => {
      update(state => ({
        ...state,
        selectedTickers: state.selectedTickers.filter(t => t.symbol !== symbol)
      }));
    },
    reset: () => set(initialState)
  };
};

export const tickerStore = createTickerStore();
```

## Store Structure

The store's structure is defined with an initial state object:

```javascript
// Initial state
const initialState = {
  selectedTickers: [],         // Tickers added to watchlist
  availableTickers,            // List of all available tickers
  filings: mockFilings,        // SEC filings data
  isLoading: false,            // Loading state flag
  error: null                  // Error state
};
```

### Available Tickers

Available tickers are predefined in the store with their symbol and name:

```javascript
const availableTickers = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  // ...more tickers
];
```

### SEC Filings

Currently, the application uses mock filing data organized by ticker symbol:

```javascript
const mockFilings = {
  AAPL: [
    {
      id: 'aapl-10k-2023',
      ticker: 'AAPL',
      type: '10-K',
      date: '2023-10-27',
      title: 'Annual Report',
      summary: '...',
      url: '#'
    },
    // ...more AAPL filings
  ],
  // ...more ticker filings
};
```

## Store Operations

The store provides three main operations:

1. **addTicker(ticker)**: Adds a ticker to the watchlist if it's not already there
2. **removeTicker(symbol)**: Removes a ticker from the watchlist by symbol
3. **reset()**: Resets the store to its initial state

## Subscribing to the Store

Components subscribe to the store using Svelte's `$` syntax, which automatically sets up and cleans up subscriptions:

```svelte
<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  
  // Access store values with $ prefix
  $: selectedTickers = $tickerStore.selectedTickers;
</script>
```

## Reactive Statements

The application uses Svelte's reactive statements (prefixed with `$:`) to derive additional data from the store:

```svelte
// Create a filtered and sorted list of filings based on selected tickers
$: filings = $tickerStore.selectedTickers
  .flatMap(ticker => {
    const tickerFilings = $tickerStore.filings[ticker.symbol] || [];
    return tickerFilings.map(filing => ({
      ...filing,
      tickerSymbol: ticker.symbol,
      tickerName: ticker.name
    }));
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

## Future State Management Enhancements

1. **Persistent Storage**: Add persistence using localStorage or IndexedDB
2. **Server Synchronization**: Add functionality to sync state with a backend
3. **Derived Stores**: Create additional derived stores for complex calculations
4. **Action Logging**: Add logging for debugging and analytics
5. **Undo/Redo**: Implement history tracking for user actions 