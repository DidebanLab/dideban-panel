<script>
  import { opener } from '../../stores/modal.svelte';
  import UptimeHistory from '../pages/checker/UptimeHistory.svelte';

  let { data, month, average, name } = $props();
</script>

<div
  class="flex flex-col gap-3 p-4 pt-3 dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5 rounded-lg">
  <div
    class="flex justify-between items-center text-sm border-b border-b-white/20 pb-2 text-white/40">
    <span class="text-black dark:text-[#99a1af]/50">{month}</span>
    <span
      class={average < 70 ? 'text-red-700' : average < 80 ? 'text-[#c0590f]' : 'text-green-700'}
      >{average}%</span>
  </div>

  <div class="grid grid-cols-7 gap-3 justify-start items-start backdrop-blur-3xl rounded-lg">
    {#each data as item}
      <button
        type="button"
        aria-label="uptime history modal"
        onclick={() => {
          opener({
            id: `create-uptime`,
            content: UptimeHistory,
            props: {
              name: '',
              month: '',
              day: 12,
            },
          });
        }}
        class="size-3.5 rounded-sm hover:animate-pulse cursor-pointer {item < 70
          ? 'bg-red-700'
          : item < 80
            ? 'bg-[#c0590f]'
            : 'bg-green-700'}">
      </button>
    {/each}
  </div>
</div>
