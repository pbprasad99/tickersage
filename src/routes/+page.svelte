<script>
  import { onMount } from 'svelte';
  import { authService, currentUser } from '$lib/services/pocketbase';
  import TickerSearch from '$lib/components/TickerSearch.svelte';
  import TickerList from '$lib/components/TickerList.svelte';
  import FilingTimeline from '$lib/components/FilingTimeline.svelte';
  import { tickerStore } from '$lib/stores/tickerStore';
  
  // Redirect to login if not authenticated
  onMount(() => {
    if (!authService.isLoggedIn()) {
      window.location.href = '/auth';
    } else {
      // Initialize the ticker store
      tickerStore.init();
    }
  });
</script>

<div class="container mx-auto p-6 relative">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {#if $currentUser}
      <!-- Left sidebar - Ticker Management -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body">
            <h2 class="card-title mb-4">Portfolio Management</h2>
            
            <!-- Ticker Search Component -->
            <TickerSearch />
            
            <!-- Watchlist Component -->
            <TickerList />
          </div>
        </div>
      </div>
      
      <!-- Right - SEC Filings Timeline -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <FilingTimeline />
          </div>
        </div>
      </div>
    {:else}
      <!-- Loading state or login prompt -->
      <div class="lg:col-span-3 text-center py-12">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="mt-4">Checking authentication...</p>
      </div>
    {/if}
  </div>
</div> 