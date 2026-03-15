<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import UptimeChart from './UptimeChart.svelte';

  const isMobile = $state(innerWidth < 645);

  const { name, id } = $props();

  let data = $state();

  onMount(() => {
    http.get(endpoints.checkLatency(id)).then(res => (data = res.data?.data));
  });
</script>

<div
  class="w-full flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start">
    <div class="w-full flex gap-1 flex-col justify-start items-start">
      <span class="text-lg md:text-xl text-black dark:text-white"> Latency</span>
      <div class="text-xs text-white bg-white/10 py-1 px-2 rounded-md">
        <span class="text-white/50">Total Checks :</span>
        {data?.total_checks}
      </div>
    </div>

    <div class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
      <span class="text-white/40 me-1"> Avg Response Time: </span>
      {data?.avg_response_time} ms
    </div>
  </div>
  {#key data?.latency_series}
    <UptimeChart name="Latency" height={250} data={data?.latency_series} unit="ms" />
  {/key}
</div>
