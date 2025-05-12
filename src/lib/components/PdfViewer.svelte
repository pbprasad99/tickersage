<script>
  import { createEventDispatcher } from 'svelte';
  
  export let pdfUrl = '';
  export let title = 'Document Viewer';
  export let isFullscreen = false;
  
  // State management
  let pdfObjectSupported = true;
  let loadError = false;
  
  // Create event dispatcher for notifying parent components
  const dispatch = createEventDispatcher();
  
  function handleObjectError() {
    pdfObjectSupported = false;
    loadError = true;
    dispatch('error', { message: 'PDF object failed to load' });
  }
  
  function handleIframeError() {
    loadError = true;
    dispatch('error', { message: 'PDF iframe failed to load' });
  }
  
  // Clean the URL to ensure it's safe
  function getSafeUrl(url) {
    try {
      // Validate that it's a proper URL
      new URL(url);
      return url;
    } catch (e) {
      console.error('Invalid URL provided:', url);
      dispatch('error', { message: 'Invalid URL provided' });
      return '';
    }
  }
  
  $: safeUrl = getSafeUrl(pdfUrl);
  $: objectHeight = isFullscreen ? 'calc(100vh - 110px)' : 'calc(100vh - 150px)';
</script>

<div class="w-full h-full flex flex-col">
  <div class="flex-grow overflow-hidden bg-gray-100 h-full">
    {#if pdfObjectSupported && safeUrl}
      <!-- Try object tag first for better compatibility -->
      <object 
        data={safeUrl} 
        type="application/pdf" 
        class="w-full h-full border-0"
        style="min-height: {objectHeight};"
        on:error={handleObjectError}
        title={title}
        aria-label={`PDF document: ${title}`}
      >
        <!-- Fallback if object tag fails -->
        <div class="flex flex-col items-center justify-center h-full w-full p-4">
          <p class="mb-4">Unable to display the PDF inline.</p>
          <a 
            href={safeUrl} 
            class="btn btn-primary" 
            target="_blank" 
            rel="noopener noreferrer"
            download
          >
            Download the PDF
          </a>
        </div>
      </object>
    {:else if !loadError && safeUrl}
      <!-- Fallback approach with iframe -->
      <iframe 
        src={safeUrl} 
        class="w-full h-full border-0" 
        style="min-height: {objectHeight};"
        title={title}
        sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-popups"
        on:error={handleIframeError}
        on:load={() => {
          // Some browsers don't trigger error events for iframes
          // This is a best-effort attempt to detect if the iframe loaded correctly
          try {
            setTimeout(() => {
              // If the iframe's contentDocument is not accessible due to cross-origin,
              // this might indicate that the PDF couldn't be loaded in the iframe
              if (document.querySelector('iframe')?.contentDocument === null) {
                handleIframeError();
              }
            }, 1000);
          } catch (e) {
            // If we get a security error when checking contentDocument, 
            // it's likely the PDF is from another domain
            handleIframeError();
          }
        }}
      ></iframe>
    {:else}
      <!-- Error or no URL provided -->
      <div class="flex flex-col items-center justify-center h-full w-full p-4" style="min-height: {objectHeight};">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-error mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="mb-4 text-center">The PDF could not be displayed in the browser.</p>
        {#if safeUrl}
          <a 
            href={safeUrl} 
            class="btn btn-primary" 
            target="_blank" 
            rel="noopener noreferrer"
            download
          >
            Download the PDF
          </a>
        {:else}
          <p>No valid PDF URL provided.</p>
        {/if}
      </div>
    {/if}
  </div>
</div>