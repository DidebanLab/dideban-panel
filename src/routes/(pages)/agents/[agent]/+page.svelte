<script>
  import StrokedGaugeChart from '../../../../components/common/StrokedGaugeChart.svelte';
  import PerformanceOverview from '../../../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../../../components/pages/dashboard/TopRight.svelte';
</script>

<section class="w-full max-w-422.75 m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-3">
    <div class="w-full flex gap-4">
      <PerformanceOverview />
      <div class="w-full flex flex-col gap-4 min-[1920px]:w-[35%]">
        <div
          class="p-6 pt-5 w-full h-1/2 flex flex-col bg-white dark:bg-transparent border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden">
          <div class="flex items-center gap-3 w-full">
            <span class="text-xl dark:text-white">Agent detail</span>
          </div>

          <div class="w-full h-auto flex items-start justify-between">
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
        </div>
        <div
          class="p-6 pt-5 w-full flex h-1/2 flex-col gap-4 bg-white dark:bg-transparent border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden">
          <div class="flex items-center gap-3 w-full">
            <span class="text-xl dark:text-white">Agent Detail</span>
          </div>
        </div>
      </div>
    </div>

    <StatusOverview type="agents" subtitle="Infrastructure Nodes & Cluster Health" />
    <StatusOverview type="checkers" subtitle="Microservices Health & Availability" />
  </div>
</section>
