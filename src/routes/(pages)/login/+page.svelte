<script>
  import FormInput from '../../../components/common/FormInput.svelte';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';

  let mount = $state(false);
  let loading = $state(false);

  const form = $state({ username: '', password: '', error: { username: '', password: '' } });

  onMount(() => {
    mount = true;
  });

  function handleInputChange(e, type) {
    const value = e.target.value;

    if (type === 'username') {
      if (!value) {
        form.error.username = 'Please do not leave this field empty';
      } else {
        form.error.username = '';
        form.username = value;
      }
    }

    if (type === 'password') {
      if (!value) {
        form.error.password = 'Please enter your password';
      } else {
        form.error.password = '';
        form.password = value;
      }
    }
  }

  function LoginHandler() {
    http.post(endpoints.login, { username: form.username, password: form.password });
  }
</script>

{#if mount}
  <section
    in:fly={{ duration: 1000, y: -10 }}
    class="flex w-full h-full sm:h-fit select-none md:max-w-92.5 flex-col justify-center items-start absolute top-1/2 -translate-1/2 start-1/2 md:border md:border-[#e5e5e5] dark:bg-[#0D0D0D] bg-[#FFFFFF] md:dark:border-white/5 sm:shadow-xl px-6 py-8 md:rounded-xl">
    <h1 in:fade={{ duration: 1400 }} class="text-2xl dark:text-white mb-2 tracking-wider">
      Login to your account
    </h1>

    <p in:fade={{ duration: 1500 }} class="text-[#99a1af] text-[0.7vw] mb-7">Enter your username</p>

    <label class="w-full mb-4">
      <span class="text-[0.7vw] cursor-pointer dark:text-white text-black">Username</span>

      <FormInput
        type="text"
        placeholder="Enter your username"
        onChange={e => handleInputChange(e, 'username')}
        error={form.error.username} />
    </label>

    <label class="w-full mb-6">
      <span class="text-[0.7vw] cursor-pointer dark:text-white text-black">Password</span>

      <FormInput
        type="password"
        placeholder="Enter your password"
        onChange={e => handleInputChange(e, 'password')}
        error={form.error.password} />
    </label>

    <button
      onclick={LoginHandler}
      disabled={loading ||
        form.error.username ||
        form.error.password ||
        !(form.username && form.password)}
      class="w-full h-10 flex justify-center items-center border dark:border-white/5 border-transparent dark:bg-transparent bg-black dark:hover:bg-black/50 hover:bg-black/70 text-white rounded-md cursor-pointer disabled:cursor-not-allowed">
      {#if loading}
        <span class="animate-spin h-5 w-5 border-2 border-white/20 rounded-full"></span>
      {:else}
        Log In
      {/if}
    </button>
  </section>
{/if}
