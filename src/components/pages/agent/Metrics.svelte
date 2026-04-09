<script>
  import { derived } from 'svelte/store';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import longPolling from '../../../services/longPolling';
  import formatNumber from '../../../utils/formatNumber';
  import responseTimeColor from '../../../utils/responseTimeColor';
  import { LIMITATIONS } from '../../config.svelte';
  import Chart from './Chart.svelte';

  const { id, date, summaryWithDate, hours } = $props();

  let pointIndexHoverd = $state(null);
  let metricPointDetail = $state(null);
  let isMouseInside = $state(false);
  let chart = $state(null);
  let currentPoller = $state(null);

  $effect(() => {
    if (!date) {
      currentPoller = longPolling(endpoints.agentChart(id), {
        params: {
          hours,
          max_points: 60,
        },
        onSuccess: d => {
          chart = d;
        },
      });

      return () => {
        if (currentPoller) {
          currentPoller.stop();
        }
      };
    }
  });

  $effect(() => {
    if (!date && pointIndexHoverd) {
      http
        .get(
          endpoints.agentHistoryDetail(
            id,
            [...chart?.points?.map(item => item?.[0]).reverse()][pointIndexHoverd],
          ),
        )
        .then(res => (metricPointDetail = res.data?.data));
    }
  });
</script>

<div class="flex flex-col-reverse xl:grid xl:grid-cols-12 gap-6 w-full">
  <div
    class="w-full h-71.25 md:h-122.25 col-span-8 3xl:col-span-9 flex flex-col md:pb-0 sm:gap-4 md:pt-4 sm:p-6 sm:pb-1 sm:rounded-[14px] sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-between items-start">
      <div class="w-full flex flex-col justify-start items-start">
        <span class="text-lg md:text-xl text-black dark:text-white">Metrics</span>

        <div class="flex justify-end items-center gap-2 text-xs text-white/40">
          {#if date}
            {#if isMouseInside && summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at}
              <span class="hidden sm:flex justify-center items-center text-nowrap"
                >Collect at :</span>

              <span class="flex justify-center items-center text-nowrap tracking-wider">
                {new Date(
                  summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at,
                ).toLocaleString('en-CA', {
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
          {:else if isMouseInside ? metricPointDetail?.collected_at : chart?.last_history?.collected_at}
            <span class="hidden sm:flex justify-center items-center text-nowrap">Collect at :</span>

            <span class="flex justify-center items-center text-nowrap tracking-wider">
              {#if isMouseInside}
                {new Date(metricPointDetail?.collected_at).toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              {:else}
                {new Date(chart?.last_history?.collected_at).toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              {/if}
            </span>{/if}
        </div>
      </div>

      {#if date}
        {#if isMouseInside && summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms}
          <div
            class="text-xs sm:text-sm py-2 sm:px-3 sm:rounded-full sm:border text-white border-white/5 text-nowrap">
            <span class="text-white/40 me-1">Collect Duration : </span>
            <span
              class="text-sm {responseTimeColor(
                summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms,
              )}">
              {summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms +
                ' ms'}</span>
          </div>
        {:else if summaryWithDate?.overall?.avg_collect_duration_ms}
          <div
            class="text-xs sm:text-sm py-2 sm:px-3 sm:rounded-full sm:border text-white border-white/5 text-nowrap">
            <span class="text-white/40 me-1">Collect Duration : </span>

            <span
              class="text-sm {responseTimeColor(summaryWithDate?.overall?.avg_collect_duration_ms)}"
              >{summaryWithDate?.overall?.avg_collect_duration_ms + ' ms'}
            </span>
          </div>
        {/if}
      {:else if isMouseInside && metricPointDetail?.collect_duration_ms}
        <div
          class="text-xs sm:text-sm py-2 sm:px-3 sm:rounded-full sm:border text-white border-white/5 text-nowrap">
          <span class="text-white/40 me-1">Collect Duration : </span>
          <span class="text-sm {responseTimeColor(metricPointDetail?.collect_duration_ms)}"
            >{metricPointDetail?.collect_duration_ms + ' ms'}</span>
        </div>
      {:else if chart?.last_history?.collect_duration_ms}
        <div
          class="text-xs sm:text-sm py-2 sm:px-3 sm:rounded-full sm:border text-white border-white/5 text-nowrap">
          <span class="text-white/40 me-1">Collect Duration : </span>
          <span class="text-sm {responseTimeColor(chart?.last_history?.collect_duration_ms)}"
            >{chart?.last_history?.collect_duration_ms + ' ms'}</span>
        </div>
      {/if}
    </div>
    {#if Boolean(date ? summaryWithDate?.chart_series?.length > 0 : chart?.points?.length > 0)}
      {@const memoryData = date
        ? [...summaryWithDate?.chart_series.map(item => item?.memory_usage_percent)]
        : [...chart?.points?.map(item => item?.[2]).reverse()]}

      {@const cpuData = date
        ? [...summaryWithDate?.chart_series.map(item => item?.cpu_usage_percent)]
        : [...chart?.points?.map(item => item?.[1]).reverse()]}
      <Chart
        bind:isMouseInside
        bind:pointIndexHoverd
        data={[
          {
            name: 'CPU',
            data: cpuData,
          },
          {
            name: 'Memory',
            data: memoryData,
          },
        ]} />
    {:else}
      <div class="w-full bg-blue-500/50 h-px mt-auto mb-6"></div>
    {/if}
  </div>

  <div
    class="col-span-4 3xl:col-span-3 justify-start items-start sm:border border-[#0D0D0D]/5 dark:border-white/5 py-4 sm:py-6 sm:px-6 sm:rounded-xl grid grid-cols-1 gap-4 sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">CPU</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>
              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                    ?.cpu_usage_percent
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                      LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                          LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series[
                    summaryWithDate.chart_series.length - 1
                  ]?.cpu_usage_percent
                    ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                    ?.cpu_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                          ?.cpu_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (1m): </span>

              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                      LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                          LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                    ? formatNumber(summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1) +
                      '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series[
                    summaryWithDate.chart_series.length - 1
                  ]?.cpu_load_1
                    ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_load_1 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_1 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                    ?.cpu_load_1
                    ? formatNumber(
                        summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                          ?.cpu_load_1,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (5m): </span>

              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                      LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                          LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                    ? formatNumber(summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5) +
                      '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series[
                    summaryWithDate.chart_series.length - 1
                  ]?.cpu_load_5
                    ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_load_5 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_5 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                    ?.cpu_load_5
                    ? formatNumber(
                        summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                          ?.cpu_load_5,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (15m) : </span>

              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                      LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                          LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                    ? formatNumber(summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15) +
                      '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series[
                    summaryWithDate?.chart_series?.length - 1
                  ]?.cpu_load_15
                    ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        .cpu_load_15 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            .cpu_load_15 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                    ?.cpu_load_15
                    ? formatNumber(
                        summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                          ?.cpu_load_15,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
          </div>
        </div>

        <div
          class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
          {#if isMouseInside}
            <div
              style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                pointIndexHoverd
              ]?.cpu_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
              LIMITATIONS.cpu.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                    LIMITATIONS.cpu.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          {:else}
            <div
              style="width:{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                ?.cpu_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                summaryWithDate.chart_series.length - 1
              ]?.cpu_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                ?.cpu_usage_percent > LIMITATIONS.cpu.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_usage_percent > LIMITATIONS.cpu.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series[summaryWithDate.chart_series.length - 1]?.cpu_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                ?.cpu_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">CPU</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>
              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.cpu_usage_percent
                    ? metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}">
                  {metricPointDetail?.cpu_usage_percent
                    ? formatNumber(metricPointDetail?.cpu_usage_percent) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.cpu_usage_percent
                    ? chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.cpu_usage_percent
                    ? formatNumber(chart?.last_history?.cpu_usage_percent) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (1m): </span>

              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.cpu_load_1
                    ? metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{metricPointDetail?.cpu_load_1
                    ? formatNumber(metricPointDetail?.cpu_load_1) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.cpu_load_1
                    ? chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.cpu_load_1
                    ? formatNumber(chart?.last_history?.cpu_load_1) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (5m): </span>

              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.cpu_load_5
                    ? metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{metricPointDetail?.cpu_load_5
                    ? formatNumber(metricPointDetail?.cpu_load_5) + '%'
                    : '-'}
                </span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.cpu_load_5
                    ? chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.cpu_load_5
                    ? formatNumber(chart?.last_history?.cpu_load_5) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Avg (15m) : </span>

              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.cpu_load_15
                    ? metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{metricPointDetail?.cpu_load_15
                    ? formatNumber(metricPointDetail?.cpu_load_15) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.cpu_load_15
                    ? chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.cpu_load_15
                    ? formatNumber(chart?.last_history?.cpu_load_15) + '%'
                    : '-'}</span>
              {/if}
            </div>
          </div>
        </div>

        <div
          class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
          {#if isMouseInside}
            <div
              style="width:{metricPointDetail?.cpu_usage_percent}%;"
              class="h-full rounded-s-md transition-all {metricPointDetail?.cpu_usage_percent ===
              100
                ? 'rounded-e-md'
                : ''} {metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                ? 'bg-[#EF4444]'
                : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.cpu_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {metricPointDetail?.cpu_usage_percent
                ? formatNumber(metricPointDetail?.cpu_usage_percent) + '%'
                : '-'}
            </div>
          {:else}
            <div
              style="width:{chart?.last_history?.cpu_usage_percent}%;"
              class="h-full rounded-s-md transition-all {chart?.last_history?.cpu_usage_percent ===
              100
                ? 'rounded-e-md'
                : ''} {chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                ? 'bg-[#EF4444]'
                : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                ?.last_history?.cpu_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {chart?.last_history?.cpu_usage_percent
                ? formatNumber(chart?.last_history?.cpu_usage_percent) + '%'
                : '-'}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <div class="w-full h-0.5 bg-[#0D0D0D]/5 dark:bg-white/5 rounded-full"></div>

    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">Memory</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>

              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                    ?.memory_usage_percent
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                      LIMITATIONS.memory.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                          LIMITATIONS.memory.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}">
                  {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[
                    summaryWithDate?.chart_series.length - 1
                  ]?.memory_usage_percent
                    ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                        ?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                            ?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                    ?.memory_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                          ?.memory_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Total: </span>

              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}
                  <span class="text-xs text-white"
                    >{formatNumber(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb,
                    )}

                    <sub class="text-white/40">Mb</sub>
                  </span>{:else}
                  <span class="text-xs text-[#F87171]">-</span>
                {/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_total_mb}
                <span class="text-xs text-white"
                  >{formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_total_mb,
                  )}

                  <sub class="text-white/40">Mb</sub>
                </span>{:else}
                <span class="text-xs text-[#F87171]">-</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Used: </span>

              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                  <span class="text-xs text-white">
                    {formatNumber(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb,
                    )}
                    <sub class="text-white/40">Mb</sub>
                  </span>
                {:else}
                  <span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_used_mb}
                <span class="text-xs text-white">
                  {formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_used_mb,
                  )}
                  <sub class="text-white/40">Mb</sub>
                </span>
              {:else}
                <span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Available: </span>

              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                  <span class="text-xs text-white">
                    {formatNumber(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb,
                    )}
                    <sub class="text-white/40">Mb</sub>
                  </span>
                {:else}
                  <span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_available_mb}
                <span class="text-xs text-white">
                  {formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_available_mb,
                  )}
                  <sub class="text-white/40">Mb</sub>
                </span>
              {:else}
                <span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
          </div>
        </div>

        <div
          class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
          {#if isMouseInside}
            <div
              style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                ?.memory_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                pointIndexHoverd
              ]?.memory_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
              LIMITATIONS.memory.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                    LIMITATIONS.memory.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          {:else}
            <div
              style="width:{summaryWithDate?.chart_series?.[
                summaryWithDate?.chart_series.length - 1
              ]?.memory_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                summaryWithDate?.chart_series.length - 1
              ]?.memory_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                ?.memory_usage_percent > LIMITATIONS.memory.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_usage_percent > LIMITATIONS.memory.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                ?.memory_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">Memory</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>

              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.memory_usage_percent
                    ? metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{metricPointDetail?.memory_usage_percent
                    ? formatNumber(metricPointDetail?.memory_usage_percent) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.memory_usage_percent
                    ? chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.memory_usage_percent
                    ? formatNumber(chart?.last_history?.memory_usage_percent) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Total: </span>

              {#if isMouseInside}
                {#if metricPointDetail?.memory_total_mb}
                  <span class="text-xs text-white"
                    >{formatNumber(metricPointDetail?.memory_total_mb)}

                    <sub class="text-white/40">Mb</sub>
                  </span>
                {:else}
                  <span class="text-xs text-[#F87171]">-</span>
                {/if}
              {:else if chart?.last_history?.memory_total_mb}
                <span class="text-xs text-white">
                  {formatNumber(chart?.last_history?.memory_total_mb)}

                  <sub class="text-white/40">Mb</sub>
                </span>{:else}
                <span class="text-xs text-[#F87171]">-</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Used: </span>

              {#if isMouseInside}
                {#if metricPointDetail?.memory_used_mb}
                  <span class="text-xs text-white"
                    >{formatNumber(metricPointDetail?.memory_used_mb)}
                    <sub class="text-white/40">Mb</sub>
                  </span>
                {:else}
                  <span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if chart?.last_history?.memory_used_mb}
                <span class="text-xs text-white"
                  >{formatNumber(chart?.last_history?.memory_used_mb)}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Available: </span>

              {#if isMouseInside}
                {#if metricPointDetail?.memory_available_mb}
                  <span class="text-xs text-white"
                    >{formatNumber(metricPointDetail?.memory_available_mb)}
                    <sub class="text-white/40">Mb</sub>
                  </span>{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if chart?.last_history?.memory_available_mb}
                <span class="text-xs text-white"
                  >{formatNumber(chart?.last_history?.memory_available_mb)}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
          </div>
        </div>

        <div
          class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
          {#if isMouseInside}
            <div
              style="width:{metricPointDetail?.memory_usage_percent}%;"
              class="h-full rounded-s-md transition-all {metricPointDetail?.memory_usage_percent ===
              100
                ? 'rounded-e-md'
                : ''} {metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                ? 'bg-[#EF4444]'
                : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.memory_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {metricPointDetail?.memory_usage_percent
                ? formatNumber(metricPointDetail?.memory_usage_percent) + '%'
                : '-'}
            </div>
          {:else}
            <div
              style="width:{chart?.last_history?.memory_usage_percent}%;"
              class="h-full rounded-s-md transition-all {chart?.last_history
                ?.memory_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                ? 'bg-[#EF4444]'
                : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                ?.last_history?.memory_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {chart?.last_history?.memory_usage_percent
                ? formatNumber(chart?.last_history?.memory_usage_percent) + '%'
                : '-'}
            </div>
          {/if}
        </div>
      </div>{/if}

    <div class="h-px w-full bg-white/10"></div>

    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">Disk</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>

              {#if isMouseInside}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                    ?.disk_usage_percent
                    ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                      LIMITATIONS.disk.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                          LIMITATIONS.disk.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {summaryWithDate?.chart_series?.[
                    summaryWithDate.chart_series.length - 1
                  ]?.disk_usage_percent
                    ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'text-[#F87171]'
                      : summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                            ?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                    ?.disk_usage_percent
                    ? formatNumber(
                        summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                          ?.disk_usage_percent,
                      ) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Total: </span>

              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                  <span class="text-xs text-white"
                    >{formatNumber(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb,
                    )}
                    <sub class="text-white/40">Gb</sub></span
                  >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb}
                <span class="text-xs text-white"
                  >{formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_total_gb,
                  )}
                  <sub class="text-white/40">Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Used: </span>

              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                  <span class="text-xs text-white"
                    >{formatNumber(summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb)}
                    <sub class="text-white/40"> Gb</sub></span
                  >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
                <span class="text-xs text-white"
                  >{formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_used_gb,
                  )}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Available: </span>
              {#if isMouseInside}
                {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb && summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                  <span class="text-xs text-white"
                    >{formatNumber(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb -
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb,
                    )}
                    <sub class="text-white/40"> Gb</sub></span
                  >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb && summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
                <span class="text-xs text-white"
                  >{formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_total_gb -
                      summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_used_gb,
                  )}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
          </div>
        </div>

        {#if isMouseInside}
          <div
            class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
            <div
              style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                ?.disk_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                pointIndexHoverd
              ]?.disk_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
              LIMITATIONS.disk.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                    LIMITATIONS.disk.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          </div>
        {:else}
          <div
            class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
            <div
              style="width:{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                ?.disk_usage_percent}%;"
              class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                summaryWithDate.chart_series.length - 1
              ]?.disk_usage_percent === 100
                ? 'rounded-e-md'
                : ''} {summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                ?.disk_usage_percent > LIMITATIONS.disk.error
                ? 'bg-[#EF4444]'
                : summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_usage_percent > LIMITATIONS.disk.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                ?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                ?.disk_usage_percent
                ? formatNumber(
                    summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_usage_percent,
                  ) + '%'
                : '-'}
            </div>
          </div>{/if}
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div
          class="flex flex-col md:flex-row xl:flex-col justify-start items-start gap-4 md:gap-20 xl:gap-4 w-full">
          <div class="h-full w-30 lg:w-41 xl:w-fit flex justify-start items-start gap-2">
            <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
            <span class="text-lg text-black dark:text-white">Disk</span>
          </div>

          <div
            class="h-full w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4 md:gap-y-0 md:gap-x-0 md:flex justify-between items-center xl:grid xl:grid-cols-2 xl:grid-rows-2 xl:gap-y-2 xl:gap-x-4">
            <div
              class="w-full justify-between md:w-16.25 xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Usage: </span>

              {#if isMouseInside}
                <span
                  class="text-xs {metricPointDetail?.disk_usage_percent
                    ? metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'text-[#F87171]'
                      : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{metricPointDetail?.disk_usage_percent
                    ? formatNumber(metricPointDetail?.disk_usage_percent) + '%'
                    : '-'}</span>
              {:else}
                <span
                  class="text-xs {chart?.last_history?.disk_usage_percent
                    ? chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'text-[#F87171]'
                      : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'text-[#F97316]'
                        : 'text-green-700'
                    : 'text-[#F87171]'}"
                  >{chart?.last_history?.disk_usage_percent
                    ? formatNumber(chart?.last_history?.disk_usage_percent) + '%'
                    : '-'}</span>
              {/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Total: </span>

              {#if isMouseInside}
                {#if metricPointDetail?.disk_total_gb}
                  <span class="text-xs text-white"
                    >{formatNumber(metricPointDetail?.disk_total_gb)}
                    <sub class="text-white/40">Gb</sub></span>
                {:else}
                  <span class="text-xs text-[#F87171]">-</span>
                {/if}
              {:else if chart?.last_history?.disk_total_gb}
                <span class="text-xs text-white"
                  >{formatNumber(chart?.last_history?.disk_total_gb)}
                  <sub class="text-white/40">Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Used: </span>

              {#if isMouseInside}
                {#if metricPointDetail?.disk_used_gb}<span class="text-xs text-white"
                    >{formatNumber(metricPointDetail?.disk_used_gb)}
                    <sub class="text-white/40"> Gb</sub></span
                  >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if chart?.last_history?.disk_used_gb}
                <span class="text-xs text-white"
                  >{formatNumber(chart?.last_history?.disk_used_gb)}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
            <div
              class="w-full justify-between md:w-[99.5px] xl:w-full flex xl:justify-between items-start gap-1">
              <span class="text-white/40 text-xs">Available: </span>
              {#if isMouseInside}
                {#if metricPointDetail?.disk_total_gb && metricPointDetail?.disk_used_gb}
                  <span class="text-xs text-white"
                    >{formatNumber(
                      metricPointDetail?.disk_total_gb - metricPointDetail?.disk_used_gb,
                    )}
                    <sub class="text-white/40"> Gb</sub></span
                  >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
              {:else if chart?.last_history?.disk_total_gb && chart?.last_history?.disk_used_gb}
                <span class="text-xs text-white"
                  >{formatNumber(
                    chart?.last_history?.disk_total_gb - chart?.last_history?.disk_used_gb,
                  )}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">-</span>{/if}
            </div>
          </div>
        </div>

        {#if isMouseInside}
          <div
            class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
            <div
              style="width:{metricPointDetail?.disk_usage_percent}%;"
              class="h-full rounded-s-md transition-all {metricPointDetail?.disk_usage_percent ===
              100
                ? 'rounded-e-md'
                : ''} {metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                ? 'bg-[#EF4444]'
                : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.disk_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {metricPointDetail?.disk_usage_percent
                ? formatNumber(metricPointDetail?.disk_usage_percent) + '%'
                : '-'}
            </div>
          </div>
        {:else}
          <div
            class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
            <div
              style="width:{chart?.last_history?.disk_usage_percent}%;"
              class="h-full rounded-s-md transition-all {chart?.last_history?.disk_usage_percent ===
              100
                ? 'rounded-e-md'
                : ''} {chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                ? 'bg-[#EF4444]'
                : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                  ? 'bg-[#F97316]'
                  : 'bg-green-700'}">
            </div>

            <div
              class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                ?.last_history?.disk_usage_percent
                ? 'text-white'
                : 'text-[#F87171]'}">
              {chart?.last_history?.disk_usage_percent
                ? formatNumber(chart?.last_history?.disk_usage_percent) + '%'
                : '-'}
            </div>
          </div>
        {/if}
      </div>{/if}
  </div>
</div>
