<script>
  import AuthForm from '$lib/components/AuthForm.svelte';
  import { authService, currentUser } from '$lib/services/pocketbase';
  import { onMount } from 'svelte';
  
  onMount(() => {
    // If the user is already logged in, redirect to home
    if (authService.isLoggedIn()) {
      window.location.href = '/';
    }
  });
</script>

<div class="max-w-md mx-auto py-12">
  <h1 class="text-3xl font-bold text-center mb-8">TickerSage</h1>
  <AuthForm />
</div> 