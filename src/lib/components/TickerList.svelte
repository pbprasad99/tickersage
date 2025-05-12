<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  
  function removeTicker(tickerId) {
    tickerStore.removeTicker(tickerId);
  }
</script>

<div class="mb-6">
  <h2 class="text-lg font-semibold mb-3">Your Watchlist</h2>
  
  {#if $tickerStore.selectedTickers.length === 0}
    <div class="card bg-base-200 border border-base-300">
      <div class="card-body p-4 text-center">
        <p class="text-gray-500">No tickers selected. Search for a company above to get started.</p>
      </div>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full table-zebra">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each $tickerStore.selectedTickers as ticker}
            <tr>
              <td class="font-bold">{ticker.symbol}</td>
              <td>{ticker.name}</td>
              <td>
                <button 
                  on:click={() => removeTicker(ticker.id)}
                  class="btn btn-sm btn-error btn-ghost"
                  title="Remove {ticker.symbol} from watchlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div> 