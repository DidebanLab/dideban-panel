<script>
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import formatNumber from '../../../utils/formatNumber';
  const { id, date, summaryWithDate, hours, summaryWithDateLoading } = $props();
  let collectDuration = $state();

  let loading = $derived(date ? summaryWithDateLoading : true);

  $effect(() => {
    if (!date) {
      loading = true;
      http
        .get(endpoints.agentCollectDuration(id), { params: { hours } })
        .then(res => (collectDuration = res.data?.data))
        .finally(() => {
          loading = false;
        });
    }
  });
</script>

{#if loading}
  <div
    class="relative w-full h-40.5 sm:h-57 3xl:h-52 flex flex-col hover:z-30 pb-8 sm:p-6 sm:pb-14 3xl:pb-13 gap-4 sm:gap-8 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="flex justify-between items-start">
      <div class="flex flex-col justify-start items-start w-full">
        <span class="text-lg text-black dark:text-white">Collect Duration</span>
        <div class="text-xs text-white/70 flex gap-1.5">
          <span class="text-white/40">Total collects :</span>
          <span class="bg-white/5 rounded-md h-4 w-12 animate-pulse"></span>
        </div>
      </div>

      <div class="bg-white/5 w-[163.5px] h-8 animate-pulse rounded-full"></div>
    </div>

    <div
      class="relative w-full z-10 flex gap-0.5 justify-start items-end mt-auto animate-pulse overflow-x-clip 3xl:overflow-x-visible">
      <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>
      {#each Array(24) as _, i}
        <div
          aria-hidden="true"
          class="w-full min-w-[44.5px] rounded-[1px] relative bg-white/5 {i % 2
            ? 'h-10'
            : i % 3
              ? 'h-7'
              : 'h-12'}">
          <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
          <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
            {(i + 1).toString().padStart(2, '0')}:00
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else if date ? summaryWithDate : collectDuration}
  <div
    class="relative w-full h-40.5 sm:h-57 3xl:h-52 flex flex-col hover:z-30 pb-8 sm:p-6 sm:pb-14 3xl:pb-13 gap-4 sm:gap-8 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="flex justify-between items-start">
      <div class="flex flex-col justify-start items-start w-full">
        <span class="text-lg text-black dark:text-white">Collect Duration</span>
        <div class="text-xs text-white/70 flex gap-1.5">
          <span class="text-white/40">Total collects :</span>
          {(date ? summaryWithDate?.overall?.total_collects : collectDuration?.total_collect) ||
            '-'}
        </div>
      </div>

      {#if date}
        {#if summaryWithDate?.overall?.avg_collect_duration_ms}
          <div
            class="flex text-lg sm:text-2xl justify-end gap-2 items-center {summaryWithDate?.overall?.rate?.toLowerCase() ===
            'excellent'
              ? 'text-green-500'
              : summaryWithDate?.overall?.rate?.toLowerCase() === 'good'
                ? 'text-[#00D492]'
                : summaryWithDate?.overall?.rate?.toLowerCase() === 'fair'
                  ? 'text-[#FDC700]'
                  : summaryWithDate?.overall?.rate?.toLowerCase() === 'poor'
                    ? 'text-[#F97316]'
                    : 'text-[#F87171]'}">
            {summaryWithDate?.overall?.rate}

            <span class="h-7 w-px bg-white/15"></span>

            {summaryWithDate?.overall?.avg_collect_duration_ms}ms
          </div>
        {/if}
      {:else if collectDuration?.avg_ms}
        <div
          class="flex text-lg sm:text-2xl justify-end gap-2 items-center {collectDuration?.rate?.toLowerCase() ===
          'excellent'
            ? 'text-green-500'
            : collectDuration?.rate?.toLowerCase() === 'good'
              ? 'text-[#00D492]'
              : collectDuration?.rate?.toLowerCase() === 'fair'
                ? 'text-[#FDC700]'
                : collectDuration?.rate?.toLowerCase() === 'poor'
                  ? 'text-[#F97316]'
                  : 'text-[#F87171]'}">
          {collectDuration?.rate}

          <span class="h-7 w-px bg-white/15"></span>

          {collectDuration?.avg_ms}ms
        </div>
      {/if}
    </div>

    <div class="relative w-full z-10 flex gap-0.5 justify-start items-end mt-auto">
      <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>
      {#if date}
        {#if !summaryWithDate?.collect_duration_series}
          {#each Array(24) as _, i}
            <div
              class="h-1 w-full min-w-[50.5px] sm:min-w-[60.5px] rounded-[1px] cursor-pointer relative group border-t-4 transition-all bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]">
              <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
              <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                {String(i + 1)
                  .toString()
                  .padStart(2, '0')}:00
              </div>
            </div>
          {/each}
        {/if}
        {#each summaryWithDate?.collect_duration_series as detail, i}
          <div
            style="height: {(detail?.avg_collect_duration_ms * 100) /
              summaryWithDate?.overall?.max_collect_duration_ms /
              1.5}px;"
            class="w-full min-w-[40.5px] sm:min-w-[60.5px] rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.avg_collect_duration_ms >=
            90
              ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
              : detail?.avg_collect_duration_ms >= 80
                ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                : detail?.avg_collect_duration_ms >= 70
                  ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                  : detail?.avg_collect_duration_ms >= 50
                    ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                    : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
            {#if detail?.avg_collect_duration_ms}
              <div class="text-white absolute start-1/2 -translate-1/2 -top-5 text-xs">
                {detail?.avg_collect_duration_ms}<sub>ms</sub>
              </div>
            {/if}
            {#if i !== 0 && i % 1 === 0}
              <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                <div class="relative">
                  <div
                    class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                    {detail?.start_time.slice(0, 5)}
                  </div>
                </div>
              </div>
            {/if}

            {#if summaryWithDate?.collect_duration_series?.length - 1 === i}
              <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
                <div class="relative">
                  <div
                    class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                    24:00
                  </div>
                </div>
              </div>
            {/if}

            {#if detail?.avg_collect_duration_ms}
              <div
                class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Collect Rating :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                    'excellent'
                      ? 'text-green-500'
                      : detail?.rate?.toLowerCase() === 'good'
                        ? 'text-[#00D492]'
                        : detail?.rate?.toLowerCase() === 'fair'
                          ? 'text-[#FDC700]'
                          : detail?.rate?.toLowerCase() === 'poor'
                            ? 'text-[#F97316]'
                            : 'text-[#F87171]'}">{detail?.rate}</span>
                </div>
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Collect Avg (ms) :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                    'excellent'
                      ? 'text-green-500'
                      : detail?.rate?.toLowerCase() === 'good'
                        ? 'text-[#00D492]'
                        : detail?.rate?.toLowerCase() === 'fair'
                          ? 'text-[#FDC700]'
                          : detail?.rate?.toLowerCase() === 'poor'
                            ? 'text-[#F97316]'
                            : 'text-[#F87171]'}"
                    >{detail?.avg_collect_duration_ms}<sub>ms</sub></span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Lowest Duration :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.min_collect_duration_ms}<sub>ms</sub></span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Mostest Duration :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.max_collect_duration_ms}<sub>ms</sub></span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Collects :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.collects}</span>
                </div>

                <div
                  class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>From</span>
                    <span class="text-white/30">{detail?.start_time.slice(0, 5)} </span>
                  </div>

                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Until</span>
                    <span class="text-white/30"> {detail?.end_time.slice(0, 5)}</span>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {:else if collectDuration?.series}
        {#each collectDuration?.series as detail, i}
          <div
            style="height: {(detail?.avg_ms * 100) / collectDuration.max_ms / 1.5}px;"
            class="w-full min-w-[14.3px] rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.rate?.toLowerCase() ===
            'excellent'
              ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
              : detail?.rate?.toLowerCase() === 'good'
                ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                : detail?.rate?.toLowerCase() === 'fair'
                  ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                  : detail?.rate?.toLowerCase() === 'poor'
                    ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                    : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
            {#if i !== 0 && i % 4 === 0}
              <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                <div class="relative">
                  <div
                    class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                    {new Date(detail?.from).toLocaleString('en-CA', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </div>
                </div>
              </div>
            {/if}

            <div
              class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Collect Rating :</span>
                <span
                  class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                  'excellent'
                    ? 'text-green-500'
                    : detail?.rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : detail?.rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : detail?.rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}">{detail?.rate}</span>
              </div>
              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Collect Avg (ms) :</span>
                <span
                  class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                  'excellent'
                    ? 'text-green-500'
                    : detail?.rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : detail?.rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : detail?.rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}">{detail?.avg_ms}<sub>ms</sub></span>
              </div>

              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Lowest Duration :</span>
                <span class="flex justify-center items-center text-sm text-nowrap text-white"
                  >{detail?.min_ms}<sub>ms</sub></span>
              </div>

              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Mostest Duration :</span>
                <span class="flex justify-center items-center text-sm text-nowrap text-white"
                  >{detail?.max_ms}<sub>ms</sub></span>
              </div>

              <div
                class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                <div class="flex justify-between items-center gap-1 w-full">
                  <span>From</span>
                  <span class="text-white/30">
                    {new Date(detail?.from).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}</span>
                </div>

                <div class="flex justify-between items-center gap-1 w-full">
                  <span>Until</span>
                  <span class="text-white/30">
                    {new Date(detail?.to).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}</span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        {#each Array(24) as _, i}
          <div
            class="h-1 w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757] {date
              ? 'min-w-[40.5px] sm:min-w-[60.5px]'
              : 'min-w-[14.3px]'}">
            <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
            <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
              {String(i + 1)
                .toString()
                .padStart(2, '0')}:00
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{:else}
  <div
    class="h-40.5 sm:h-57 3xl:h-52 dark:bg-[#0D0D0D] bg-[#FFFFFF] w-full relative flex justify-center items-center overflow-hidden rounded-[14px] text-red-500/50 animate-pulse border border-[#F87171]/15 text-xl ">
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
