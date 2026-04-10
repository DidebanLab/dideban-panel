<script>
  import { onDestroy, onMount } from 'svelte';
  import PerformanceOverview from '../components/pages/dashboard/PerformanceOverview.svelte';
  import AgentsStatusOverview from '../components/pages/dashboard/statusOverview/AgentsStatusOverview/index.svelte';
  import ChecksStatusOverview from '../components/pages/dashboard/statusOverview/ChecksStatusOverview/index.svelte';
  import TopRight from '../components/pages/dashboard/TopRight.svelte';
  import { subscribe, unsubscribe } from '../services/ws.svelte';

  let isAgentExist = true;

  onMount(() => {
    subscribe('checks');
    subscribe('agents');
  });

  onDestroy(() => {
    unsubscribe('checks');
    unsubscribe('agents');
  });
</script>

<section class="w-full m-auto h-auto flex flex-col gap-7.75 sm:p-7.75 sm:pt-2.5">
  <div class="w-full flex flex-col-reverse gap-8 xl:gap-4 {isAgentExist ? '3xl:flex-row' : ''}">
    <PerformanceOverview bind:value={isAgentExist} />

    <TopRight {isAgentExist} />
  </div>
  <ChecksStatusOverview />

  <AgentsStatusOverview />
</section>
