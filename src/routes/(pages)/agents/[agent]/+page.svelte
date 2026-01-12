<script>
  import StrokedGaugeChart from '../../../../components/common/StrokedGaugeChart.svelte';
  import UptimeChart from '../../../../components/common/UptimeChart.svelte';
  import { LIMITATIONS } from '../../../../components/config.svelte';
  import PerformanceOverview from '../../../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../../../components/pages/dashboard/TopRight.svelte';
</script>

<section class="w-full max-w-422.75 m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-3">
    <div class="w-full flex flex-col gap-6">
      <PerformanceOverview />
      <div class="w-full flex flex-col gap-4">
        <div class="w-full h-full flex flex-col relative">
          <div class="w-full h-auto flex justify-start gap-4 items-start">
            <div
              class="relative w-1/3 flex flex-col justify-center items-start border rounded-[14px] p-6 {AGENTS_DATA[0]
                .detail[AGENTS_DATA[0].detail.length - 1].cpu.usage_percent < 65
                ? 'border-[#0D0D0D]/5 dark:border-[#00bc7d]/10 bg-[#F9FAFB] dark:bg-[#121212]'
                : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.usage_percent < 85
                  ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-xl dark:text-white">CPU</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-xl {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu
                      .usage_percent
                      ? AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.usage_percent <
                        65
                        ? 'text-[#22c55e]'
                        : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu
                              .usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>

              <div class="w-full flex justify-center items-start mb-3">
                <StrokedGaugeChart
                  value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.usage_percent}
                  title="Usage Percent" />
                <StrokedGaugeChart
                  value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.load_1}
                  title="Load Avg (5m)" />

                <StrokedGaugeChart
                  value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.load_5}
                  title="Load Avg (5m)" />
                <StrokedGaugeChart
                  value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].cpu.load_15}
                  title="Load Avg (15m)" />
              </div>
              <div
                class="absolute z-10 bottom-5 start-0 w-full flex justify-between items-end px-6">
                {#each AGENTS_DATA[0].detail.slice(-53) as detail}
                  {@const hasAgentMetrics = detail.cpu?.usage_percent}
                  {@const agentError = detail.cpu.usage_percent > LIMITATIONS.cpu.error}
                  {@const agentWarn = detail.cpu.usage_percent > LIMITATIONS.cpu.warn}

                  <div
                    class="w-1.25 h-1.25 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.cpu.usage_percent}
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
                                class="flex justify-center items-center text-xs text-nowrap {detail
                                  .cpu.usage_percent > LIMITATIONS.cpu.error
                                  ? 'text-[#F87171]'
                                  : detail.cpu.usage_percent > LIMITATIONS.cpu.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.cpu.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.cpu.usage_percent >
                              LIMITATIONS.cpu.error
                                ? 'bg-[#F87171]'
                                : detail.cpu.usage_percent > LIMITATIONS.cpu.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.cpu.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.cpu.usage_percent >
                              LIMITATIONS.cpu.error
                                ? '#F87171'
                                : detail.cpu.usage_percent > LIMITATIONS.cpu.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-nowrap text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.cpu.timestamp_ms).toLocaleString('en-GB', {
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
              class="relative w-1/3 flex flex-col justify-center items-start border rounded-[14px] p-6 {AGENTS_DATA[0]
                .detail[AGENTS_DATA[0].detail.length - 1].memory.usage_percent < 65
                ? 'border-[#0D0D0D]/5 dark:border-[#00bc7d]/10 bg-[#F9FAFB] dark:bg-[#121212]'
                : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory.usage_percent < 85
                  ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-xl dark:text-white">Memory</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-xl {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                      .usage_percent
                      ? AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                          .usage_percent < 65
                        ? 'text-[#22c55e]'
                        : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                              .usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory.usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>
              <div class="w-full h-auto flex justify-between items-center">
                <div class="flex justify-between items-end mb-3 w-full">
                  <StrokedGaugeChart
                    value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                      .usage_percent}
                    title="Usage Percent" />
                  <div class="flex justify-center items-center gap-5 pe-6">
                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory.total_mb,
                          ).toLocaleString()}
                        </span>
                      </div>

                      <span class="text-[11px] text-[#99A1AF]">Total (mb)</span>
                    </div>

                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory.used_mb,
                          ).toLocaleString()}
                        </span>
                        <div
                          style="height: {(72 *
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                              .usage_percent) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Used (mb)</span>
                    </div>
                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                              .total_mb -
                              AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                                .used_mb,
                          ).toLocaleString()}
                        </span>
                        <div
                          style="height: {((100 -
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].memory
                              .usage_percent) *
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
                class="absolute z-10 bottom-6 start-0 w-full flex justify-between items-end px-6">
                {#each AGENTS_DATA[0].detail.slice(-53) as detail}
                  {@const hasAgentMetrics = detail.memory?.usage_percent}
                  {@const agentError = detail.memory.usage_percent > LIMITATIONS.memory.error}
                  {@const agentWarn = detail.memory.usage_percent > LIMITATIONS.memory.warn}

                  <div
                    class="w-1.25 h-1.25 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.memory.usage_percent}
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
                                class="flex justify-center items-center text-xs text-nowrap {detail
                                  .memory.usage_percent > LIMITATIONS.memory.error
                                  ? 'text-[#F87171]'
                                  : detail.memory.usage_percent > LIMITATIONS.memory.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.memory.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.memory.usage_percent >
                              LIMITATIONS.memory.error
                                ? 'bg-[#F87171]'
                                : detail.memory.usage_percent > LIMITATIONS.memory.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.memory.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.memory.usage_percent >
                              LIMITATIONS.memory.error
                                ? '#F87171'
                                : detail.memory.usage_percent > LIMITATIONS.memory.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.memory.timestamp_ms).toLocaleString('en-GB', {
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
              class="relative w-1/3 flex flex-col justify-center items-start border rounded-[14px] p-6 {AGENTS_DATA[0]
                .detail[AGENTS_DATA[0].detail.length - 1].disk.usage_percent < 65
                ? 'border-[#0D0D0D]/5 dark:border-[#00bc7d]/10 bg-[#F9FAFB] dark:bg-[#121212]'
                : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.usage_percent < 85
                  ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F97316]/5'
                  : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
              <div class="flex justify-between items-center w-full">
                <span class="text-xl dark:text-white">Disk</span>
                <div class="ms-auto flex gap-2 justify-center items-start text-sm">
                  <span
                    class="text-xl {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk
                      .usage_percent
                      ? AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.usage_percent <
                        65
                        ? 'text-[#22c55e]'
                        : AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk
                              .usage_percent < 85
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'
                      : 'bg-black/20'}">
                    {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.usage_percent} %
                  </span>
                  <img class="size-6" width="40" height="40" src="/icons/chart.png" alt="chart" />
                </div>
              </div>
              <div class="w-full h-auto flex justify-between items-center">
                <div class="flex justify-between items-end mb-3 w-full">
                  <StrokedGaugeChart
                    value={AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk
                      .usage_percent}
                    title="Usage Percent" />
                  <div class="flex justify-center items-center gap-5 pe-6">
                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.total_gb,
                          ).toLocaleString()}
                        </span>
                      </div>

                      <span class="text-[11px] text-[#99A1AF]">Total (gb)</span>
                    </div>

                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.used_gb}
                        </span>
                        <div
                          style="height: {(72 *
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk
                              .usage_percent) /
                            100}px;"
                          class="absolute z-10 bottom-0 start-0 w-full bg-[#2B7FFF]/20 backdrop-blur-3xl">
                        </div>
                      </div>
                      <span class="text-[11px] text-[#99A1AF]">Used (mb)</span>
                    </div>
                    <div class="flex flex-col justify-end items-center mb-3 gap-3">
                      <div
                        class="relative overflow-hidden flex items-center justify-center gap-2.5 bg-[#2B7FFF]/20 backdrop-blur-3xl size-16.5 rounded-full py-1">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 text-[#2B7FFF] text-[11px]">
                          {Number(
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.total_gb -
                              AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk.used_gb,
                          ).toLocaleString()}
                        </span>
                        <div
                          style="height: {((100 -
                            AGENTS_DATA[0].detail[AGENTS_DATA[0].detail.length - 1].disk
                              .usage_percent) *
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
                class="absolute z-10 bottom-6 start-0 w-full flex justify-between items-end px-6">
                {#each AGENTS_DATA[0].detail.slice(-53) as detail}
                  {@const hasAgentMetrics = detail.disk?.usage_percent}

                  {@const agentError = detail.disk.usage_percent > LIMITATIONS.disk.error}

                  {@const agentWarn = detail.disk.usage_percent > LIMITATIONS.disk.warn}

                  <div
                    class="w-1.25 h-1.25 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {hasAgentMetrics
                      ? agentError
                        ? 'bg-[#EF4444]'
                        : agentWarn
                          ? 'bg-[#F97316]'
                          : 'bg-green-700'
                      : 'bg-[#FFFFFF]/5'}
                      ">
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-black/80 backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-2.5">
                      {#if detail.disk.usage_percent}
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
                                class="flex justify-center items-center text-xs text-nowrap {detail
                                  .disk.usage_percent > LIMITATIONS.disk.error
                                  ? 'text-[#F87171]'
                                  : detail.disk.usage_percent > LIMITATIONS.disk.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{detail.disk.usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-white/10">
                            <div
                              class="h-full rounded-full {detail.disk.usage_percent >
                              LIMITATIONS.disk.error
                                ? 'bg-[#F87171]'
                                : detail.disk.usage_percent > LIMITATIONS.disk.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                detail.disk.usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {detail.disk.usage_percent >
                              LIMITATIONS.disk.error
                                ? '#F87171'
                                : detail.disk.usage_percent > LIMITATIONS.disk.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-xs text-nowrap text-[#6a7282] text-center border-t-white/15 border-t pt-1.5">
                        {new Date(detail.disk.timestamp_ms).toLocaleString('en-GB', {
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
      <UptimeChart
        height={260}
        name="Uptime"
        data={[1000, 220, 333, 4000, 2000, 10, 1500, 1000, 4300, 2000, 1000, 2000, 1434]} />
    </div>
  </div>
</section>
