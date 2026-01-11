<script>
  import { onMount, onDestroy } from 'svelte';

  let { options = [], title = 'Select option', value = $bindable(null), className = '' } = $props();

  let open = $state(false);
  let selectRef;
  let optionsRef;

  function toggle() {
    open = !open;
  }

  function selectOption(val) {
    value = val;
    $open = false;
  }

  function handleClickOutside(e) {
    if (
      selectRef &&
      !selectRef.contains(e.target) &&
      optionsRef &&
      !optionsRef.contains(e.target)
    ) {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<!-- Select box -->
<button
  type="button"
  bind:this={selectRef}
  onclick={toggle}
  class={`relative cursor-pointer flex justify-between items-center text-gray-400 text-sm outline-none gap-1.5 px-3 h-9 w-full bg-white/5 backdrop-blur-sm rounded-lg ${className}`}>
  <span class="tracking-wide {value ? 'text-gray-400' : 'text-gray-400/40'}">
    {value || title}
  </span>

  <svg width="16" height="16" viewBox="0 0 24 24" fill="#919191">
    <path fill-rule="evenodd" d="M4.29289 8.29289L12 14.5858L19.7071 8.29289" />
  </svg>
  <!-- Options -->
  {#if open}
    <ul
      bind:this={optionsRef}
      class="absolute bg-[#F9FAFB] dark:bg-[#121212] backdrop-blur-3xl border border-[#0D0D0D]/5 dark:border-white/10 rounded-xl w-full min-w-20 start-0 mt-1 top-full max-h-60 z-20 overflow-y-auto p-1.5 space-y-1.5 text-[#919191] custom-scroll
             [&_li]:px-3 [&_li]:h-9 [&_li]:w-full [&_li]:bg-white/5 [&_li]:rounded-lg [&_li]:flex [&_li]:capitalize [&_li]:justify-center [&_li]:tracking-wider [&_li]:items-center [&_li]:text-gray-400 [&_li]:text-sm [&_li:hover]:bg-white/10">
      {#if value}
        <li onclick={() => selectOption(null)}>---</li>
      {/if}

      {#each options as item}
        <li class={item.name === value ? 'bg-white/15!' : ''} onclick={() => selectOption(item.name)}>
          {item.name}
        </li>
      {/each}
    </ul>
  {/if}
</button>
