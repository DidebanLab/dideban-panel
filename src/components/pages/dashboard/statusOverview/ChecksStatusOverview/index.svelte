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
  let loading = $state(true);
  const REQUIRED_HISTORY_COUNT = $state(innerWidth < 640 ? 31 : 40);

  $effect(() => {
    if (trigger) {
      http.get(endpoints.checks).then(res => (checks = res.data.data));
    }
  });

  onMount(async () => {
    loading = true;
    await http
      .get(endpoints.checks)
      .then(res => (checks = res.data.data))
      .finally(() => {
        loading = false;
      });

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
    {#if !loading}
      {#each Array(3) as _, i}<div
          class="relative h-29 sm:h-32.75 border border-[#0D0D0D]/5 dark:border-gray-400/5 rounded-[14px] flex flex-col py-4 xl:py-6 gap-7">
          <div class="flex justify-start items-center px-4.25 gap-4">
            <div class="size-12 rounded-2xl hidden sm:block bg-white/5 animate-pulse"></div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="w-20 h-5 bg-white/5 rounded-md animate-pulse"></span>

              <div class="w-40 h-4 bg-white/5 mt-1 rounded-md animate-pulse"></div>
            </div>
            <div class="flex justify-center items-center gap-2 ms-auto mb-auto">
              <span class="w-10 h-4 bg-white/5 animate-pulse rounded-md">
                {status}
              </span>

              <div class="size-3 rounded-full bg-white/5 animate-pulse"></div>
            </div>
          </div>

          <div
            class="absolute z-10 bottom-4 xl:bottom-6 w-full flex gap-0.5 justify-between items-end px-4.25 animate-pulse">
            {#each Array(REQUIRED_HISTORY_COUNT) as _, i}
              <div class="w-full h-4 rounded-[1px] bg-white/5"></div>
            {/each}
          </div>
        </div>
      {/each}
    {:else}
      {#each checks as item, i}
        <History
          checkId={item?.id}
          status={item?.status}
          name={item?.name}
          checked_at={item?.last_checked} />
      {/each}
    {/if}
  </div>
</div>
