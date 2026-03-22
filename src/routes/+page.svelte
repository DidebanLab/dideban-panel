<script>
  import { onDestroy, onMount } from 'svelte';
  import PerformanceOverview from '../components/pages/dashboard/PerformanceOverview.svelte';
  import AgentsStatusOverview from '../components/pages/dashboard/statusOverview/AgentsStatusOverview/index.svelte';
  import ChecksStatusOverview from '../components/pages/dashboard/statusOverview/ChecksStatusOverview/index.svelte';
  import TopRight from '../components/pages/dashboard/TopRight.svelte';
  import { subscribe, unsubscribe } from '../services/ws.svelte';

  onMount(() => {
    subscribe('checks');
    subscribe('agents');
  });

  onDestroy(() => {
    unsubscribe('checks');
    unsubscribe('agents');
  });
</script>

<section class="w-full m-auto h-auto flex flex-col">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 sm:p-7.75 sm:pt-2.5">
    <div class="w-full flex flex-col-reverse 3xl:flex-row gap-8 xl:gap-4">
      <div class="w-full 3xl:w-[65%]">
        <!-- <PerformanceOverview /> -->
      </div>

      <!-- <TopRight /> -->
    </div>
    <ChecksStatusOverview />

    <AgentsStatusOverview />
  </div>
</section>
