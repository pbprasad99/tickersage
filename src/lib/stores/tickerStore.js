import { writable } from 'svelte/store';

// Mock data for SEC filings
const mockFilings = {
  AAPL: [
    {
      id: 'aapl-10k-2023',
      ticker: 'AAPL',
      type: '10-K',
      date: '2023-10-27',
      title: 'Annual Report',
      summary: 'Apple reported a record annual revenue of $394.3 billion with iPhone sales continuing to be the main revenue driver. Services segment showed strong growth, reaching $85.2 billion. The company faces challenges in China market but continues to innovate with new AI capabilities.',
      url: '#'
    },
    {
      id: 'aapl-10q-2023q3',
      ticker: 'AAPL',
      type: '10-Q',
      date: '2023-07-20',
      title: 'Quarterly Report',
      summary: 'Apple reported a slight decline in quarterly revenue to $81.8 billion (-1.4% YoY). iPhone and Services segments performed well, while Mac and iPad sales decreased. The company announced a $90 billion share repurchase authorization.',
      url: '#'
    }
  ],
  MSFT: [
    {
      id: 'msft-10k-2023',
      ticker: 'MSFT',
      type: '10-K',
      date: '2023-07-27',
      title: 'Annual Report',
      summary: 'Microsoft achieved record revenue of $211.9 billion (+7% YoY), driven by cloud services growth. Azure revenue grew by 27%. The company continues to invest heavily in AI technology across its product portfolio and announced layoffs of approximately 10,000 employees.',
      url: '#'
    },
    {
      id: 'msft-8k-2023',
      ticker: 'MSFT',
      type: '8-K',
      date: '2023-01-18',
      title: 'Current Report',
      summary: 'Microsoft announced a strategic partnership with OpenAI, investing $10 billion. The company plans to integrate ChatGPT technology across Microsoft products including Azure, Bing, and Microsoft 365.',
      url: '#'
    }
  ],
  GOOGL: [
    {
      id: 'googl-10q-2023q2',
      ticker: 'GOOGL',
      type: '10-Q',
      date: '2023-07-25',
      title: 'Quarterly Report',
      summary: 'Alphabet reported Q2 revenue of $74.6 billion (+7% YoY). Google Search remains the main revenue driver. YouTube ad revenue recovered after previous declines. Google Cloud achieved profitability for the first time with $8 billion in revenue.',
      url: '#'
    }
  ],
  TSLA: [
    {
      id: 'tsla-10q-2023q3',
      ticker: 'TSLA',
      type: '10-Q',
      date: '2023-10-18',
      title: 'Quarterly Report',
      summary: 'Tesla reported Q3 revenue of $23.4 billion (-1% YoY) with automotive revenue down 3%. Delivered 435,059 vehicles with reduced average selling prices. Energy generation and storage business grew 40% YoY. The company continues to invest in AI and robotics.',
      url: '#'
    }
  ],
  AMZN: [
    {
      id: 'amzn-10q-2023q3',
      ticker: 'AMZN',
      type: '10-Q',
      date: '2023-10-26',
      title: 'Quarterly Report',
      summary: 'Amazon reported Q3 revenue of $143.1 billion (+13% YoY). AWS revenue grew 12% YoY to $23.1 billion. Advertising services showed strong growth at $12.1 billion. The company continues to reduce workforce and optimize operations for greater efficiency.',
      url: '#'
    }
  ]
};

// Available stock tickers
const availableTickers = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' }
];

// Initial state
const initialState = {
  selectedTickers: [],
  availableTickers,
  filings: mockFilings,
  isLoading: false,
  error: null
};

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