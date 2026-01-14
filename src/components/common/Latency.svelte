<script>
  import { page } from '$app/stores';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import UptimeChart from './UptimeChart.svelte';

  let activeTimeline = $state('d');

  const timeline = ['d', 'm', 'y'];
  const name = 'checker1';

  let data = $state([
    1000, 5000, 2000, 2400, 1400, 2300, 1000, 5000, 2000, 2400, 1400, 2300, 1000, 5000, 2000, 2400,
    1400, 2300, 1000, 5000, 2000, 2400, 1400, 2300,
  ]);

  $effect(() => {
    http
      .post(endpoints.latency, { name: name, timeline: activeTimeline })
      .then(res => (data = res.data));
  });
</script>

<div
  class="w-full flex flex-col gap-4 p-4 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start">
    <div class="w-full flex flex-col justify-start items-start">
      <div class=""></div>
      <span class="text-xl dark:text-white"> Latency</span>
      <span class="text-sm text-[#99a1af]">Total Time For Request Response</span>
    </div>
    <div class="h-full flex justify-center items-center gap-1">
      {#each timeline as item}
        <button
          onclick={() => (activeTimeline = item)}
          class="flex justify-center items-center rounded-lg size-6 text-xs cursor-pointer transition-all border {activeTimeline ===
          item
            ? 'text-[#2B7FFF] bg-[#2B7FFF]/10  border-[#2B7FFF]/20'
            : 'bg-white/5 border-white/5 text-white/30'}">
          {item}
        </button>
      {/each}
    </div>
  </div>
  <div
    class="h-full w-fit flex justify-center items-center gap-4 px-4 py-2 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-start items-center gap-2.5">
      <span style="box-shadow: 0 0 10px 1px #2b7fff;" class="size-2.5 rounded-full bg-[#2b7fff]"
      ></span>
      <span class="flex justify-center items-center text-base text-[#6a7282] text-nowrap"
        >Last ( LTC ) :</span>
    </div>

    <span class="dark:text-white text-base text-nowrap">{data[data.length - 1]} ms</span>
  </div>
  <UptimeChart name="Latency" height={250} {data} />
</div>
