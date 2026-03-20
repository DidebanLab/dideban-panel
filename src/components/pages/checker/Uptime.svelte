<script>
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import responseTimeColor from '../../../utils/responseTimeColor';

  let { id, date, summaryWithDate } = $props();
  let history = $state();
  let historyDetail = $state();
  const required = $state(innerWidth < 1280 ? 31 : 96);
  let missing = $derived(Math.max(0, required - (history?.data?.length ?? 0)));

  $effect(() => {
    if (!date) {
      http
        .get(endpoints.checkHistory(id), {
          params: { short: true, detail: true, page_size: required },
        })
        .then(res => (history = { ...res.data, data: res.data?.data?.reverse() }));
    }
  });
</script>

<div
  class="w-full relative flex flex-col gap-4 border-[#0D0D0D]/5 dark:border-white/5 {date
    ? 'sm:h-43 sm:rounded-[14px] sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border sm:px-6 sm:py-6'
    : 'h-29 sm:h-35 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border  px-4.25 py-4 sm:px-6 sm:py-6'}">
  <div class="w-full flex justify-between items-start">
    <div class="w-fit flex flex-col justify-start items-start">
      <span class="text-lg text-black dark:text-white">Uptime</span>

      {#if date ? summaryWithDate?.date : history?.last_checked}
        <div class="flex justify-end items-center gap-2 text-xs text-white/40">
          <span class="flex justify-center items-center text-nowrap"
            >{date ? 'Date : ' + summaryWithDate?.date : 'Last Check :'}</span>

          {#if !date}
            <span class="flex justify-center items-center text-nowrap tracking-wider">
              {new Date(history?.last_checked).toLocaleString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}</span>
          {/if}
        </div>{/if}
    </div>
    {#if date}
      {#if summaryWithDate?.overall.uptime_percent}
        <span
          class="text-lg sm:text-2xl {summaryWithDate?.overall.uptime_percent
            ? summaryWithDate?.overall.uptime_percent >= 90
              ? 'text-[#008236]'
              : summaryWithDate?.overall.uptime_percent >= 80
                ? 'text-[#00D492]'
                : summaryWithDate?.overall.uptime_percent >= 70
                  ? 'text-[#FDC700]'
                  : summaryWithDate?.overall.uptime_percent >= 50
                    ? 'text-[#F97316]'
                    : 'text-[#EF4444]'
            : 'text-white/20'}">
          {summaryWithDate?.overall.uptime_percent
            ? summaryWithDate?.overall.uptime_percent + '%'
            : 'No Data'}
        </span>
      {:else}
        <span class="text-lg sm:text-2xl text-white/20">No Data</span>
      {/if}
    {:else if history?.uptime_percent}
      <span
        class="text-lg sm:text-2xl {history?.uptime_percent >= 90
          ? 'text-[#008236]'
          : history?.uptime_percent >= 80
            ? 'text-[#00D492]'
            : history?.uptime_percent >= 70
              ? 'text-[#FDC700]'
              : history?.uptime_percent >= 50
                ? 'text-[#F97316]'
                : 'text-[#EF4444]'}">
        {history?.uptime_percent}%
      </span>
    {:else}
      <span class="text-lg sm:text-2xl text-white/20">No Data</span>
    {/if}
  </div>

  <div
    class="w-full z-10 flex gap-0.5 justify-start items-end {date
      ? 'overflow-x-auto overflow-y-hidden 3xl:overflow-x-visible 3xl:overflow-y-visible relative pb-10 3xl:pb-0'
      : 'bottom-4 sm:bottom-6 absolute start-1/2 -translate-x-1/2 px-4.25 sm:px-6'}">
    {#if !date}
      {#each Array(missing) as _, i}
        <div
          aria-hidden="true"
          class="w-full h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
        </div>
      {/each}
      {#each history?.data as detail (detail[0])}
        {@const status = detail[1]}

        <button
          type="button"
          aria-label="detail of status"
          onmouseover={() => {
            if (!date) {
              http
                .get(endpoints.checkHistoryDetail(id, detail[0]))
                .then(res => (historyDetail = res.data?.data));
            }
          }}
          onmouseleave={() => {
            if (!date) {
              historyDetail = null;
            }
          }}
          onfocus={() => {
            if (!date) {
              http
                .get(endpoints.checkHistoryDetail(id, detail[0]))
                .then(res => (historyDetail = res.data?.data));
            }
          }}
          onblur={() => {
            if (!date) {
              historyDetailDetail = null;
            }
          }}
          class="w-full h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
            'error' || status === 'down'
            ? 'bg-[#EF4444]'
            : status === 'timeout'
              ? 'bg-[#F97316]'
              : status === 'up'
                ? 'bg-green-700'
                : 'bg-[#FFFFFF]/10'}">
          {#if historyDetail}
            <div
              class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Status :</span>
                <span
                  class="flex justify-center items-center text-sm text-nowrap capitalize {historyDetail?.status ===
                    'error' || historyDetail?.status === 'down'
                    ? 'text-[#F87171]'
                    : historyDetail?.status === 'timeout'
                      ? 'text-[#F97316]'
                      : historyDetail?.status === 'up'
                        ? 'text-green-700'
                        : ''}">{historyDetail?.status}</span>
              </div>
              {#if historyDetail?.response_time_ms}
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Latency :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap {responseTimeColor(
                      historyDetail?.response_time_ms,
                    )}">{historyDetail?.response_time_ms} ms</span>
                </div>
              {/if}
              {#if historyDetail?.status_code}
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Status Code :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap {historyDetail?.status ===
                      'error' || historyDetail?.status === 'down'
                      ? 'text-[#F87171]'
                      : historyDetail?.status === 'up'
                        ? 'text-green-700'
                        : ''}">{historyDetail?.status_code}</span>
                </div>
              {/if}
              {#if historyDetail?.error_message}
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Error Message :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#F87171]"
                    >{historyDetail?.error_message}</span>
                </div>
              {/if}

              <div
                class="w-full flex justify-start items-center text-sm pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                {new Date(historyDetail?.checked_at).toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </div>
            </div>
          {/if}
        </button>
      {/each}
    {:else}
      {#if summaryWithDate?.uptime_series}
        {#each summaryWithDate?.uptime_series as uptime, i}
          <button
            type="button"
            aria-label="detail of status"
            class="min-w-[40.5px] sm:min-w-[60.5px] w-full h-6 transition-all cursor-pointer relative group {uptime
              ? uptime >= 90
                ? 'hover:bg-[#008236]/70 bg-[#008236]'
                : uptime >= 80
                  ? 'hover:bg-[#00D492]/70 bg-[#00D492]'
                  : uptime >= 70
                    ? 'hover:bg-[#FDC700]/70 bg-[#FDC700]'
                    : uptime >= 50
                      ? 'hover:bg-[#F97316]/70 bg-[#F97316]'
                      : 'hover:bg-[#EF4444]/70 bg-[#EF4444]'
              : 'bg-white/5'}">
            {#if uptime}
              <div
                class="absolute top-1/2 start-1/2 -translate-1/2 text-xs text-white transition-all">
                {uptime + '%'}
              </div>
            {/if}

            <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>

            <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
              {(i + 1).toString().padStart(2, '0')}:00
            </div>
          </button>
        {/each}
      {:else}
        {#each Array(24) as _, i}
          <div aria-hidden="true" class="w-full h-6 rounded-[1px] bg-white/5 relative">
            <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
            <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
              {(24 - i).toString().padStart(2, '0')}:00
            </div>
          </div>
        {/each}
      {/if}

      <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full">
        <div class="h-px w-full bg-white/10"></div>
      </div>
    {/if}
  </div>
</div>
