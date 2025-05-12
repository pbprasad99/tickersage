<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  import { tick } from 'svelte';
  
  let searchTerm = '';
  let filteredTickers = [];
  let isDropdownOpen = false;
  let selectedTickers = [];
  
  $: {
    if (searchTerm.length > 0) {
      filteredTickers = $tickerStore.availableTickers.filter(ticker => 
        ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ticker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      isDropdownOpen = true;
    } else {
      filteredTickers = [];
      isDropdownOpen = false;
    }
  }
  
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
  
  function addTicker(ticker) {
    tickerStore.addTicker(ticker);
    searchTerm = '';
    isDropdownOpen = false;
  }
  
  function removeTicker(symbol) {
    tickerStore.removeTicker(symbol);
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
</script>

<svelte:head>
  <title>TickerSage - SEC Filing Tracker</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      color: #333;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 15px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid #e5e7eb;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    h1 {
      font-size: 24px;
      color: #2563eb;
      margin: 0;
    }
    h2 {
      font-size: 20px;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    h3 {
      font-size: 16px;
      color: #4b5563;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .card {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease-in-out;
    }
    .card:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.08);
    }
    .search-container {
      margin-bottom: 24px;
    }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.2s ease;
    }
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .dropdown {
      position: relative;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 10;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .dropdown-item {
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .dropdown-item:hover {
      background-color: #f9fafb;
    }
    .dropdown-item:last-child {
      border-bottom: none;
    }
    .ticker-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }
    .ticker-item {
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
    }
    .ticker-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    }
    .ticker-symbol {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
    .ticker-name {
      font-size: 14px;
      color: #64748b;
      margin-top: 4px;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 20px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    .remove-btn:hover {
      background-color: #fee2e2;
    }
    .filing-item {
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background-color: #fff;
      transition: all 0.2s ease;
    }
    .filing-item:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .filing-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      align-items: center;
    }
    .filing-type {
      display: inline-block;
      padding: 4px 10px;
      background-color: #dbeafe;
      color: #1e40af;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
    .filing-type.type-10K {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .filing-type.type-10Q {
      background-color: #dcfce7;
      color: #166534;
    }
    .filing-type.type-8K {
      background-color: #f3e8ff;
      color: #6b21a8;
    }
    .filing-date {
      color: #64748b;
      font-size: 14px;
    }
    .filing-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #1e293b;
    }
    .filing-summary {
      color: #4b5563;
      line-height: 1.5;
      font-size: 15px;
    }
    .ticker-badge {
      padding: 2px 8px;
      background-color: #f1f5f9;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      color: #334155;
    }
    button {
      padding: 8px 16px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    button:hover {
      background-color: #2563eb;
    }
    .add-btn {
      padding: 6px 12px;
      font-size: 14px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #64748b;
      border: 2px dashed #e5e7eb;
      border-radius: 8px;
      background-color: #f8fafc;
    }
    .empty-state h3 {
      color: #334155;
      margin-bottom: 8px;
    }
    .empty-state p {
      margin: 0;
    }
    footer {
      margin-top: 60px;
      padding: 20px 0;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    section {
      margin-bottom: 40px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      .header-content div {
        margin-top: 8px;
      }
      .ticker-list {
        grid-template-columns: 1fr;
      }
    }
  </style>
</svelte:head>

<header>
  <div class="header-content">
    <h1>TickerSage</h1>
    <div>SEC Filing Tracker with AI Summaries</div>
  </div>
</header>

<div class="container">
  <section>
    <div class="section-header">
      <h2>Stock Watchlist</h2>
    </div>
    
    <div class="search-container">
      <h3>Add Stock Tickers</h3>
      <div class="dropdown">
        <input 
          type="text" 
          placeholder="Search for a ticker or company (e.g., AAPL, Apple)" 
          bind:value={searchTerm}
          aria-label="Search stocks"
        />
        
        {#if isDropdownOpen && filteredTickers.length > 0}
          <div class="dropdown-menu">
            {#each filteredTickers as ticker}
              <div 
                class="dropdown-item" 
                on:click={() => addTicker(ticker)}
                on:keydown={(e) => e.key === 'Enter' && addTicker(ticker)}
                tabindex="0"
                role="button"
                aria-label={`Add ${ticker.name} (${ticker.symbol})`}
              >
                <div>
                  <strong>{ticker.symbol}</strong> - {ticker.name}
                </div>
                <button class="add-btn">Add</button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    
    <h3>Your Watchlist</h3>
    
    {#if $tickerStore.selectedTickers.length === 0}
      <div class="empty-state">
        <h3>No tickers selected</h3>
        <p>Search for a company above to get started.</p>
      </div>
    {:else}
      <div class="ticker-list">
        {#each $tickerStore.selectedTickers as ticker}
          <div class="ticker-item">
            <div>
              <div class="ticker-symbol">{ticker.symbol}</div>
              <div class="ticker-name">{ticker.name}</div>
            </div>
            <button 
              class="remove-btn" 
              on:click={() => removeTicker(ticker.symbol)}
              aria-label={`Remove ${ticker.symbol}`}
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </section>
  
  <section>
    <div class="section-header">
      <h2>SEC Filings Timeline</h2>
    </div>
    
    {#if $tickerStore.selectedTickers.length === 0}
      <div class="empty-state">
        <h3>No Filings to Display</h3>
        <p>Add stocks to your watchlist to see their SEC filings here.</p>
      </div>
    {:else if filings.length === 0}
      <div class="empty-state">
        <h3>No SEC filings found</h3>
        <p>No SEC filings found for the selected tickers.</p>
      </div>
    {:else}
      <div class="filings-list">
        {#each filings as filing}
          <div class="filing-item">
            <div class="filing-header">
              <div>
                <span class={`filing-type type-${filing.type.replace('-', '')}`}>{filing.type}</span>
                <span class="filing-date">{formatDate(filing.date)}</span>
              </div>
              <div class="ticker-badge">{filing.tickerSymbol}</div>
            </div>
            <div class="filing-title">{filing.tickerName}: {filing.title}</div>
            <div class="filing-summary">{filing.summary}</div>
            {#if filing.url && filing.url !== '#'}
              <div style="margin-top:12px;">
                <a href={filing.url} target="_blank" rel="noopener noreferrer">
                  <button>View Filing</button>
                </a>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<footer>
  © 2023 TickerSage. All rights reserved. This is a demo application.
</footer> 