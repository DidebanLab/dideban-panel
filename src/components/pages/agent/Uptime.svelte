<script>
  import { onMount } from 'svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import { LIMITATIONS } from '../../config.svelte';

  let { id, date, summaryWithDate } = $props();
  let history = $state(null);
  let historyDetail = $state(null);
  const required = $state(innerWidth < 1280 ? 31 : 96);
  let missing = $derived(Math.max(0, required - (history?.data?.length ?? 0)));

  $effect(() => {
    if (!date) {
      http
        .get(endpoints.agentHistory(id), {
          params: { short: true, detail: true, page_size: required },
        })
        .then(res => {
          history = { ...res.data, data: res.data?.data.slice(-required) };
        });
    }
  });
</script>

<div
  class="relative w-full flex flex-col p-6 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {date
    ? 'h-43'
    : 'h-35'}">
  <div class="w-full flex justify-between items-start">
    <div class="w-fit flex flex-col justify-start items-start">
      <span class="text-lg text-black dark:text-white">Uptime</span>

      {#if date ? summaryWithDate?.date : history?.last_collected}
        <div class="flex justify-end items-center gap-2 text-xs text-white/40">
          <span class="flex justify-center items-center text-nowrap"
            >{date ? 'Date : ' + summaryWithDate?.date : 'Last Collected :'}</span>

          {#if !date}
            <span class="flex justify-center items-center text-nowrap tracking-wider">
              {new Date(history?.last_collected).toLocaleString('en-CA', {
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
          class="text-2xl {history?.uptime_percent >= 90
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
        <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
      {/if}
    {:else if summaryWithDate?.overall?.uptime_percent}
      <span
        class="text-2xl {summaryWithDate?.overall?.uptime_percent >= 90
          ? 'text-[#008236]'
          : summaryWithDate?.overall?.uptime_percent >= 80
            ? 'text-[#00D492]'
            : summaryWithDate?.overall?.uptime_percent >= 70
              ? 'text-[#FDC700]'
              : summaryWithDate?.overall?.uptime_percent >= 50
                ? 'text-[#F97316]'
                : 'text-[#EF4444]'}">
        {summaryWithDate?.overall?.uptime_percent}%
      </span>{:else}
      <span class="text-2xl text-white/20 text-nowrap"> No Data </span>{/if}
  </div>

  <div
    class=" w-full z-10 flex flex-row-reverse gap-0.5 justify-between items-end absolute start-1/2 -translate-x-1/2 px-6 {date
      ? 'bottom-14'
      : 'bottom-6'}">
    {#if !date}
      {#each history?.data as detail (detail[0])}
        {@const status = detail[1]}

        <button
          type="button"
          aria-label="detail of status"
          onmouseover={() => {
            if (!date) {
              http
                .get(endpoints.agentHistoryDetail(id, detail[0]))
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
                .get(endpoints.agentHistoryDetail(id, detail[0]))
                .then(res => (historyDetail = res.data?.data));
            }
          }}
          onblur={() => {
            if (!date) {
              historyDetailDetail = null;
            }
          }}
          class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
          'offline'
            ? 'bg-[#EF4444]'
            : status === 'online'
              ? 'bg-green-700'
              : 'bg-[#FFFFFF]/10'}">
          {#if historyDetail}
            <div
              class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start {historyDetail.is_offline
                ? 'gap-1.5'
                : 'gap-2.5'}">
              {#if historyDetail.collect_duration_ms}
                <div
                  class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Latency :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap {historyDetail.collect_duration_ms >
                    LIMITATIONS.collect_duration_ms.error
                      ? 'text-[#F87171]'
                      : historyDetail.collect_duration_ms > LIMITATIONS.collect_duration_ms.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'}">{historyDetail.collect_duration_ms}<sub>ms</sub></span>
                </div>
              {/if}

              {#if historyDetail.cpu_usage_percent}
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
                        class="flex justify-center items-center text-sm text-nowrap {historyDetail.cpu_usage_percent >
                        LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'}">{historyDetail.cpu_usage_percent}%</span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      class="h-full rounded-full {historyDetail.cpu_usage_percent >
                      LIMITATIONS.cpu.error
                        ? 'bg-[#F87171]'
                        : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'}"
                      style="width: {Math.min(
                        historyDetail.cpu_usage_percent,
                        100,
                      )}%;box-shadow: 0 0 10px 1px {historyDetail.cpu_usage_percent >
                      LIMITATIONS.cpu.error
                        ? '#F87171'
                        : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                          ? '#F97316'
                          : '#008236'};">
                    </div>
                  </div>
                </div>
              {/if}

              {#if historyDetail.memory_usage_percent}
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
                        class="flex justify-center items-center text-sm text-nowrap {historyDetail.memory_usage_percent >
                        LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'}">{historyDetail.memory_usage_percent}%</span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      class="h-full rounded-full {historyDetail.memory_usage_percent >
                      LIMITATIONS.memory.error
                        ? 'bg-[#F87171]'
                        : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'}"
                      style="width: {Math.min(
                        historyDetail.memory_usage_percent,
                        100,
                      )}%;box-shadow: 0 0 10px 1px {historyDetail.memory_usage_percent >
                      LIMITATIONS.memory.error
                        ? '#F87171'
                        : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                          ? '#F97316'
                          : '#008236'};">
                    </div>
                  </div>
                </div>
              {/if}

              {#if historyDetail.disk_usage_percent}
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
                        class="flex justify-center items-center text-sm text-nowrap {historyDetail.disk_usage_percent >
                        LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'}">{historyDetail.disk_usage_percent}%</span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      class="h-full rounded-full {historyDetail.disk_usage_percent >
                      LIMITATIONS.disk.error
                        ? 'bg-[#F87171]'
                        : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'}"
                      style="width: {Math.min(
                        historyDetail.disk_usage_percent,
                        100,
                      )}%;box-shadow: 0 0 10px 1px {historyDetail.disk_usage_percent >
                      LIMITATIONS.disk.error
                        ? '#F87171'
                        : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                          ? '#F97316'
                          : '#008236'};">
                    </div>
                  </div>
                </div>
              {/if}
              {#if historyDetail?.is_offline}
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
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
            </div>{/if}
        </button>
      {/each}
      {#each Array(missing) as _, i}
        <div
          aria-hidden="true"
          class="w-4 h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
        </div>
      {/each}
    {:else}
      {#each summaryWithDate?.uptime_series as uptime, i}
        <button
          type="button"
          aria-label="detail of status"
          class="w-full h-6 rounded-[1px] transition-all cursor-pointer relative group {uptime.collect_count
            ? 'bg-green-700 hover:h-7'
            : 'bg-[#FFFFFF]/10'}">
          {#if uptime.avg_collect_duration_ms}
            <div
              class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1.5">
              {#if uptime.avg_collect_duration_ms}
                <div
                  class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Latency :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap {uptime.avg_collect_duration_ms >
                    LIMITATIONS.collect_duration_ms.error
                      ? 'text-[#F87171]'
                      : uptime.avg_collect_duration_ms > LIMITATIONS.collect_duration_ms.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'}">{uptime.avg_collect_duration_ms}<sub>ms</sub></span>
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
                            : 'text-green-700'}">{uptime?.avg_cpu_usage}%</span>
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
                      )}%;box-shadow: 0 0 10px 1px {uptime?.avg_cpu_usage > LIMITATIONS.cpu.error
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
                            : 'text-green-700'}">{uptime.avg_memory_usage}%</span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      class="h-full rounded-full {uptime.avg_memory_usage > LIMITATIONS.memory.error
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
                            : 'text-green-700'}">{uptime?.avg_disk_usage}%</span>
                    </div>
                  </div>
                  <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      class="h-full rounded-full {uptime?.avg_disk_usage > LIMITATIONS.disk.error
                        ? 'bg-[#F87171]'
                        : uptime?.avg_disk_usage > LIMITATIONS.disk.warn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'}"
                      style="width: {Math.min(
                        uptime?.avg_disk_usage,
                        100,
                      )}%;box-shadow: 0 0 10px 1px {uptime?.avg_disk_usage > LIMITATIONS.disk.error
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
            {(summaryWithDate?.uptime_series?.length - i).toString().padStart(2, '0')}:00
          </div>
        </button>
      {/each}
      {#each Array(24 - (summaryWithDate?.uptime_series?.length || 0)) as _, i}
        <div
          aria-hidden="true"
          class="w-full relative h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10">
          <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
          <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
            {((summaryWithDate?.uptime_series?.length || 24) - i).toString().padStart(2, '0')}:00
          </div>
        </div>
      {/each}

      <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full px-6">
        <div class="h-px w-full bg-white/10"></div>
      </div>
    {/if}
  </div>
</div>
