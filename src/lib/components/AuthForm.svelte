<script>
  import { authService, currentUser } from '$lib/services/pocketbase';
  
  export let isRegister = false;
  
  let email = '';
  let password = '';
  let passwordConfirm = '';
  let name = '';
  let loading = false;
  let error = '';
  
  async function handleSubmit() {
    error = '';
    loading = true;
    
    try {
      if (isRegister) {
        // Registration
        if (password !== passwordConfirm) {
          error = 'Passwords do not match';
          loading = false;
          return;
        }
        
        console.log('Registration data:', { email, name, passwordLength: password.length });
        
        const result = await authService.register(email, password, passwordConfirm, name);
        
        if (!result.success) {
          error = result.error || 'Registration failed';
          console.error('Registration error details:', result.error);
        } else {
          console.log('Registration successful:', result.user);
          // Redirect to home page after successful registration
          window.location.href = '/';
        }
      } else {
        // Login
        const result = await authService.login(email, password);
        
        if (!result.success) {
          error = result.error || 'Login failed';
          console.error('Login error details:', result.error);
        } else {
          console.log('Login successful:', result.user);
          // Redirect to home page after successful login
          window.location.href = '/';
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      error = `An unexpected error occurred: ${message}`;
      console.error('Auth error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="card bg-base-100 shadow-xl max-w-md mx-auto">
  <div class="card-body">
    <h2 class="card-title text-center">{isRegister ? 'Register' : 'Login'}</h2>
    
    {#if error}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      {#if isRegister}
        <!-- Name field for registration -->
        <div class="form-control">
          <label class="label" for="name">
            <span class="label-text">Name</span>
          </label>
          <input 
            type="text" 
            id="name"
            placeholder="Your name" 
            class="input input-bordered w-full" 
            bind:value={name}
            required
          />
        </div>
      {/if}
      
      <!-- Email field -->
      <div class="form-control">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input 
          type="email" 
          id="email"
          placeholder="email@example.com" 
          class="input input-bordered w-full" 
          bind:value={email}
          required
        />
      </div>
      
      <!-- Password field -->
      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <input 
          type="password" 
          id="password"
          placeholder="Password" 
          class="input input-bordered w-full" 
          bind:value={password}
          required
        />
      </div>
      
      {#if isRegister}
        <!-- Password confirmation field for registration -->
        <div class="form-control">
          <label class="label" for="passwordConfirm">
            <span class="label-text">Confirm Password</span>
          </label>
          <input 
            type="password" 
            id="passwordConfirm"
            placeholder="Confirm password" 
            class="input input-bordered w-full" 
            bind:value={passwordConfirm}
            required
          />
        </div>
      {/if}
      
      <div class="form-control mt-6">
        <button 
          type="submit" 
          class="btn btn-primary" 
          disabled={loading}
        >
          {#if loading}
            <span class="loading loading-spinner"></span>
          {/if}
          {isRegister ? 'Register' : 'Login'}
        </button>
      </div>
      
      <div class="text-center mt-4">
        <button 
          type="button" 
          class="btn btn-link"
          on:click={() => isRegister = !isRegister}
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </form>
  </div>
</div> 