<script>
  import { onMount, onDestroy } from 'svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import { LIMITATIONS } from '../../config.svelte';
  import { off, on, subscribe, unsubscribe } from '../../../services/ws.svelte';
  import formatNumber from '../../../utils/formatNumber';

  const REQUIRED_HISTORY_COUNT = $state(
    innerWidth < 780
      ? 31
      : innerWidth < 1024
        ? 50
        : innerWidth < 1280
          ? 55
          : innerWidth < 1536
            ? 70
            : innerWidth < 1920
              ? 75
              : 96,
  );
  let { agentId, date, summaryWithDate, summaryWithDateLoading } = $props();
  let history = $state(null);
  let historyDetail = $state(null);
  let lastChecked = $state(null);
  let historyLoading = $derived(date ? summaryWithDateLoading : true);
  let historyDetailLoading = $state(true);

  $effect(() => {
    if (!date) {
      historyLoading = true;
      http
        .get(endpoints.agentHistory(agentId), {
          params: { short: true, detail: true, page_size: REQUIRED_HISTORY_COUNT },
        })
        .then(res => {
          lastChecked = res.data?.last_collected;
          history = { ...res.data, data: res.data?.data?.reverse() };
        })
        .finally(() => {
          historyLoading = false;
        });

      subscribe(`agents:${agentId}`);
      on('agent.metric.created', handleNewHistory);
    } else {
      off('agent.metric.created', handleNewHistory);
      unsubscribe(`agents:${agentId}`);
    }
  });

  onDestroy(() => {
    off('agent.metric.created', handleNewHistory);
    unsubscribe(`agents:${agentId}`);
  });

  function handleNewHistory(data) {
    if (data.agent_id !== agentId) return;

    const newHistoryData = [
      ...history.data,
      [data?.id, data?.is_offline ? 'offline' : 'online'],
    ].slice(-REQUIRED_HISTORY_COUNT);

    const newUptimePercent =
      (newHistoryData.filter(item => {
        return item[1] && item[1] === 'online';
      }).length *
        100) /
      newHistoryData.map(item => item && item[1]).length;

    history = {
      ...history,
      uptime_percent: newUptimePercent,
      data: newHistoryData,
    };

    lastChecked = data?.collected_at;
  }
</script>

{#if historyLoading}
  <div
    class="w-full relative flex flex-col gap-4 sm:gap-6 border-[#0D0D0D]/5 dark:border-white/5 {date
      ? 'sm:h-43 sm:rounded-[14px] sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border sm:px-6 sm:py-6'
      : 'h-29 sm:h-35 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border  px-4.25 py-4 sm:px-6 sm:py-6'}">
    <div class="w-full flex justify-between items-start">
      <div class="w-fit flex flex-col justify-start items-start">
        <span class="text-lg text-black dark:text-white">Uptime</span>

        <div class="flex justify-end items-center gap-1 text-xs text-white/40">
          <span class="flex justify-center items-center text-nowrap">
            {date ? 'Date : ' : 'Last Check :'}
          </span>

          <span class=" h-4 bg-white/5 rounded-md animate-pulse {date ? 'w-17' : 'w-31.75'}">
          </span>
        </div>
      </div>

      <span class="bg-white/5 rounded-lg w-14 h-7.5 animate-pulse"> </span>
    </div>

    <div
      class="w-full z-10 flex gap-0.5 justify-start items-end animate-pulse {date
        ? 'overflow-x-auto overflow-y-hidden 3xl:overflow-x-visible 3xl:overflow-y-visible relative pb-10 3xl:pb-0'
        : 'bottom-4 sm:bottom-6 absolute start-1/2 -translate-x-1/2 px-4.25 sm:px-6'}">
      {#if !date}
        {#each Array(REQUIRED_HISTORY_COUNT) as _, i}
          <div class="w-full h-4 rounded-[1px] bg-black/20 dark:bg-white/5"></div>
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

        <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full">
          <div class="h-px w-full bg-white/10"></div>
        </div>
      {/if}
    </div>
  </div>
{:else if date ? summaryWithDate : history}
  <div
    class="w-full relative flex flex-col gap-4 sm:gap-6 border-[#0D0D0D]/5 dark:border-white/5 {date
      ? 'sm:h-43 sm:rounded-[14px] sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border sm:px-6 sm:py-6'
      : 'h-29 sm:h-35 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border  px-4.25 py-4 sm:px-6 sm:py-6'}">
    <div class="w-full flex justify-between items-start">
      <div class="w-fit flex flex-col justify-start items-start">
        <span class="text-lg text-black dark:text-white">Uptime</span>

        {#if date ? summaryWithDate?.date : lastChecked}
          <div class="flex justify-end items-center gap-2 text-xs text-white/40">
            <span class="flex justify-center items-center text-nowrap"
              >{date ? 'Date : ' + summaryWithDate?.date : 'Last Collected :'}</span>

            {#if !date}
              <span class="flex justify-center items-center text-nowrap tracking-wider">
                {new Date(lastChecked).toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </span>
            {/if}
          </div>
        {/if}
      </div>

      {#if !date}
        {#if history?.uptime_percent}
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
            {formatNumber(history?.uptime_percent)}%
          </span>
        {/if}
      {:else if summaryWithDate?.overall?.uptime_percent}
        <span
          class="text-lg sm:text-2xl {summaryWithDate?.overall?.uptime_percent >= 90
            ? 'text-[#008236]'
            : summaryWithDate?.overall?.uptime_percent >= 80
              ? 'text-[#00D492]'
              : summaryWithDate?.overall?.uptime_percent >= 70
                ? 'text-[#FDC700]'
                : summaryWithDate?.overall?.uptime_percent >= 50
                  ? 'text-[#F97316]'
                  : 'text-[#EF4444]'}">
          {formatNumber(summaryWithDate?.overall?.uptime_percent)}%
        </span>
      {/if}
    </div>

    <div
      class="w-full z-10 flex gap-0.5 justify-start items-end {date
        ? 'overflow-x-auto overflow-y-hidden 3xl:overflow-x-visible 3xl:overflow-y-visible relative pb-10 3xl:pb-0'
        : 'bottom-4 sm:bottom-6 absolute start-1/2 -translate-x-1/2 px-4.25 sm:px-6'}">
      {#if !date}
        {#each Array(Math.max(0, REQUIRED_HISTORY_COUNT - (history?.data?.length || 0)))}
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
              historyDetail = null;
              historyDetailLoading = true;
              http
                .get(endpoints.agentHistoryDetail(agentId, detail[0]))
                .then(res => (historyDetail = res.data?.data))
                .finally(() => {
                  historyDetailLoading = false;
                });
            }}
            onmouseleave={() => {
              historyDetail = null;
            }}
            onfocus={() => {
              historyDetail = null;
              historyDetailLoading = true;
              http
                .get(endpoints.agentHistoryDetail(agentId, detail[0]))
                .then(res => (historyDetail = res.data?.data))
                .finally(() => {
                  historyDetailLoading = false;
                });
            }}
            onblur={() => {
              historyDetail = null;
            }}
            class="w-full h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
            'offline'
              ? 'bg-[#EF4444]'
              : status === 'online'
                ? 'bg-green-700'
                : 'bg-[#FFFFFF]/10'}">
            {#if historyDetailLoading}
              <div
                class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                <div
                  class="w-full flex justify-between items-center gap-6 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Latency :</span>
                  <span class="bg-white/5 w-13 rounded-md h-3.5 animate-pulse"></span>
                </div>
                <div class="flex flex-col items-center w-full gap-1">
                  <div class="w-full flex justify-start items-center gap-2.5">
                    <span
                      style="box-shadow: 0 0 10px 1px #ad46ff;"
                      class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                    <div class="flex-1 flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Cpu :</span>
                      <span class="bg-white/5 w-10 rounded-md h-3.5 animate-pulse"></span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10 animate-pulse">
                    <div
                      class="h-full rounded-full bg-white/5"
                      style="width:50%;box-shadow: 0 0 1px 1px rgba(250,250,250,0.1);">
                    </div>
                  </div>
                </div>

                <div class="flex flex-col items-center w-full gap-1">
                  <div class="w-full flex justify-start items-center gap-2.5">
                    <span
                      style="box-shadow: 0 0 10px 1px #2b7fff;"
                      class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                    <div class="flex-1 flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Memory :</span>
                      <span class="bg-white/5 w-10 rounded-md h-3.5 animate-pulse"></span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10 animate-pulse">
                    <div
                      class="h-full1 rounded-full bg-white/5"
                      style="width:30%;box-shadow: 0 0 1px 1px rgba(250,250,250,0.1);">
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-center w-full gap-1">
                  <div class="w-full flex justify-start items-center gap-2.5">
                    <span
                      style="box-shadow: 0 0 10px 1px #00bc7d;"
                      class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                    <div class="flex-1 flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Disk :</span>
                      <span class="bg-white/5 w-10 rounded-md h-3.5 animate-pulse"></span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10 animate-pulse">
                    <div
                      class="h-full rounded-full bg-white/5"
                      style="width:70%;box-shadow: 0 0 1px 1px rgba(250,250,250,0.1);">
                    </div>
                  </div>
                </div>

                <div
                  class="w-full flex justify-start items-center text-sm pt-2.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                  <span class="bg-white/5 w-full rounded-md h-4 animate-pulse"></span>
                </div>
              </div>
            {:else if historyDetail}
              <div
                class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start {historyDetail?.is_offline
                  ? 'gap-1.5'
                  : 'gap-2.5'}">
                {#if historyDetail?.collect_duration_ms}
                  <div
                    class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Latency :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap {historyDetail?.collect_duration_ms >
                      LIMITATIONS.collect_duration_ms.error
                        ? 'text-[#F87171]'
                        : historyDetail?.collect_duration_ms > LIMITATIONS.collect_duration_ms.warn
                          ? 'text-[#F97316]'
                          : 'text-green-700'}">{historyDetail?.collect_duration_ms} ms</span>
                  </div>
                {/if}

                {#if historyDetail?.cpu_usage_percent}
                  <div class="flex flex-col items-center w-full gap-1">
                    <div class="w-full flex justify-start items-center gap-2.5">
                      <span
                        style="box-shadow: 0 0 10px 1px #ad46ff;"
                        class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                      <div class="flex-1 flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Cpu :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap {historyDetail?.cpu_usage_percent >
                          LIMITATIONS.cpu.error
                            ? 'text-[#F87171]'
                            : historyDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                              ? 'text-[#F97316]'
                              : 'text-green-700'}">{historyDetail?.cpu_usage_percent}%</span>
                      </div>
                    </div>
                    <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        class="h-full rounded-full {historyDetail?.cpu_usage_percent >
                        LIMITATIONS.cpu.error
                          ? 'bg-[#F87171]'
                          : historyDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'bg-[#F97316]'
                            : 'bg-green-700'}"
                        style="width: {Math.min(
                          historyDetail?.cpu_usage_percent,
                          100,
                        )}%;box-shadow: 0 0 10px 1px {historyDetail?.cpu_usage_percent >
                        LIMITATIONS.cpu.error
                          ? '#F87171'
                          : historyDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? '#F97316'
                            : '#008236'};">
                      </div>
                    </div>
                  </div>
                {/if}

                {#if historyDetail?.memory_usage_percent}
                  <div class="flex flex-col items-center w-full gap-1">
                    <div class="w-full flex justify-start items-center gap-2.5">
                      <span
                        style="box-shadow: 0 0 10px 1px #2b7fff;"
                        class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                      <div class="flex-1 flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Memory :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap {historyDetail?.memory_usage_percent >
                          LIMITATIONS.memory.error
                            ? 'text-[#F87171]'
                            : historyDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                              ? 'text-[#F97316]'
                              : 'text-green-700'}">{historyDetail?.memory_usage_percent}%</span>
                      </div>
                    </div>
                    <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        class="h-full rounded-full {historyDetail?.memory_usage_percent >
                        LIMITATIONS.memory.error
                          ? 'bg-[#F87171]'
                          : historyDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'bg-[#F97316]'
                            : 'bg-green-700'}"
                        style="width: {Math.min(
                          historyDetail?.memory_usage_percent,
                          100,
                        )}%;box-shadow: 0 0 10px 1px {historyDetail?.memory_usage_percent >
                        LIMITATIONS.memory.error
                          ? '#F87171'
                          : historyDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? '#F97316'
                            : '#008236'};">
                      </div>
                    </div>
                  </div>
                {/if}

                {#if historyDetail?.disk_usage_percent}
                  <div class="flex flex-col items-center w-full gap-1">
                    <div class="w-full flex justify-start items-center gap-2.5">
                      <span
                        style="box-shadow: 0 0 10px 1px #22c55e;"
                        class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                      <div class="flex-1 flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Disk :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap {historyDetail?.disk_usage_percent >
                          LIMITATIONS.disk.error
                            ? 'text-[#F87171]'
                            : historyDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                              ? 'text-[#F97316]'
                              : 'text-green-700'}">{historyDetail?.disk_usage_percent}%</span>
                      </div>
                    </div>
                    <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        class="h-full rounded-full {historyDetail?.disk_usage_percent >
                        LIMITATIONS.disk.error
                          ? 'bg-[#F87171]'
                          : historyDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'bg-[#F97316]'
                            : 'bg-green-700'}"
                        style="width: {Math.min(
                          historyDetail?.disk_usage_percent,
                          100,
                        )}%;box-shadow: 0 0 10px 1px {historyDetail?.disk_usage_percent >
                        LIMITATIONS.disk.error
                          ? '#F87171'
                          : historyDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? '#F97316'
                            : '#008236'};">
                      </div>
                    </div>
                  </div>
                {/if}
                {#if historyDetail?.is_offline}
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Status :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap capitalize text-[#F87171]"
                      >Offline</span>
                  </div>
                {/if}

                <div
                  class="w-full flex justify-start items-center text-sm text-nowrap text-[#6a7282] text-center border-t-black/10 dark:border-t-white/15 border-t pt-1.5">
                  {new Date(historyDetail?.collected_at).toLocaleString('en-CA', {
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
            {:else}
              <div
                class="absolute text-nowrap py-2 px-3 group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl justify-center items-center overflow-hidden rounded-xl text-red-500/50 border border-[#F87171]/15 text-sm">
                <div
                  class="w-full h-full relative flex justify-center items-center rounded-xl animate-pulse text-nowrap">
                  <div
                    class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
                    style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
                    <div class="w-full h-full bg-white/5"></div>
                  </div>

                  <div class="flex justify-center items-center gap-1 text-nowrap">
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
                    <span class="text-red-500/70 mt-0.5 text-nowrap">Something Is Wrong</span>
                  </div>
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
              class="min-w-[40.5px] sm:min-w-[60.5px] w-full h-6 transition-all cursor-pointer relative group {uptime.collect_count
                ? 'bg-green-700 hover:h-6'
                : 'bg-[#FFFFFF]/10'}">
              {#if uptime.avg_collect_duration_ms}
                <div
                  class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1.5">
                  {#if uptime.avg_collect_duration_ms}
                    <div
                      class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Latency :</span>
                      <span
                        class="flex justify-center items-center text-sm text-nowrap {uptime.avg_collect_duration_ms >
                        LIMITATIONS.collect_duration_ms.error
                          ? 'text-[#F87171]'
                          : uptime.avg_collect_duration_ms > LIMITATIONS.collect_duration_ms.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'}"
                        >{uptime.avg_collect_duration_ms}<sub>ms</sub></span>
                    </div>
                  {/if}

                  {#if uptime?.avg_cpu_usage}
                    <div class="flex flex-col items-center w-full gap-1">
                      <div class="w-full flex justify-start items-center gap-2.5">
                        <span
                          style="box-shadow: 0 0 10px 1px #ad46ff;"
                          class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                        <div class="flex-1 flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Cpu :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {uptime?.avg_cpu_usage >
                            LIMITATIONS.cpu.error
                              ? 'text-[#F87171]'
                              : uptime?.avg_cpu_usage > LIMITATIONS.cpu.warn
                                ? 'text-[#F97316]'
                                : 'text-green-700'}">{formatNumber(uptime?.avg_cpu_usage)}%</span>
                        </div>
                      </div>
                      <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                        <div
                          class="h-full rounded-full {uptime?.avg_cpu_usage > LIMITATIONS.cpu.error
                            ? 'bg-[#F87171]'
                            : uptime?.avg_cpu_usage > LIMITATIONS.cpu.warn
                              ? 'bg-[#F97316]'
                              : 'bg-green-700'}"
                          style="width: {Math.min(
                            uptime?.avg_cpu_usage,
                            100,
                          )}%;box-shadow: 0 0 10px 1px {uptime?.avg_cpu_usage >
                          LIMITATIONS.cpu.error
                            ? '#F87171'
                            : uptime?.avg_cpu_usage > LIMITATIONS.cpu.warn
                              ? '#F97316'
                              : '#008236'};">
                        </div>
                      </div>
                    </div>
                  {/if}

                  {#if uptime.avg_memory_usage}
                    <div class="flex flex-col items-center w-full gap-1">
                      <div class="w-full flex justify-start items-center gap-2.5">
                        <span
                          style="box-shadow: 0 0 10px 1px #2b7fff;"
                          class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                        <div class="flex-1 flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Memory :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {uptime.avg_memory_usage >
                            LIMITATIONS.memory.error
                              ? 'text-[#F87171]'
                              : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                                ? 'text-[#F97316]'
                                : 'text-green-700'}">{formatNumber(uptime.avg_memory_usage)}%</span>
                        </div>
                      </div>
                      <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                        <div
                          class="h-full rounded-full {uptime.avg_memory_usage >
                          LIMITATIONS.memory.error
                            ? 'bg-[#F87171]'
                            : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                              ? 'bg-[#F97316]'
                              : 'bg-green-700'}"
                          style="width: {Math.min(
                            uptime.avg_memory_usage,
                            100,
                          )}%;box-shadow: 0 0 10px 1px {uptime.avg_memory_usage >
                          LIMITATIONS.memory.error
                            ? '#F87171'
                            : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                              ? '#F97316'
                              : '#008236'};">
                        </div>
                      </div>
                    </div>
                  {/if}

                  {#if uptime?.avg_disk_usage}
                    <div class="flex flex-col items-center w-full gap-1 pb-1.5">
                      <div class="w-full flex justify-start items-center gap-2.5">
                        <span
                          style="box-shadow: 0 0 10px 1px #22c55e;"
                          class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                        <div class="flex-1 flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Disk :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {uptime?.avg_disk_usage >
                            LIMITATIONS.disk.error
                              ? 'text-[#F87171]'
                              : uptime?.avg_disk_usage > LIMITATIONS.disk.warn
                                ? 'text-[#F97316]'
                                : 'text-green-700'}">{formatNumber(uptime?.avg_disk_usage)}%</span>
                        </div>
                      </div>
                      <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                        <div
                          class="h-full rounded-full {uptime?.avg_disk_usage >
                          LIMITATIONS.disk.error
                            ? 'bg-[#F87171]'
                            : uptime?.avg_disk_usage > LIMITATIONS.disk.warn
                              ? 'bg-[#F97316]'
                              : 'bg-green-700'}"
                          style="width: {Math.min(
                            uptime?.avg_disk_usage,
                            100,
                          )}%;box-shadow: 0 0 10px 1px {uptime?.avg_disk_usage >
                          LIMITATIONS.disk.error
                            ? '#F87171'
                            : uptime?.avg_disk_usage > LIMITATIONS.disk.warn
                              ? '#F97316'
                              : '#008236'};">
                        </div>
                      </div>
                    </div>
                  {/if}
                  {#if uptime?.start_time && uptime?.end_time}
                    <div
                      class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>From</span>
                        <span class="text-white/30">{uptime?.start_time} </span>
                      </div>

                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>Until</span>
                        <span class="text-white/30"> {uptime?.end_time}</span>
                      </div>
                    </div>{/if}
                </div>{/if}

              <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>

              <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                {(i + 1).toString().padStart(2, '0')}:00
              </div>
            </button>
          {/each}
        {:else}
          {#each Array(24) as _, i}
            <div
              aria-hidden="true"
              class="min-w-[40.5px] sm:min-w-[60.5px] w-full h-6 rounded-[1px] bg-white/5 relative">
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
{:else}
  <div
    class="w-full relative flex justify-center items-center overflow-hidden rounded-[14px] text-red-500/50 animate-pulse border border-[#F87171]/15 text-xl {date
      ? 'sm:h-43 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border'
      : 'h-29 sm:h-35 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border'}">
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
