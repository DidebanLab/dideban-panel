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

<section class="w-full m-auto h-auto flex flex-col">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 sm:p-7.75 sm:pt-2.5">
    <div class="w-full flex flex-col-reverse 3xl:flex-row gap-8 xl:gap-4">
      <div class="w-full 3xl:w-[65%]">
        <PerformanceOverview />
      </div>

      <TopRight />
    </div>
    <StatusOverview type="checkers" subtitle="Microservices Health & Availability" />

    <StatusOverview type="agents" subtitle="Infrastructure Nodes & Cluster Health" />
  </div>
</section>
