<script>
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import LatencyChart from './LatencyChart.svelte';
  import longPolling from '../../services/longPolling';

  const { date, id, hours } = $props();
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

{#if !date}
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

        <div class="rounded-full bg-white/5 w-43.75 h-7.5 sm:w-[208.5px] sm:h-9.5 animate-pulse">
        </div>
      </div>
      <div
        class="h-20 w-full border-t-2 border-t-white/5 mt-auto bg-linear-to-b from-white/5 animate-pulse">
      </div>
    </div>
  {:else if id && data}
    <div
      class="w-full sm:h-87.75 2xl:h-88.75 flex flex-col sm:gap-4 sm:pb-0 lg:pb-0 sm:pt-6 sm:px-6 3xl:p-6 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {data
        ?.latency_series?.length > 1
        ? 'h-77.25'
        : 'h-50'}">
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
        <div class="w-full bg-blue-500/50 h-px mb-6 mt-auto"></div>
      {/if}
    </div>
  {:else}
    <div
      class="w-full h-77.25 sm:h-87.75 2xl:h-88.75 flex justify-center items-center rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] relative overflow-hidden border-[#F87171]/15 animate-pulse border">
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
