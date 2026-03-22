<script>
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


  $effect(() => {
    if (trigger) {
      http.get(endpoints.agents).then(res => (agents = res.data.data));
    }
  });

  onMount(async () => {
    await http.get(endpoints.agents).then(res => (agents = res.data.data));

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

  <div class="w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 custom-scroll p-6">
    {#each agents as item (item.id)}
      <History
        agentId={item?.id}
        last_status={item?.status}
        name={item?.name}
        checked_at={item?.last_seen} />
    {/each}
  </div>
</div>
