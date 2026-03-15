<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import UptimeChart from './UptimeChart.svelte';

  const isMobile = $state(innerWidth < 645);

  const { name, id, hours } = $props();

  let data = $state();

  $effect(() => {
    http
      .get(endpoints.checkLatency(id), {
        params: {
          hours,
        },
      })
      .then(res => (data = res.data?.data));
  });
</script>

<div
  class="w-full flex flex-col sm:p-4 sm:gap-4 md:pt-4 2xl:p-6 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {data
    ?.latency_series?.length > 0
    ? 'md:pb-0 2xl:pb-1'
    : 'h-35'}">
  <div class="w-full flex justify-between items-start">
    <div class="w-full flex gap-1 flex-col justify-start items-start">
      <span class="text-lg md:text-xl text-black dark:text-white"> Latency</span>
      <div class="text-xs text-white/70 flex gap-1.5">
        <span class="text-white/40">Total Checks :</span>
        {data?.total_checks || "-"}
      </div>
    </div>
    {#if data?.avg_response_time}
      <div class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
        <span class="text-white/40 me-1"> Avg Response Time: </span>
        {data?.avg_response_time} ms
      </div>
    {:else}
      <span class="text-white/20 text-2xl text-nowrap"> No Data </span>
    {/if}
  </div>
  {#if data?.latency_series?.length > 0}
    <UptimeChart name="Latency" height={250} data={data?.latency_series} unit="ms" />
    {:else}

    <div class="w-full bg-blue-500/50 h-px my-auto"></div>
  {/if}
</div>
