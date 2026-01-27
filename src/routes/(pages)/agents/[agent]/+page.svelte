<script>
  import { MACHINES } from './../../../constant.svelte.js';
  import { page } from '$app/stores';
  import Chart from '../../../../components/common/Chart.svelte';
  import Latency from '../../../../components/common/Latency.svelte';
  import StrokedGaugeChart from '../../../../components/common/StrokedGaugeChart.svelte';
  import UptimeChart from '../../../../components/common/UptimeChart.svelte';
  import UptimeHistoryAll from '../../../../components/common/UptimeHistoryAll.svelte';
  import { LIMITATIONS } from '../../../../components/config.svelte';
  import PerformanceOverview from '../../../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../../../components/pages/dashboard/TopRight.svelte';
  import { theme } from '../../../../stores/theme.svelte';
  import { onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte.js';
  import { endpoints } from '../../../../endpoints.svelte.js';
  const name = $page.params.agent;

  const isMobile = $state(innerWidth < 640);
  let data = $state(MACHINES[0]);

  // onMount(() => {
  //   http.get(endpoints.agents + name).then(res => {
  //     data = res.data;
  //   });
  // });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-2.5">
    <div class="w-full flex flex-col gap-6">
      <div class="w-full flex flex-col gap-4 relative">
        <div class="w-full h-full flex flex-col">
          <div class="w-full h-auto flex flex-col xl:flex-row justify-start gap-4 items-start">
            <div
              class="relative w-full flex flex-col justify-center items-start border rounded-[14px] p-4 gap-0.5 {data
                .cpu[data.cpu.length - 1].usage_percent < 65
                ? 'dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5'
                : data.cpu[data.cpu.length - 1].usage_percent < 85
                  ? 'border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-lg sm:text-xl dark:text-white">CPU</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-lg sm:text-xl {data.cpu[data.cpu.length - 1].usage_percent
                      ? data.cpu[data.cpu.length - 1].usage_percent < 65
                        ? 'text-[#22c55e]'
                        : data.cpu[data.cpu.length - 1].usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {data.cpu[data.cpu.length - 1].usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>

              <div
                class="w-full grid grid-cols-2 sm:flex xl:grid xl:grid-cols-4 sm:place-items-center mb-6">
                <div class="sm:me-auto flex justify-start items-center max-sm:scale-110">
                  <StrokedGaugeChart
                    value={data.cpu[data.cpu.length - 1].usage_percent}
                    title="Usage Percent" />
                </div>
                <div class="flex justify-end items-center max-sm:scale-110">
                  <StrokedGaugeChart
                    value={data.cpu[data.cpu.length - 1].load_1}
                    title="Load Avg (5m)" />
                </div>
                <div class="flex justify-start items-center max-sm:scale-110">
                  <StrokedGaugeChart
                    value={data.cpu[data.cpu.length - 1].load_5}
                    title="Load Avg (5m)" />
                </div>

                <div class="flex justify-end items-center max-sm:scale-110">
                  <StrokedGaugeChart
                    value={data.cpu[data.cpu.length - 1].load_15}
                    title="Load Avg (15m)" />
                </div>
              </div>
              <div
                class="absolute z-10 bottom-4 start-0 w-full flex justify-between items-end px-4 gap-0.5">
                {#each data.cpu.slice(isMobile ? -31 : -53) as detail}
                  {@const hasAgentMetrics = detail.usage_percent}
                  {@const agentError = detail.usage_percent > LIMITATIONS.cpu.error}
                  {@const agentWarn = detail.usage_percent > LIMITATIONS.cpu.warn}

                  <div
                    class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #ad46ff;"
                              class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-xs text-nowrap text-[#6a7282]"
                                >Cpu :</span>
                              <span
                                class="flex justify-center items-center text-xs text-nowrap {detail.usage_percent >
                                LIMITATIONS.cpu.error
                                  ? 'text-[#F87171]'
                                  : detail.usage_percent > LIMITATIONS.cpu.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.usage_percent >
                              LIMITATIONS.cpu.error
                                ? 'bg-[#F87171]'
                                : detail.usage_percent > LIMITATIONS.cpu.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.usage_percent >
                              LIMITATIONS.cpu.error
                                ? '#F87171'
                                : detail.usage_percent > LIMITATIONS.cpu.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-nowrap text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.timestamp_ms).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="relative w-full flex flex-col justify-center items-start border rounded-[14px] p-4 gap-px {data
                .memory[data.memory.length - 1].usage_percent < 65
                ? 'dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5'
                : data.memory[data.memory.length - 1].usage_percent < 85
                  ? 'border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-lg sm:text-xl dark:text-white">Memory</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-lg sm:text-xl {data.memory[data.memory.length - 1].usage_percent
                      ? data.memory[data.memory.length - 1].usage_percent < 65
                        ? 'text-[#22c55e]'
                        : data.memory[data.memory.length - 1].usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {data.memory[data.memory.length - 1].usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>
              <div class="w-full h-auto flex justify-between items-center">
                <div class="flex flex-col sm:flex-row justify-between items-center mb-6 w-full">
                  <div class="flex justify-start items-center max-sm:scale-110  max-sm:pt-5">
                    <StrokedGaugeChart
                      value={data.memory[data.memory.length - 1].usage_percent}
                      title="Usage Percent" />
                  </div>

                  <div class="flex justify-between sm:justify-center items-center gap-4 max-sm:w-full max-sm:px-[1.5px] 2xl:mt-1 mb-0.5 2xl:mb-0 3xl:mb-0.5">
                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-19 sm:size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(data.memory[data.memory.length - 1].total_mb).toLocaleString()}
                        </span>
                      </div>

                      <span class="text-[11px] text-[#99A1AF]">Total (mb)</span>
                    </div>

                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-19 sm:size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(data.memory[data.memory.length - 1].used_mb).toLocaleString()}
                        </span>
                        <div
                          style="height: {(72 * data.memory[data.memory.length - 1].usage_percent) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Used (mb)</span>
                    </div>
                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-19 sm:size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            data.memory[data.memory.length - 1].total_mb -
                              data.memory[data.memory.length - 1].used_mb,
                          ).toLocaleString()}
                        </span>
                        <div
                          style="height: {((100 -
                            data.memory[data.memory.length - 1].usage_percent) *
                            72) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Available (mb)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="absolute z-10 bottom-4 start-0 w-full flex justify-between items-end px-4 gap-0.5 ">
                {#each data.memory.slice(isMobile ? -31 : -53) as detail}
                  {@const hasAgentMetrics = detail.usage_percent}
                  {@const agentError = detail.usage_percent > LIMITATIONS.memory.error}
                  {@const agentWarn = detail.usage_percent > LIMITATIONS.memory.warn}

                  <div
                    class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #2b7fff;"
                              class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-xs text-nowrap text-[#6a7282]"
                                >Memory :</span>
                              <span
                                class="flex justify-center items-center text-xs text-nowrap {detail.usage_percent >
                                LIMITATIONS.memory.error
                                  ? 'text-[#F87171]'
                                  : detail.usage_percent > LIMITATIONS.memory.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.usage_percent >
                              LIMITATIONS.memory.error
                                ? 'bg-[#F87171]'
                                : detail.usage_percent > LIMITATIONS.memory.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.usage_percent >
                              LIMITATIONS.memory.error
                                ? '#F87171'
                                : detail.usage_percent > LIMITATIONS.memory.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.timestamp_ms).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="relative w-full flex flex-col justify-center items-start border rounded-[14px] p-4 gap-px {data
                .disk[data.disk.length - 1].usage_percent < 65
                ? 'dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5'
                : data.disk[data.disk.length - 1].usage_percent < 85
                  ? 'border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-lg sm:text-xl dark:text-white">Disk</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-lg sm:text-xl {data.disk[data.disk.length - 1].usage_percent
                      ? data.disk[data.disk.length - 1].usage_percent < 65
                        ? 'text-[#22c55e]'
                        : data.disk[data.disk.length - 1].usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {data.disk[data.disk.length - 1].usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>
              <div class="w-full h-auto flex justify-between items-center">
                <div class="flex justify-between items-center mb-6 w-full">
                  <div class="flex justify-start items-center max-sm:scale-110">
                    <StrokedGaugeChart
                      value={data.disk[data.disk.length - 1].usage_percent}
                      title="Usage Percent" />
                  </div>

                  <div class="flex justify-center items-center gap-4 2xl:mt-1 mb-0.5 2xl:mb-0 3xl:mb-0.5">
                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(data.disk[data.disk.length - 1].total_gb).toLocaleString()}
                        </span>
                      </div>

                      <span class="text-[11px] text-[#99A1AF]">Total (gb)</span>
                    </div>

                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {data.disk[data.disk.length - 1].used_gb}
                        </span>
                        <div
                          style="height: {(72 * data.disk[data.disk.length - 1].usage_percent) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Used (mb)</span>
                    </div>
                    <div class="flex flex-col justify-end items-center gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            data.disk[data.disk.length - 1].total_gb -
                              data.disk[data.disk.length - 1].used_gb,
                          ).toLocaleString()}
                        </span>
                        <div
                          style="height: {((100 - data.disk[data.disk.length - 1].usage_percent) *
                            72) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Available (mb)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="absolute z-10 bottom-4 start-0 w-full flex justify-between items-end px-4 gap-0.5">
                {#each data.disk.slice(isMobile ? -31 : -53) as detail}
                  {@const hasAgentMetrics = detail.usage_percent}
                  {@const agentError = detail.usage_percent > LIMITATIONS.disk.error}
                  {@const agentWarn = detail.usage_percent > LIMITATIONS.disk.warn}

                  <div
                    class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #22c55e;"
                              class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-xs text-nowrap text-[#6a7282]"
                                >Disk :</span>
                              <span
                                class="flex justify-center items-center text-xs text-nowrap {detail.usage_percent >
                                LIMITATIONS.disk.error
                                  ? 'text-[#F87171]'
                                  : detail.usage_percent > LIMITATIONS.disk.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.usage_percent >
                              LIMITATIONS.disk.error
                                ? 'bg-[#F87171]'
                                : detail.usage_percent > LIMITATIONS.disk.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.usage_percent >
                              LIMITATIONS.disk.error
                                ? '#F87171'
                                : detail.usage_percent > LIMITATIONS.disk.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-nowrap text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.timestamp_ms).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full h-auto p-6 pb-1.5 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex flex-col gap-4 items-start justify-between w-full">
          <div class="w-full flex justify-between items-baseline">
            <div class="w-full flex flex-col sm:justify-start sm:items-start">
              <span class="text-lg sm:text-xl dark:text-white"
                >{data.agent_id} Performance Overview</span>
              <span class="text-sm text-[#99a1af]">System resource latest utilization trends</span>
            </div>
          </div>

          <div class="w-full flex justify-start items-center gap-3">
            <div
              class="h-full w-fit flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #ad46ff;"
                  class="size-2.5 rounded-full bg-[#ad46ff]"></span>
                <span class="flex justify-center items-center text-sm text-[#6a7282] text-nowrap"
                  >Average CPU Usage :</span>
              </div>

              <span class="dark:text-white text-lg"
                >{data.cpu[data.cpu.length - 1].usage_percent}%</span>
            </div>
            <div
              class="h-full w-fit flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #2b7fff;"
                  class="size-2.5 rounded-full bg-[#2b7fff]"></span>
                <span class="flex justify-center items-center text-sm text-[#6a7282] text-nowrap"
                  >Average Memory Usage :</span>
              </div>

              <span class="dark:text-white text-lg"
                >{data.memory[data.memory.length - 1].usage_percent}%</span>
            </div>
            <div
              class="h-full w-fit flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #22c55e;"
                  class="size-2.5 rounded-full bg-[#00bc7d]"></span>
                <span class="flex justify-center items-center text-sm text-[#6a7282] text-nowrap"
                  >Average Disk Usage :</span>
              </div>

              <span class="dark:text-white text-lg"
                >{data.disk[data.disk.length - 1].usage_percent}%</span>
            </div>
          </div>

          <Chart
            data={[
              {
                name: 'CPU',
                data: data.cpu.map(d => d.usage_percent ?? 0),
              },
              {
                name: 'Memory',
                data: data.memory.map(d => d.usage_percent ?? 0),
              },
              {
                name: 'Disk',
                data: data.disk.map(d => d.usage_percent ?? 0),
              },
            ]} />
        </div>
      </div>

      <Latency {name} />
      <UptimeHistoryAll />
    </div>
  </div>
</section>
