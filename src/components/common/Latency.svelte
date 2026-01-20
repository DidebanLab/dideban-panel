<script>
  import { page } from '$app/stores';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import UptimeChart from './UptimeChart.svelte';

  let activeTimeline = $state('d');

  const { name = 'checker1' } = $props();

  const timeline = ['d', 'm', 'y'];

  let data = $state([
    1000, 5000, 2000, 2400, 1400, 2300, 1000, 5000, 2000, 2400, 1400, 2300, 1000, 5000, 2000, 2400,
    1400, 2300, 1000, 5000, 2000, 2400, 1400, 2300,
  ]);

  // $effect(() => {
  //   http.post(endpoints.latency, { name, timeline: activeTimeline }).then(res => (data = res.data));
  // });
</script>

<div
  class="w-full flex flex-col gap-4 px-3 pt-4 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start px-2">
    <div class="w-full flex flex-col justify-start items-start">
      <div class=""></div>
      <span class="text-xl text-black dark:text-white"> Latency</span>
      <span class="text-sm text-[#99a1af]">Total Time For Request Response</span>
    </div>
    <div class="h-full flex justify-center items-center gap-1">
      {#each timeline as item}
        <button
          onclick={() => (activeTimeline = item)}
          class="flex justify-center items-center rounded-lg size-6 text-xs cursor-pointer transition-all border {activeTimeline ===
          item
            ? 'text-[#2B7FFF] dark:bg-white/10  border-[#2B7FFF]/20 bg-[#2B7FFF]/5'
            : 'bg-[#0D0D0D]/5 dark:bg-white/5 border-white/5 text-[#99a1af] dark:text-white/30'}">
          {item}
        </button>
      {/each}
    </div>
  </div>
  <div
    class="h-full ms-2 mb-6 w-fit flex justify-center items-center gap-4 px-4 py-2 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-start items-center gap-2.5">
      <span style="box-shadow: 0 0 10px 1px #2b7fff;" class="size-2.5 rounded-full bg-[#2b7fff]"
      ></span>
      <span class="flex justify-center items-center text-base text-[#6a7282] text-nowrap"
        >Last ( LTC ) :</span>
    </div>

    <span class="text-black dark:text-white text-base text-nowrap">{data[data.length - 1]} ms</span>
  </div>
  <UptimeChart name="Latency" height={250} data={[...data]} unit="ms" />
</div>
