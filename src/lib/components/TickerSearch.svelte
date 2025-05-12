<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  import { tick } from 'svelte';
  
  let searchTerm = '';
  let filteredTickers = [];
  let isDropdownOpen = false;
  let inputElement;
  
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
  
  function addTicker(ticker) {
    tickerStore.addTicker(ticker);
    searchTerm = '';
    isDropdownOpen = false;
    tick().then(() => inputElement.focus());
  }
  
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      isDropdownOpen = false;
    }
  }
  
  function handleClickOutside(event) {
    if (inputElement && !inputElement.contains(event.target)) {
      isDropdownOpen = false;
    }
  }
  
  function handleKeyPress(event, ticker) {
    if (event.key === 'Enter' || event.key === ' ') {
      addTicker(ticker);
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeyDown} />

<div class="relative">
  <div class="mb-4">
    <label for="ticker-search" class="block text-sm font-medium text-gray-700 mb-1">Add Stock Tickers</label>
    <div class="relative">
      <input
        id="ticker-search"
        type="text"
        placeholder="Search for a ticker or company (e.g., AAPL, Apple)"
        bind:value={searchTerm}
        bind:this={inputElement}
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {#if isDropdownOpen && filteredTickers.length > 0}
        <div class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md overflow-auto">
          <ul class="py-1" role="listbox">
            {#each filteredTickers as ticker}
              <li 
                role="option"
                tabindex="0"
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
                on:click={() => addTicker(ticker)}
                on:keydown={(e) => handleKeyPress(e, ticker)}
              >
                <div>
                  <span class="font-medium">{ticker.symbol}</span>
                  <span class="text-gray-600 ml-2">{ticker.name}</span>
                </div>
                <button class="text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
                  Add
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</div> 