<script>
  import StatusOverview2 from './../../components/common/StatusOverview2.svelte';
  import PerformanceOverview from '../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../components/pages/dashboard/TopRight.svelte';
  import { theme } from '../../stores/theme.svelte';
  import { MACHINE } from './machine/[machine]/constant.svelte';
</script>

<section
  class="w-full max-w-422.75 m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-3">
    <div class="w-full flex flex-col-reverse min-[1920px]:flex-row gap-4">
      <PerformanceOverview {theme} />
      <TopRight />
    </div>

    <StatusOverview
      type="agents"
      subtitle="Infrastructure Nodes & Cluster Health"
      data={AGENTS_DATA} />
    <StatusOverview
      type="checkers"
      subtitle="Microservices Health & Availability"
      data={AGENTS_DATA} />
  </div>
</section>
