<script>
  import { onDestroy, onMount } from 'svelte';
  import { opener } from '../../../../../stores/modal.svelte.js';
  import { LIMITATIONS } from '../../../../config.svelte.js';
  import AddChecker from '../AddChecker.svelte';
  import { http } from '../../../../../services/http.svelte.js';
  import { endpoints } from '../../../../../endpoints.svelte.js';
  import responseTimeColor from '../../../../../utils/responseTimeColor.js';
  import { on, off } from '../../../../../services/ws.svelte.js';
  import History from './deps/History.svelte';

  let trigger = $state(0);
  let checks = $state(null);

  $effect(() => {
    if (trigger) {
      http.get(endpoints.checks).then(res => (checks = res.data.data));
    }
  });

  onMount(async () => {
    await http.get(endpoints.checks).then(res => (checks = res.data.data));

    on('check.created', handleCreated);
    on('check.updated', handleUpdated);
    on('check.deleted', handleDeleted);
    on('check.status.changed', handleStatusChanged);
  });

  onDestroy(() => {
    off('check.created', handleCreated);
    off('check.updated', handleUpdated);
    off('check.deleted', handleDeleted);
    off('check.status.changed', handleStatusChanged);
  });

  function handleCreated(data) {
    http.get(endpoints.singleCheck(data?.id)).then(res => (checks = [res.data.data, ...checks]));
  }

  function handleUpdated(data) {
    const initailChecks = checks.filter(item => item.id !== data?.id);
    http
      .get(endpoints.singleCheck(data?.id))
      .then(res => (checks = [res.data.data, ...initailChecks]));
  }

  function handleStatusChanged(data) {
    checks = checks.map(c => (c.id === data.id ? { ...c, status: data.status } : c));
  }

  function handleDeleted(data) {
    checks = checks.filter(c => c.id !== data.id);
  }
</script>

<div
  class="w-full relative rounded-[14px] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div
    class="px-6 sm:py-6 sm:border-b border-[#0D0D0D]/5 dark:border-[#222222] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] w-full flex justify-between items-start rounded-t-[14px]">
    <div class="flex flex-col gap-1">
      <span class="text-lg sm:text-xl dark:text-white capitalize">checkers status</span>
      <span class="text-sm text-[#99a1af]">Microservices Health & Availability</span>
    </div>
    <button
      type="button"
      onclick={() => {
        opener({
          id: `create-checks`,
          content: AddChecker,
          props: {
            onAdded: () => {
              trigger += 1;
            },
          },
        });
      }}
      class="w-10 sm:w-34.25 h-10 flex justify-center gap-2 px-4 items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
      <span class="text-nowrap text-sm hidden sm:flex justify-center items-center"
        >Add Checker</span>
      +
    </button>
  </div>

  <div
    class="w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 custom-scroll p-6 pb-0 sm:pb-6">
    {#each checks as item (item?.id)}
      <History
        checkId={item?.id}
        status={item?.status}
        name={item?.name}
        checked_at={item?.last_checked} />
    {/each}
  </div>
</div>
