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
        class="input input-bordered w-full"
      />
      {#if isDropdownOpen && filteredTickers.length > 0}
        <div class="absolute z-10 w-full mt-1 bg-base-100 shadow-lg max-h-60 rounded-md overflow-auto border border-base-300">
          <ul class="py-1" role="listbox">
            {#each filteredTickers as ticker}
              <li 
                role="option"
                aria-selected="false"
                tabindex="0"
                class="px-4 py-2 hover:bg-base-200 cursor-pointer flex justify-between items-center"
                on:click={() => addTicker(ticker)}
                on:keydown={(e) => handleKeyPress(e, ticker)}
              >
                <div>
                  <span class="font-medium">{ticker.symbol}</span>
                  <span class="text-gray-600 ml-2">{ticker.name}</span>
                </div>
                <button 
                  class="btn btn-sm" 
                  style="background-color: #4f46e5; color: white; border: none; box-shadow: none !important; min-width: 70px; padding: 0 0.75rem; transition: opacity 0.2s ease;"
                  on:mouseover={(e) => e.currentTarget.style.opacity = '0.9'}
                  on:mouseout={(e) => e.currentTarget.style.opacity = '1'}
                >
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