<script>
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import responseTimeColor from '../../../utils/responseTimeColor';
  import { LIMITATIONS } from '../../config.svelte';
  import Chart from './Chart.svelte';

  const { id, date, summaryWithDate, hours } = $props();

  let pointIndexHoverd = $state(null);
  let metricPointDetail = $state(null);
  let isMouseInside = $state(false);
  let chart = $state(null);

  $effect(() => {
    if (!date) {
      let resChart;
      http
        .get(endpoints.agentChart(id), {
          params: {
            hours,
            max_points: 60,
          },
        })
        .then(res => {
          chart = res.data?.data;
          resChart = res.data?.data;
        });

      if (pointIndexHoverd && resChart) {
        http
          .get(
            endpoints.agentHistoryDetail(
              id,
              [...resChart?.points?.map(item => item?.[0]).reverse()][pointIndexHoverd],
            ),
          )
          .then(res => (metricPointDetail = res.data?.data));
      }
    }
  });
</script>

<div class="grid grid-cols-12 gap-6 w-full">
  <div
    class="w-full col-span-9 border flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="w-full flex justify-between items-start">
      <div class="w-full flex gap-1 flex-col justify-start items-start">
        <span class="text-lg md:text-xl text-black dark:text-white">Metrics</span>

        <div class="flex justify-end items-center gap-2 text-xs text-white/40">
          {#if date}
            {#if isMouseInside && summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at}
              <span class="flex justify-center items-center text-nowrap">Collect at :</span>

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
            <span class="flex justify-center items-center text-nowrap">Collect at :</span>

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

      <div class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
        <span class="text-white/40 me-1">Collect Duration : </span>

        {#if date}
          {#if isMouseInside}
            <span
              class={responseTimeColor(
                summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms,
              )}
              >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms
                ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms + ' ms'
                : '-'}</span>
          {:else}
            <span class={responseTimeColor(summaryWithDate?.overall?.avg_collect_duration_ms)}
              >{summaryWithDate?.overall?.avg_collect_duration_ms
                ? summaryWithDate?.overall?.avg_collect_duration_ms + ' ms'
                : '-'}
            </span>
          {/if}
        {:else if isMouseInside}
          <span class={responseTimeColor(metricPointDetail?.collect_duration_ms)}
            >{metricPointDetail?.collect_duration_ms
              ? metricPointDetail?.collect_duration_ms + ' ms'
              : '-'}</span>
        {:else}
          <span class={responseTimeColor(chart?.last_history?.collect_duration_ms)}
            >{chart?.last_history?.collect_duration_ms
              ? chart?.last_history?.collect_duration_ms + ' ms'
              : '-'}</span>
        {/if}
      </div>
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
    class="col-span-3 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl grid grid-cols-1 gap-4 dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">CPU</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Usage: </span>
            {#if isMouseInside}
              <span
                class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                    LIMITATIONS.cpu.error
                    ? 'text-[#F87171]'
                    : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                        LIMITATIONS.cpu.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'
                  : 'text-[#F87171]'}"
                >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (1m): </span>

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
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 + '%'
                  : 'Unknown'}</span>
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
                >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]?.cpu_load_1
                  ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_load_1 + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (5m): </span>

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
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 + '%'
                  : 'Unknown'}</span>
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
                >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]?.cpu_load_5
                  ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_load_5 + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (15m) : </span>

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
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 + '%'
                  : 'Unknown'}</span>
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
                  ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_load_15 + '%'
                  : 'Unknown'}</span>
            {/if}
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
                ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                : 'Unknown'}
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
                ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                    ?.cpu_usage_percent + '%'
                : 'Unknown'}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">CPU</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
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
                  ? metricPointDetail?.cpu_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.cpu_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (1m): </span>

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
                  ? metricPointDetail?.cpu_load_1 + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.cpu_load_1 + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (5m): </span>

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
                  ? metricPointDetail?.cpu_load_5 + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.cpu_load_5 + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Av (15m) : </span>

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
                  ? metricPointDetail?.cpu_load_15 + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.cpu_load_15 + '%'
                  : 'Unknown'}</span>
            {/if}
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
                ? metricPointDetail?.cpu_usage_percent + '%'
                : 'Unknown'}
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
                ? chart?.last_history?.cpu_usage_percent + '%'
                : 'Unknown'}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <div class="w-full h-0.5 bg-[#0D0D0D]/5 dark:bg-white/5 rounded-full"></div>

    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">Memory</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
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
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Total: </span>

            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}

                  <sub class="text-white/40">Mb</sub>
                </span>{:else}
                <span class="text-xs text-[#F87171]">Unknown</span>
              {/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_total_mb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                  ?.memory_total_mb}

                <sub class="text-white/40">Mb</sub>
              </span>{:else}
              <span class="text-xs text-[#F87171]">Unknown</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Used: </span>

            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}
                <span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_used_mb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                  ?.memory_used_mb}
                <sub class="text-white/40">Mb</sub>
              </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Available: </span>

            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_available_mb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                  ?.memory_available_mb}
                <sub class="text-white/40">Mb</sub>
              </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
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
                ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent + '%'
                : 'Unknown'}
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
                ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                    ?.memory_usage_percent + '%'
                : 'Unknown'}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">Memory</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
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
                  ? metricPointDetail?.memory_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.memory_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Total: </span>

            {#if isMouseInside}
              {#if metricPointDetail?.memory_total_mb}
                <span class="text-xs text-white"
                  >{metricPointDetail?.memory_total_mb}

                  <sub class="text-white/40">Mb</sub>
                </span>
              {:else}
                <span class="text-xs text-[#F87171]">Unknown</span>
              {/if}
            {:else if chart?.last_history?.memory_total_mb}
              <span class="text-xs text-white"
                >{chart?.last_history?.memory_total_mb}

                <sub class="text-white/40">Mb</sub>
              </span>{:else}
              <span class="text-xs text-[#F87171]">Unknown</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Used: </span>

            {#if isMouseInside}
              {#if metricPointDetail?.memory_used_mb}
                <span class="text-xs text-white"
                  >{metricPointDetail?.memory_used_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if chart?.last_history?.memory_used_mb}
              <span class="text-xs text-white"
                >{chart?.last_history?.memory_used_mb}
                <sub class="text-white/40">Mb</sub>
              </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Available: </span>

            {#if isMouseInside}
              {#if metricPointDetail?.memory_available_mb}
                <span class="text-xs text-white"
                  >{metricPointDetail?.memory_available_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if chart?.last_history?.memory_available_mb}
              <span class="text-xs text-white"
                >{chart?.last_history?.memory_available_mb}
                <sub class="text-white/40">Mb</sub>
              </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
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
                ? metricPointDetail?.memory_usage_percent + '%'
                : 'Unknown'}
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
                ? chart?.last_history?.memory_usage_percent + '%'
                : 'Unknown'}
            </div>
          {/if}
        </div>
      </div>{/if}

    <div class="h-px w-full bg-white/10"></div>

    {#if date}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">Disk</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
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
                  ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Total: </span>

            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                  <sub class="text-white/40">Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                  ?.disk_total_gb}
                <sub class="text-white/40">Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Used: </span>

            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                  ?.disk_used_gb}
                <sub class="text-white/40"> Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Available: </span>
            {#if isMouseInside}
              {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb && summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                <span class="text-xs text-white"
                  >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb -
                    summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb && summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
              <span class="text-xs text-white"
                >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                  ?.disk_total_gb -
                  summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                    ?.disk_used_gb}
                <sub class="text-white/40"> Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
        </div>
        {#if isMouseInside}
          <div
            class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
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
                ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent + '%'
                : 'Unknown'}
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
                ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                    ?.disk_usage_percent + '%'
                : 'Unknown'}
            </div>
          </div>{/if}
      </div>
    {:else}
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="flex justify-start items-start gap-2">
          <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
          <span class="text-lg text-black dark:text-white">Disk</span>
        </div>

        <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
          <div class="w-full flex justify-between items-start gap-1">
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
                  ? metricPointDetail?.disk_usage_percent + '%'
                  : 'Unknown'}</span>
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
                  ? chart?.last_history?.disk_usage_percent + '%'
                  : 'Unknown'}</span>
            {/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Total: </span>

            {#if isMouseInside}
              {#if metricPointDetail?.disk_total_gb}
                <span class="text-xs text-white"
                  >{metricPointDetail?.disk_total_gb}
                  <sub class="text-white/40">Gb</sub></span>
              {:else}
                <span class="text-xs text-[#F87171]">Unknown</span>
              {/if}
            {:else if chart?.last_history?.disk_total_gb}
              <span class="text-xs text-white"
                >{chart?.last_history?.disk_total_gb}
                <sub class="text-white/40">Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Used: </span>

            {#if isMouseInside}
              {#if metricPointDetail?.disk_used_gb}<span class="text-xs text-white"
                  >{metricPointDetail?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if chart?.last_history?.disk_used_gb}
              <span class="text-xs text-white"
                >{chart?.last_history?.disk_used_gb}
                <sub class="text-white/40"> Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
          <div class="w-full flex justify-between items-start gap-1">
            <span class="text-white/40 text-xs">Available: </span>
            {#if isMouseInside}
              {#if metricPointDetail?.disk_total_gb && metricPointDetail?.disk_used_gb}
                <span class="text-xs text-white"
                  >{metricPointDetail?.disk_total_gb - metricPointDetail?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span
                >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
            {:else if chart?.last_history?.disk_total_gb && chart?.last_history?.disk_used_gb}
              <span class="text-xs text-white"
                >{chart?.last_history?.disk_total_gb - chart?.last_history?.disk_used_gb}
                <sub class="text-white/40"> Gb</sub></span
              >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
          </div>
        </div>
        {#if isMouseInside}
          <div
            class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
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
                ? metricPointDetail?.disk_usage_percent + '%'
                : 'Unknown'}
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
                ? chart?.last_history?.disk_usage_percent + '%'
                : 'Unknown'}
            </div>
          </div>{/if}
      </div>{/if}
  </div>
</div>
