<script>
  import { fade } from 'svelte/transition';
  const {
    type = 'text',
    error = null,
    onChange = null,
    class: className = '',
    ...restProps
  } = $props();

  let isShowPassword = $state(false);
</script>

<div class="relative w-full">
  <input
    {...restProps}
    class="dark:border-white/5 border-[#0D0D0D]/10 border w-full text-[0.7vw] my-2 ltr:pt-3 ltr:pb-2.5 px-2 py-3 h-10 rounded-md focus:outline-2 outline-offset-1 outline-[#e5e5e5] text-[#99a1af] dark:outline-white/5 placeholder:text-[#99a1af]/30 tracking-wide {error
      ? 'outline-2 focus:outline-[#F87171]/50  outline-[#F87171]'
      : ''} {className}"
    autocomplete="new-password"
    type={type === 'password' ? (isShowPassword ? 'text' : 'password') : type}
    oninput={onChange} />

  {#if type === 'password'}
    <button
      onclick={() => (isShowPassword = !isShowPassword)}
      class="absolute rtl:left-2.5 ltr:right-2.5 top-4 cursor-pointer opacity-50"
      type="button">
      <img
        src={isShowPassword ? '/icons/eye-slash.png' : '/icons/eye.png'}
        alt="eye icon"
        width="22"
        height="22" /></button>
  {/if}
</div>

{#if error}
  <span in:fade={{ duration: 300 }} class="text-[#F87171] text-[0.63vw] mb-2">{error}</span>
{/if}
