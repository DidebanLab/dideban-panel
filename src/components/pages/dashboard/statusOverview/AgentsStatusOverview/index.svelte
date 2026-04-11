<script>
  import HistoryLoading from './../HistoryLoading.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { opener } from '../../../../../stores/modal.svelte.js';
  import { LIMITATIONS } from '../../../../config.svelte.js';
  import AddAgent from '../AddAgent.svelte';
  import { http } from '../../../../../services/http.svelte.js';
  import { endpoints } from '../../../../../endpoints.svelte.js';
  import { off, on } from '../../../../../services/ws.svelte.js';
  import History from './deps/History.svelte';

  let trigger = $state();
  let isMobile = $state(innerWidth < 640);
  let agents = $state(null);
  let loading = $state(true);
  const REQUIRED_HISTORY_COUNT = $state(innerWidth < 640 ? 31 : 40);

  $effect(() => {
    if (trigger) {
      http.get(endpoints.agents).then(res => (agents = res.data.data));
    }
  });

  onMount(async () => {
    loading = true;
    await http
      .get(endpoints.agents)
      .then(res => (agents = res.data.data))
      .finally(() => {
        loading = false;
      });

    on('agent.created', handleCreated);
    on('agent.updated', handleUpdated);
    on('agent.status.changed', handleStatusChanged);
    on('agent.deleted', handleDeleted);
  });

  onDestroy(() => {
    off('agent.created', handleCreated);
    off('agent.updated', handleUpdated);
    off('agent.status.changed', handleStatusChanged);
    off('agent.deleted', handleDeleted);
  });

  function handleCreated(data) {
    http.get(endpoints.singleAgent(data?.id)).then(res => (agents = [res.data.data, ...agents]));
  }

  function handleUpdated(data) {
    const initailAgents = agents.filter(item => item.id !== data?.id);
    http
      .get(endpoints.singleAgent(data?.id))
      .then(res => (agents = [res.data.data, ...initailAgents]));
  }

  function handleStatusChanged(data) {
    agents = agents.map(c => (c.id === data.id ? { ...c, status: data.status } : c));
  }

  function handleDeleted(data) {
    agents = agents.filter(c => c.id !== data.id);
  }
</script>

<div
  class="w-full relative rounded-[14px] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div
    class="px-6 sm:py-6 sm:border-b border-[#0D0D0D]/5 dark:border-[#222222] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] w-full flex justify-between items-start rounded-t-[14px]">
    <div class="flex flex-col gap-1">
      <span class="text-lg sm:text-xl dark:text-white">Agents status</span>
      <span class="text-sm text-[#99a1af] capitalize">Infrastructure Nodes & Cluster Health</span>
    </div>
    <button
      type="button"
      onclick={() => {
        opener({
          id: 'create-agents',
          content: AddAgent,
          props: {
            onAdded: () => {
              trigger += 1;
            },
          },
        });
      }}
      class="w-10 sm:w-34.25 h-10 flex justify-center gap-2 px-4 items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
      <span class="text-nowrap text-sm hidden sm:flex justify-center items-center">Add Agent</span>
      +
    </button>
  </div>

  <div
    class="w-full grid gap-4 custom-scroll p-6 min-h-41 sm:min-h-44.75 {!loading && !agents
      ? 'grid-cols-1'
      : ' grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3'}">
    {#if loading}
      {#each Array(3) as _, i}
        <HistoryLoading requiredHistoryCount={REQUIRED_HISTORY_COUNT} />
      {/each}
    {:else if agents}
      {#each agents as item (item.id)}
        <History
          agentId={item?.id}
          last_status={item?.status}
          name={item?.name}
          checked_at={item?.last_seen} />
      {/each}
    {:else}
      <div
        class="w-full h-full relative flex justify-center items-center overflow-hidden dark:bg-[#0D0D0D] bg-[#FFFFFF] border rounded-[14px] text-red-500/50 animate-pulse border-[#F87171]/15 text-xl">
        <div
          class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
          style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
          <div class="w-full h-full bg-white/5"></div>
        </div>

        <div class="flex justify-center items-center gap-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
              stroke="#B4242B"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M10 6.6665V9.99984"
              stroke="#B4242B"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M10 13.3335H10.0083"
              stroke="#B4242B"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <span class="text-xl text-red-500/70 mt-0.5">Something Is Wrong</span>
        </div>
      </div>
    {/if}
  </div>
</div>
