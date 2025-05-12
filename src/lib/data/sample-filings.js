// Sample filing data with reliable public PDF URLs
export const SAMPLE_FILINGS = {
  'AAPL': [
    {
      id: 'aapl-10k-2023',
      ticker: 'AAPL',
      type: '10-K',
      date: '2023-10-28',
      title: 'Annual Report 2023',
      summary: 'Apple reported record annual revenue of $394.3 billion, down 3% year over year, and annual earnings per diluted share of $5.97, down 1% year over year. Services revenue reached an all-time record of $85.2 billion, up 9% year over year. The company also declared a cash dividend of $0.24 per share.',
      url: 'https://www.sec.gov/files/form10-k.pdf'
    },
    {
      id: 'aapl-8k-2023',
      ticker: 'AAPL',
      type: '8-K',
      date: '2023-09-12',
      title: 'Apple Special Event',
      summary: 'Apple announced the new iPhone 15 lineup with USB-C ports, Apple Watch Series 9, and AirPods Pro with USB-C. The company emphasized environmental sustainability with carbon-neutral products and enhanced artificial intelligence features across their device lineup.',
      url: 'https://www.sec.gov/files/form8-k.pdf'
    }
  ],
  'MSFT': [
    {
      id: 'msft-10q-2023',
      ticker: 'MSFT',
      type: '10-Q',
      date: '2023-10-31',
      title: 'Quarterly Report Q3 2023',
      summary: 'Microsoft reported revenue of $56.5 billion for Q3 2023, up 13% year-over-year. Cloud revenue grew 24% to $31.8 billion. Azure and other cloud services revenue increased by 29%. The company continued to invest heavily in AI capabilities across its product lineup, particularly in Microsoft 365 and Azure OpenAI Service.',
      url: 'https://www.sec.gov/files/form10-q.pdf'
    }
  ],
  'GOOGL': [
    {
      id: 'googl-8k-2023',
      ticker: 'GOOGL',
      type: '8-K',
      date: '2023-10-15',
      title: 'Google DeepMind AI Breakthrough',
      summary: 'Alphabet announced a significant breakthrough in AI research through Google DeepMind. The company demonstrated a new multimodal AI system capable of understanding and generating content across text, images, and video with significantly improved accuracy and reduced computational requirements.',
      url: 'https://www.sec.gov/files/form8-k.pdf'
    }
  ]
};

export default SAMPLE_FILINGS; 