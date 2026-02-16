<script>
  import { page } from '$app/stores';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import UptimeChart from './UptimeChart.svelte';

  let activeTimeline = $state('d');

  const isMobile = $state(innerWidth < 645);

  const { name } = $props();

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
  class="w-full flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start">
    <div class="w-full flex flex-col justify-start items-start">
      <span class="text-lg md:text-xl text-black dark:text-white"> Latency</span>
      <span class="text-sm text-[#99a1af]">Total Time For Request Response</span>
    </div>
    <div class="h-full flex flex-col sm:flex-row justify-center items-center gap-1">
      {#each timeline as item}
        <button
          onclick={() => (activeTimeline = item)}
          class="flex justify-center items-center rounded-lg size-6 text-xs cursor-pointer transition-all border {activeTimeline ===
          item
            ? 'text-[#2B7FFF]  border-[#2B7FFF]/20 bg-[#2B7FFF]/20'
            : 'bg-[#0D0D0D]/5 dark:bg-white/5 border-white/5 text-[#99a1af] dark:text-white/30'}">
          {item}
        </button>
      {/each}
    </div>
  </div>

  <div
    class="w-fit mb-5 sm:w-50 md:w-fit xl:w-fit flex justify-center items-center gap-4 sm:px-4 sm:py-3 rounded-[10px] sm:bg-[#F9FAFB] dark:sm:bg-[#121212] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-start items-center gap-2.5">
      <span style="box-shadow: 0 0 10px 1px #2b7fff;;" class="size-2.5 rounded-full bg-[#2b7fff]"
      ></span>
      <span class="flex justify-center items-center text-xs xl:text-sm text-[#6a7282] text-nowrap"
        >Last ( LTC ) :</span>
    </div>

    <span class="dark:text-white text-xs md:text-sm xl:text-base 2xl:text-lg text-nowrap"
      >{data[data.length - 1]} ms</span>
  </div>
  <UptimeChart name="Latency" height={250} data={[...data.slice(isMobile ? -10 : -53)]} unit="ms" />
</div>
