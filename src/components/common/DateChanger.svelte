<script>
  import { page } from '$app/stores';
  import nextDate from '../../utils/nextDate';
  import preDate from '../../utils/preDate';

  let { summaryWithDate = $bindable(), summary, id, toDay, type, date, loading } = $props();
</script>

{#if date ? date : toDay}
  {#if loading}
    <div
      class="bg-white/5 lg:absolute lg:top-0 rounded-md lg:start-1/2 lg:-translate-x-1/2 w-full lg:w-[194.5px] h-9.5 animate-pulse">
    </div>
  {:else}
    <div
      class="flex items-center justify-between px-3 gap-4 bg-white/5 text-sm lg:absolute lg:top-0 rounded-md lg:start-1/2 lg:-translate-x-1/2 w-full lg:w-fit lg:min-w-40 h-9.5 shadow-sm shadow-[#3b82f6]/50">
      <!-- Prev -->
      <button
        aria-label="prev date"
        onclick={() => {
          summaryWithDate = null;
          preDate(summary, $page.url.searchParams.get('date'), toDay, type, id);
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 hover:opacity-65 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Date -->
      <div class="px-4 py-1.5 rounded-lg tracking-wide text-nowrap text-[#3b82f6]">
        {date || toDay}
      </div>

      <!-- Next -->
      <button
        aria-label="next date"
        onclick={() => {
          summaryWithDate = null;
          nextDate(summary, $page.url.searchParams.get('date'), toDay, type, id);
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 hover:opacity-65 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  {/if}
{/if}
