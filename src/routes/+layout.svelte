<script>
  // Import the CSS directly from the file system location
  import '../app.css';
  import { authService, currentUser } from '$lib/services/pocketbase';
  import { onMount } from 'svelte';
  import { tickerStore } from '$lib/stores/tickerStore';
  import { page } from '$app/stores';
  
  // Initialize the ticker store on mount
  onMount(() => {
    tickerStore.init();
  });
  
  function handleLogout() {
    authService.logout();
    window.location.href = '/';
  }

  // Determine if the current page is the auth page
  $: isAuthPage = $page.url.pathname === '/auth';
</script>

<div class="min-h-screen bg-base-200">
  <div class="navbar bg-base-100 shadow-md">
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost text-xl">TickerSage</a>
    </div>
    <div class="navbar-center">
      <span class="text-sm">SEC Filing Tracker with AI Summaries</span>
    </div>
    <div class="navbar-end pr-4">
      {#if $currentUser}
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <div class="grid place-items-center h-full w-full bg-primary text-primary-content font-bold text-xl">
                {$currentUser.name ? $currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a on:click={handleLogout}>Logout</a></li>
          </ul>
        </div>
      {:else if !isAuthPage}
        <a href="/auth" class="btn btn-primary btn-sm" style="box-shadow: none !important;">Login</a>
      {/if}
    </div>
  </div>

  <div class="container mx-auto p-4 md:p-6">
    <slot />
  </div>

  <footer class="footer footer-center p-4 bg-base-300 text-base-content mt-10">
    <div>
      <p>© 2023 TickerSage. All rights reserved. This is a demo application.</p>
    </div>
  </footer>
</div> 