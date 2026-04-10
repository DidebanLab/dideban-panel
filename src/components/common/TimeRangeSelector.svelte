<script>
  let { date, interval, value = $bindable(), loading } = $props();
</script>

{#if !date}
  {#if loading}
    <div
      class="mx-auto sticky top-6 z-2 w-full sm:w-[339.5px] h-9.5 rounded-lg bg-white/5 animate-pulse">
    </div>
  {:else if interval * 2 <= 43200}
    <div
      class="flex mx-auto sticky top-6 shadow-sm shadow-[#3b82f6]/50 z-20 text-white/20 w-full sm:w-fit gap-3 sm:gap-6 py-2 justify-between px-6 text-sm items-center rounded-lg dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
      {#if interval * 2 <= 3600}
        <button
          onclick={() => (value = 1)}
          class="transition-all duration-300 {value === 1 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
          >1h
        </button>

        <div class="h-5 w-px bg-white/15"></div>
      {/if}
      {#if interval * 2 <= 10800}
        <button
          onclick={() => (value = 3)}
          class="transition-all duration-300 {value === 3 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
          >3h</button>
        <div class="h-5 w-px bg-white/15"></div>
      {/if}
      {#if interval * 2 <= 21600}
        <button
          onclick={() => (value = 6)}
          class="transition-all duration-300 {value === 6 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
          >6h</button>
        <div class="h-5 w-px bg-white/15"></div>
      {/if}

      <button
        onclick={() => (value = 12)}
        class="transition-all duration-300 {value === 12 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
        >12h</button>
      <div class="h-5 w-px bg-white/15"></div>
      <button
        onclick={() => (value = 24)}
        class="transition-all duration-300 {value === 24 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
        >24h</button>
    </div>
  {/if}
{/if}
