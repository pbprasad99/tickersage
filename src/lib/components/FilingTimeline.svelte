<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  
  // Get all filings for the selected tickers and sort by date (newest first)
  $: filings = $tickerStore.selectedTickers
    .flatMap(ticker => {
      const tickerFilings = $tickerStore.filings[ticker.symbol] || [];
      return tickerFilings.map(filing => ({
        ...filing,
        tickerSymbol: ticker.symbol,
        tickerName: ticker.name
      }));
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
</script>

<div>
  <h2 class="text-xl font-bold mb-4">SEC Filings Timeline</h2>
  
  {#if $tickerStore.selectedTickers.length === 0}
    <div class="card bg-gray-50 text-center py-8 px-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">No Filings to Display</h3>
      <p class="text-gray-500">Add stocks to your watchlist to see their SEC filings here.</p>
    </div>
  {:else if filings.length === 0}
    <div class="card border border-gray-200">
      <p class="text-gray-500 text-center py-6">No SEC filings found for the selected tickers.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each filings as filing}
        <div class="card border border-gray-200 hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <div class="w-16 h-16 flex items-center justify-center rounded bg-gray-100 text-gray-800 font-bold border border-gray-200">
                {filing.tickerSymbol}
              </div>
            </div>
            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {filing.type}
                  </span>
                  <span class="text-sm text-gray-500 ml-2">{formatDate(filing.date)}</span>
                </div>
                <a href={filing.url} class="text-blue-600 hover:text-blue-800 text-sm" target="_blank" rel="noopener noreferrer">
                  View Filing
                </a>
              </div>
              <h4 class="font-medium mt-2">{filing.tickerName}: {filing.title}</h4>
              <p class="text-gray-600 mt-2 text-sm">{filing.summary}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 