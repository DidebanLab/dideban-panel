<script>
  import StatusOverview2 from '../components/common/StatusOverview2.svelte';
  import PerformanceOverview from '../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../components/pages/dashboard/TopRight.svelte';

  const steps = ['Beta', 'Main', 'Development'];
  let activeIndex = $state(1);
  const isActive = $derived(steps[activeIndex]);

  const next = () => {
    if (activeIndex < steps.length - 1) {
      activeIndex++;
    } else {
      activeIndex = 0;
    }
  };

  const prev = () => {
    if (activeIndex > 0) {
      activeIndex--;
    } else {
      activeIndex = steps.length - 1;
    }
  };

  // let data = $state({});
  // $effect(() => {
  //   http.post(endpoints.performanceOverview, { agent_id: isActive }).then(res => (data = res.data));
  // });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-[1.7vw] p-[1.7vw] pt-[0.7vw]">
    <div class="w-full flex flex-col-reverse min-[1920px]:flex-row gap-4">
      <div class="w-full min-[1920px]:w-[65%]">
        <PerformanceOverview />
      </div>

      <TopRight />
    </div>

    <StatusOverview type="agents" subtitle="Infrastructure Nodes & Cluster Health" />
    <StatusOverview type="checkers" subtitle="Microservices Health & Availability" />
  </div>
</section>
