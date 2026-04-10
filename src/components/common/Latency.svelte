<script>
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import LatencyChart from './LatencyChart.svelte';
  import longPolling from '../../services/longPolling';

  const { name, id, hours } = $props();
  const isMobile = $state(innerWidth < 645);
  let currentPoller = $state(null);
  let data = $state(null);
  let loading = $state(true);

  $effect(() => {
    loading = true;
    currentPoller = longPolling(endpoints.checkLatency(id), {
      params: {
        hours,
        max_points: 60,
      },
      onSuccess: d => {
        loading = false;
        data = d;
      },
      onError: () => {
        loading = false;
      },
    });

    return () => {
      if (currentPoller) {
        currentPoller.stop();
      }
    };
  });

  onDestroy(() => {
    return () => {
      if (currentPoller) {
        currentPoller.stop();
      }
    };
  });
</script>

{#if loading}
  <div
    class="w-full h-77.25 sm:h-87.75 2xl:h-88.75 flex flex-col sm:p-6 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-between items-start">
      <div class="w-fit flex flex-col justify-start items-start">
        <span class="text-lg md:text-xl text-black dark:text-white"> Latency</span>
        <div class="text-xs text-white/70 flex gap-1.5">
          <span class="text-white/40 text-nowrap">Total Checks :</span>
          <span class="h-4 w-10 bg-white/5 rounded-md animate-pulse"></span>
        </div>
      </div>

      <div class="rounded-full bg-white/5 w-43.75 h-7.5 sm:w-[208.5px] sm:h-9.5 animate-pulse"></div>
    </div>
    <div
      class="h-20 w-full border-t-2 border-t-white/5 mt-auto bg-linear-to-b from-white/5 animate-pulse">
    </div>
  </div>
{:else}
  <div
    class="w-full flex flex-col sm:gap-4 sm:pb-0 lg:pb-0 sm:pt-6 sm:px-6 3xl:p-6 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 2xl:h-88.75">
    <div class="w-full flex justify-between items-start">
      <div class="w-full flex flex-col justify-start items-start">
        <span class="text-lg md:text-xl text-black dark:text-white"> Latency</span>
        <div class="text-xs text-white/70 flex gap-1.5">
          <span class="text-white/40 text-nowrap">Total Checks :</span>
          {data?.total_checks || '-'}
        </div>
      </div>
      {#if data?.avg_response_time}
        <div
          class="text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 rounded-full border text-white border-white/5 text-nowrap">
          <span class="text-white/40 text-nowrap me-1"> Avg Response Time: </span>
          {data?.avg_response_time} ms
        </div>
      {/if}
    </div>
    {#if data?.latency_series?.length > 1}
      <LatencyChart name="Latency" height={250} data={data?.latency_series} unit="ms" />
    {:else}
      <div class="w-full bg-blue-500/50 h-px my-auto"></div>
    {/if}
  </div>
{/if}
