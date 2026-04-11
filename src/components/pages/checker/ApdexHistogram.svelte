<script>
  import { onDestroy } from 'svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import longPolling from '../../../services/longPolling';
  let { id, hours, summaryWithDate, date, summaryWithDateLoading } = $props();
  let histogram = $state(null);
  let currentPoller = $state(null);
  let loading = $derived(date ? summaryWithDateLoading : true);

  $effect(() => {
    if (!date) {
      loading = true;
      currentPoller = longPolling(endpoints.checkHistogram(id), {
        params: { hours },
        interval: 54000000, //15min,
        onSuccess: d => {
          loading = false;

          histogram = {
            ...d,
            max_count: Math.max(d.error_count, ...d.histogram.map(i => i.count), 0),
          };
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
    }
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
    class="relative h-58 sm:h-64.5 w-full flex flex-col pb-6 sm:p-6 sm:pt-6 sm:pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="flex justify-between w-full items-start">
      <div class="flex flex-col">
        <span class="text-black dark:text-white text-lg sm:text-xl">Apdex Histogram</span><span
          class="text-sm text-[#99a1af]">Application health reflected in Apdex levels</span>
      </div>
    </div>
    <div class="relative w-full mt-auto z-10 flex gap-0.5 justify-start items-end">
      <div class="absolute -bottom-1 w-full h-px bg-white/15"></div>
      {#each [{ range_start: 0, range_end: 400, count: 30 }, { range_start: 400, range_end: 1600, count: 50 }, { range_start: 1600, range_end: 4800, count: 40 }, { range_start: 4800, range_end: 8000, count: 20 }, { range_start: 8000, range_end: -1, count: 20 }] as detail, i}
        <div
          style="height: {detail?.count}px;"
          class="rounded-t-xs relative transition-all bg-white/5 animate-pulse {detail?.range_end ===
          -1
            ? 'w-[12%] lg:w-[10%] xl:w-[5%]'
            : detail?.range_end === 400
              ? 'w-[12%] lg:w-[10%] xl:w-[5%]'
              : detail?.range_end === 1600
                ? 'w-[12%] lg:w-[10%] xl:w-[15%]'
                : detail?.range_end === 4800
                  ? 'w-[26%] lg:w-[30%] xl:w-[35%]'
                  : detail?.range_end === 8000
                    ? 'w-[26%] lg:w-[30%] xl:w-[35%]'
                    : ''}">
          {#if detail?.range_start !== 0}
            <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
            <div
              class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
              {detail?.range_start}ms
            </div>
          {/if}
        </div>
      {/each}

      <div
        class="w-[12%] h-4 lg:w-[10%] xl:w-[5%] rounded-t-xs cursor-pointer relative bg-white/5 animate-pulse">
        <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-xs md:text-sm text-white"></div>
        <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
        <div class="absolute -bottom-3 text-xs end-0 bg-white/15 h-2 w-px"></div>
        <div class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
          +8s
        </div>
        <div class="absolute -bottom-7 text-[9px] sm:text-xs -end-1 text-white/20 text-nowrap">
          Errors
        </div>
      </div>
    </div>
  </div>
{:else if date ? summaryWithDate : histogram}
  <div
    class="relative h-58 sm:h-64.5 w-full flex flex-col sm:p-6 sm:pt-6 pb-6 sm:pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="flex justify-between w-full items-start">
      <div class="flex flex-col">
        <span class="text-black dark:text-white text-lg sm:text-xl">Apdex Histogram</span><span
          class="text-sm text-[#99a1af]">Application health reflected in Apdex levels</span>
      </div>
    </div>
    <div class="relative w-full mt-auto z-10 flex gap-0.5 justify-start items-end">
      <div class="absolute -bottom-1 w-full h-px bg-white/15"></div>
      {#each (date ? summaryWithDate?.histogram?.buckets : histogram?.histogram) || [{ range_start: 0, range_end: 400, count: 0 }, { range_start: 400, range_end: 1600, count: 0 }, { range_start: 1600, range_end: 4800, count: 0 }, { range_start: 4800, range_end: 8000, count: 0 }, { range_start: 8000, range_end: -1, count: 0 }] as detail, i}
        <div
          style="height: {(detail?.count /
            (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)) *
            100}px;"
          class="border-t-4 rounded-t-xs cursor-pointer relative transition-all {detail?.range_end ===
          -1
            ? 'w-[12%] lg:w-[10%] xl:w-[5%] bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'
            : detail?.range_end === 400
              ? 'w-[12%] lg:w-[10%] xl:w-[5%] bg-green-700 border-t-green-900 hover:bg-green-800'
              : detail?.range_end === 1600
                ? 'w-[12%] lg:w-[10%] xl:w-[15%] bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                : detail?.range_end === 4800
                  ? 'w-[26%] lg:w-[30%] xl:w-[35%] bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                  : detail?.range_end === 8000
                    ? 'w-[26%] lg:w-[30%] xl:w-[35%] bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                    : ''}">
          <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-xs md:text-sm text-white">
            {detail?.count}
          </div>
          {#if detail?.range_start !== 0}
            <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
            <div
              class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
              {detail?.range_start}ms
            </div>
          {/if}
        </div>
      {/each}

      <div
        style="height: {Boolean(
          date ? summaryWithDate?.histogram?.error_count : histogram?.error_count,
        )
          ? (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)
            ? ((date ? summaryWithDate?.histogram?.error_count : histogram?.error_count) /
                (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)) *
              100
            : 60
          : 0}px;"
        class="border-t-4 w-[12%] lg:w-[10%] xl:w-[5%] rounded-t-xs cursor-pointer relative bg-[#410000] border-t-[#4b0000] hover:bg-[#410000]/70">
        <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-xs md:text-sm text-white">
          {date ? summaryWithDate?.histogram?.error_count || 0 : histogram?.error_count || 0}
        </div>
        <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
        <div class="absolute -bottom-3 text-xs end-0 bg-white/15 h-2 w-px"></div>
        <div class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
          +8s
        </div>
        <div class="absolute -bottom-7 text-[9px] sm:text-xs -end-1 text-white/20 text-nowrap">
          Errors
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="relative h-58 sm:h-64.5 animate-pulse border-[#F87171]/15 w-full flex justify-center items-center overflow-hidden rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] border">
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
