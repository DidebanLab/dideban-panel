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
  {:else}
    <div
      class="mx-auto relative z-2 w-full sm:w-[339.5px] h-9.5 border-[#F87171]/15 animate-pulse rounded-lg dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] border overflow-hidden flex justify-center items-center">
      <div
        class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
        style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
        <div class="w-full h-full bg-white/5"></div>
      </div>

      <div class="flex justify-center items-center gap-1">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
            stroke="#B4242B"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M10 6.6665V9.99984"
            stroke="#B4242B"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M10 13.3335H10.0083"
            stroke="#B4242B"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="text-xl text-red-500/70 mt-0.5">Something Is Wrong</span>
      </div>
    </div>
  {/if}
{/if}
