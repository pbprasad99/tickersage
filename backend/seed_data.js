// Use dynamic imports for PocketBase
import config from './config.js';

// Read admin password from environment variables
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Error: PB_ADMIN_PASSWORD environment variable is required');
  console.error('Please set it before running this script:');
  console.error('  export PB_ADMIN_PASSWORD=your_password');
  process.exit(1);
}

async function seedDatabase() {
  // Dynamically import PocketBase
  const { default: PocketBase } = await import('pocketbase');
  
  // Initialize PocketBase client
  const pb = new PocketBase(config.pocketbase.url);
  
  try {
    // Create an admin user to access the API
    await pb.admins.authWithPassword(config.pocketbase.admin.email, ADMIN_PASSWORD);
    
    console.log('Seeding tickers...');
    
    // Seed tickers
    const tickers = [
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
    
    // Create tickers
    const tickerRecords = {};
    for (const ticker of tickers) {
      try {
        // Check if ticker already exists
        let record;
        try {
          const existingRecords = await pb.collection('tickers').getFullList({
            filter: `symbol = "${ticker.symbol}"`
          });
          
          if (existingRecords.length > 0) {
            record = existingRecords[0];
            console.log(`Ticker ${ticker.symbol} already exists, using existing record`);
          } else {
            record = await pb.collection('tickers').create(ticker);
            console.log(`Created ticker: ${ticker.symbol}`);
          }
        } catch (err) {
          record = await pb.collection('tickers').create(ticker);
          console.log(`Created ticker: ${ticker.symbol}`);
        }
        
        tickerRecords[ticker.symbol] = record.id;
      } catch (err) {
        console.error(`Error creating ticker ${ticker.symbol}:`, err);
      }
    }
    
    console.log('Seeding filings...');
    
    // Seed filings with direct ticker IDs for the simplified schema
    const filings = [
      {
        ticker: tickerRecords['AAPL'],
        type: '10-K',
        date: '2023-10-27',
        title: 'Annual Report',
        summary: 'Apple reported a record annual revenue of $394.3 billion with iPhone sales continuing to be the main revenue driver. Services segment showed strong growth, reaching $85.2 billion. The company faces challenges in China market but continues to innovate with new AI capabilities.',
        url: 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000077/aapl-20230930.htm'
      },
      {
        ticker: tickerRecords['AAPL'],
        type: '10-Q',
        date: '2023-07-20',
        title: 'Quarterly Report',
        summary: 'Apple reported a slight decline in quarterly revenue to $81.8 billion (-1.4% YoY). iPhone and Services segments performed well, while Mac and iPad sales decreased. The company announced a $90 billion share repurchase authorization.',
        url: 'https://www.sec.gov/Archives/edgar/data/320193/000032019323000077/aapl-20230624.htm'
      },
      {
        ticker: tickerRecords['MSFT'],
        type: '10-K',
        date: '2023-07-27',
        title: 'Annual Report',
        summary: 'Microsoft achieved record revenue of $211.9 billion (+7% YoY), driven by cloud services growth. Azure revenue grew by 27%. The company continues to invest heavily in AI technology across its product portfolio and announced layoffs of approximately 10,000 employees.',
        url: 'https://www.sec.gov/Archives/edgar/data/789019/000095017023034773/msft-20230630.htm'
      },
      {
        ticker: tickerRecords['MSFT'],
        type: '8-K',
        date: '2023-01-18',
        title: 'Current Report',
        summary: 'Microsoft announced a strategic partnership with OpenAI, investing $10 billion. The company plans to integrate ChatGPT technology across Microsoft products including Azure, Bing, and Microsoft 365.',
        url: 'https://www.sec.gov/Archives/edgar/data/789019/000119312523009797/d464154d8k.htm'
      },
      {
        ticker: tickerRecords['GOOGL'],
        type: '10-Q',
        date: '2023-07-25',
        title: 'Quarterly Report',
        summary: 'Alphabet reported Q2 revenue of $74.6 billion (+7% YoY). Google Search remains the main revenue driver. YouTube ad revenue recovered after previous declines. Google Cloud achieved profitability for the first time with $8 billion in revenue.',
        url: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204423000069/goog-20230630.htm'
      },
      {
        ticker: tickerRecords['TSLA'],
        type: '10-Q',
        date: '2023-10-18',
        title: 'Quarterly Report',
        summary: 'Tesla reported Q3 revenue of $23.4 billion (-1% YoY) with automotive revenue down 3%. Delivered 435,059 vehicles with reduced average selling prices. Energy generation and storage business grew 40% YoY. The company continues to invest in AI and robotics.',
        url: 'https://www.sec.gov/Archives/edgar/data/1318605/000095017023051558/tsla-20230930.htm'
      },
      {
        ticker: tickerRecords['AMZN'],
        type: '10-Q',
        date: '2023-10-26',
        title: 'Quarterly Report',
        summary: 'Amazon reported Q3 revenue of $143.1 billion (+13% YoY). AWS revenue grew 12% YoY to $23.1 billion. Advertising services showed strong growth at $12.1 billion. The company continues to reduce workforce and optimize operations for greater efficiency.',
        url: 'https://www.sec.gov/Archives/edgar/data/1018724/000101872423000080/amzn-20230930.htm'
      }
    ];
    
    // Create filings
    for (const filing of filings) {
      try {
        await pb.collection('filings').create(filing);
        console.log(`Created filing: ${filing.title} for ${filing.ticker}`);
      } catch (err) {
        console.error(`Error creating filing ${filing.title}:`, err);
      }
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (err) {
    console.error('Database seeding failed:', err);
  }
}

seedDatabase(); 