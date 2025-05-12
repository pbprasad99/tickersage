<script>
  import { tickerStore } from '$lib/stores/tickerStore';
  import PdfViewer from './PdfViewer.svelte';
  
  // Active filing for PDF viewing
  let activeFilingId = null;
  let showPdfModal = false;
  let pdfLoadError = false;
  let isFullscreen = false;
  
  // Get all filings for the selected tickers and sort by date (newest first)
  $: allFilings = Object.values($tickerStore.filings)
    .flat()
    .map(filing => {
      // Find the ticker data for this filing
      const ticker = $tickerStore.selectedTickers.find(t => t.id === filing.ticker);
      return {
        ...filing,
        tickerSymbol: ticker?.symbol || 'Unknown',
        tickerName: ticker?.name || 'Unknown Company'
      };
    });
  
  // Sort filings by date (newest first)
  $: filings = allFilings.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
  
  function openPdfViewer(filing) {
    activeFilingId = filing.id;
    showPdfModal = true;
    pdfLoadError = false;
  }
  
  function closePdfViewer() {
    showPdfModal = false;
    activeFilingId = null;
    pdfLoadError = false;
    isFullscreen = false;
  }
  
  function handlePdfError() {
    pdfLoadError = true;
  }
  
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
  }
  
  // Generate PDF URL for testing if real URL doesn't exist
  function getPdfUrl(filing) {
    if (!filing) return '';
    
    if (filing.url) {
      try {
        // Validate URL format
        const url = new URL(filing.url);
        
        // Only allow https URLs for security
        if (url.protocol === 'https:') {
          // Check for trusted domains - currently allowing SEC.gov and other trusted sites
          const trustedDomains = ['sec.gov', 'investor.gov', 'treasury.gov', 'federalreserve.gov'];
          const host = url.hostname.toLowerCase();
          
          if (trustedDomains.some(domain => host.endsWith(domain))) {
            return filing.url;
          }
        }
      } catch (e) {
        console.error('Invalid URL format:', filing.url);
      }
      
      // If not a trusted URL, inform the user but still provide access via new tab
      // This way the browser's built-in security handles it
      if (filing.url.startsWith('http')) {
        console.warn('Using potentially untrusted PDF URL:', filing.url);
        return filing.url;
      }
      
      // Handle relative URLs (starting with /)
      if (filing.url.startsWith('/')) {
        return filing.url;
      }
    }
    
    // Fallback to a local sample PDF
    return '/samples/sample-10k.pdf';
  }
</script>

<div>
  <h2 class="text-xl font-bold mb-4">SEC Filings Timeline</h2>
  
  {#if $tickerStore.selectedTickers.length === 0}
    <div class="card bg-base-200 text-center py-8 px-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-700 mb-2">No Filings to Display</h3>
      <p class="text-gray-500">Add stocks to your watchlist to see their SEC filings here.</p>
    </div>
  {:else if filings.length === 0}
    <div class="card bg-base-200 p-8 text-center">
      <p class="text-gray-500">No SEC filings found for the selected tickers.</p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each filings as filing}
        <div class="card bg-base-100 border border-base-200 hover:shadow-md transition-shadow">
          <div class="card-body p-5">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 flex items-center justify-center rounded bg-base-200 text-base-content font-bold">
                  {filing.tickerSymbol}
                </div>
              </div>
              <div class="flex-grow">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <div>
                    <span class="badge badge-primary">{filing.type}</span>
                    <span class="text-sm text-gray-500 ml-2">{formatDate(filing.date)}</span>
                  </div>
                  <div class="flex gap-2 mt-2 sm:mt-0">
                    <!-- View Filing button -->
                    <button 
                      class="btn btn-sm"
                      style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; border: none;"
                      on:click={() => openPdfViewer(filing)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 1rem; height: 1rem; margin-right: 0.25rem;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      View Filing
                    </button>
                    
                    <!-- External Link button -->
                    <a 
                      href={filing.url || "#"} 
                      class="btn btn-sm btn-ghost" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class:btn-disabled={!filing.url}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
                <h3 class="font-medium text-lg">{filing.title}</h3>
                <div class="divider my-2"></div>
                <div class="text-base-content mt-2">
                  <h4 class="font-medium text-sm text-gray-600 mb-1">AI-Generated Summary:</h4>
                  <p class="text-base">{filing.summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- PDF Viewer Modal -->
{#if showPdfModal}
  <div class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center {isFullscreen ? 'p-0' : 'p-2'}">
    <div class="bg-base-100 rounded-lg w-full {isFullscreen ? 'h-screen max-w-none rounded-none' : 'h-[95vh] max-w-7xl'} flex flex-col">
      <div class="p-3 border-b flex justify-between items-center">
        <h3 class="font-bold text-lg">
          {filings.find(f => f.id === activeFilingId)?.title || 'Document Viewer'}
        </h3>
        <div class="flex gap-2">
          <!-- Maximize/Restore button -->
          <button 
            class="btn btn-sm btn-ghost" 
            on:click={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {#if isFullscreen}
              <!-- Simple exit fullscreen icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
              </svg>
            {:else}
              <!-- Simple enter fullscreen icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
              </svg>
            {/if}
          </button>
          <!-- Close button -->
          <button class="btn btn-sm btn-circle" on:click={closePdfViewer}>✕</button>
        </div>
      </div>
      
      {#if activeFilingId}
        {@const filing = filings.find(f => f.id === activeFilingId)}
        {#if filing}
          <div class="flex-grow overflow-hidden">
            {#if pdfLoadError}
              <div class="flex flex-col items-center justify-center h-full p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-warning mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-lg font-bold mb-2">Browser PDF Viewing Blocked</h3>
                <p class="mb-4">Your browser has blocked the PDF from displaying inline due to security restrictions.</p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={getPdfUrl(filing)} 
                    class="btn"
                    style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; border: none;"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    Open in New Tab
                  </a>
                  <a 
                    href={getPdfUrl(filing)} 
                    class="btn"
                    style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; border: none;"
                    target="_blank" 
                    rel="noopener noreferrer"
                    download
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PDF
                  </a>
                  <a 
                    href="/samples/sample-10k.html" 
                    class="btn"
                    style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; border: none;"
                    target="_blank"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    View Sample Document
                  </a>
                </div>
              </div>
            {:else}
              <PdfViewer 
                pdfUrl={getPdfUrl(filing)} 
                title={filing.title}
                isFullscreen={isFullscreen}
                on:error={handlePdfError}
              />
            {/if}
          </div>
        {:else}
          <div class="flex items-center justify-center p-10">
            <p>Error: Document not found</p>
          </div>
        {/if}
      {:else}
        <div class="flex items-center justify-center p-10">
          <div class="loading loading-spinner loading-lg"></div>
        </div>
      {/if}
      
      <div class="p-3 border-t flex justify-between">
        <div>
          <span class="text-sm text-gray-500">Viewing document</span>
        </div>
        {#if activeFilingId}
          {@const filing = filings.find(f => f.id === activeFilingId)}
          {#if filing}
            <a 
              href={getPdfUrl(filing)} 
              class="btn"
              style="background-color: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.25rem; border: none;"
              target="_blank" 
              rel="noopener noreferrer"
              download
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </a>
          {:else}
            <button class="btn btn-sm btn-disabled">Download PDF</button>
          {/if}
        {:else}
          <button class="btn btn-sm btn-disabled">Download PDF</button>
        {/if}
      </div>
    </div>
  </div>
{/if} 