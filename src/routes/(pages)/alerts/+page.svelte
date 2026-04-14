<script>
  import { onMount } from 'svelte';
  import Pagination from '../../../components/common/Pagination.svelte';
  import Select from '../../../components/common/Select.svelte';
  import LatencyChart from '../../../components/common/LatencyChart.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import { opener } from '../../../stores/modal.svelte';
  import { LIMITATIONS } from '../../../components/config.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteURL } from 'svelte/reactivity';

  let isMobile = $state(innerWidth < 641);

  let relationInfo = $state(null);
  let relationInfoLoading = $state(true);
  let paramsList = $state([]);

  let filter = $state({
    id: $page.url.searchParams.get('id') || '',
    rel: $page.url.searchParams.get('rel') || 'all',
    status: $page.url.searchParams.get('status') || 'all',
    type: $page.url.searchParams.get('type') || 'all',
    condition_type: $page.url.searchParams.get('condition_type') || 'all',
    machine_state: $page.url.searchParams.get('machine_state') || 'all',
    last_status: $page.url.searchParams.get('last_status') || 'all',
  });

  const getAllParams = () => {
    const params = $page.url.searchParams;
    const result = [];

    const keys = [...params.keys()];

    for (const key of keys) {
      result.unshift([key, params.get(key)]);
    }

    return result;
  };

  $effect(() => {
    if ($page.url.searchParams) {
      paramsList = getAllParams();
    }
  });

  let data = $state({
    results: [
      {
        id: 1,
        check_id: 1,
        agent_id: null,
        type: 'telegram',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 2,
        check_id: 2,
        agent_id: null,
        type: 'telegram',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 3,
        check_id: 3,
        agent_id: null,
        type: 'telegram',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 4,
        check_id: 5,
        agent_id: null,
        type: 'telegram',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
    ],
    count: '',
    next: '',
    prev: '',
  });

  function removeParam(keyToRemove) {
    if (keyToRemove === 'id') {
      filter.id = '';
    } else {
      filter[keyToRemove] = 'all';
    }
  }

  function handleParameters(key, value) {
    const url = new SvelteURL($page.url);
    if (key === 'id') {
      if (url.searchParams.has('id')) {
        if (value.length) {
          url.searchParams.set('id', value);
        } else {
          url.searchParams.delete('id');
        }
      } else {
        if (value.length) {
          url.searchParams.append('id', value);
        }
      }
    } else if (filter[key] !== 'all') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }

    goto(url.toString(), { keepFocus: true, noScroll: true });
  }

  function iconSelector(type) {
    switch (type) {
      case 'telegram':
        return `<svg
            width="20"
            class="telegram-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill='#32ABE7'
            aria-label="Telegram">
            <path d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
          </svg>`;

      case 'webhook':
        return `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke='#ef4444'
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="13" y2="12" />
            </svg>`;
      //Bale icon is Fake
      case 'bale':
        return `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke='#ef4444'
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="13" y2="12" />
            </svg>`;

      case 'email':
        return `<svg
            width="22"
            class="email-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill='#ef4444' 
            aria-label="Email">
            <path
              d="M20 4H4c-1.1 0-2 .9-2 2v12c0 
             1.1.9 2 2 2h16c1.1 0 2-.9 
             2-2V6c0-1.1-.9-2-2-2zm0 
             4-8 5-8-5V6l8 5 8-5v2z" />
          </svg>`;
    }
  }

  // $effect(() => {
  //   if (!$page.url) return;

  //   let hasChanges = false;

  //   const filterKeys = [
  //     'id',
  //     'rel',
  //     'status',
  //     'type',
  //     'condition_type',
  //     'machine_state',
  //     'last_status',
  //   ];

  //   for (const key of filterKeys) {
  //     const val = filter[key];
  //     if (val === 'all' || val === '') {
  //       if ($page.url.searchParams.has(key)) {
  //         $page.url.searchParams.delete(key);
  //         hasChanges = true;
  //       }
  //     } else {
  //       if ($page.url.searchParams.get(key) !== val) {
  //         $page.url.searchParams.set(key, val);
  //         hasChanges = true;
  //       }
  //     }
  //   }

  //   if (hasChanges) {
  //     goto($page.url.toString(), { keepFocus: true, noScroll: true });
  //   }

  //   console.log('slam');
  // });
</script>

<section class="w-full flex flex-col gap-8 sm:p-7.75 sm:pt-2.5">
  <div
    class="w-full sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] flex flex-col gap-8 p-6 border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] h-100">
    <div class="flex flex-col justify-start items-start gap-1">
      <div class="text-lg sm:text-xl dark:text-white capitalize">Alerts Stats</div>
      <span class="text-sm text-[#99a1af]">Lorem ipsum dolor sit amet psum</span>
    </div>

    <div class="w-full h-full grid grid-cols-5 gap-6">
      <div
        class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          Status
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Total </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Enable </span>
            <span class="text-white 29 text-sm">10</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Disable </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
        </div>
      </div>
      <div
        class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          State Machine
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Idle </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Resolved </span>
            <span class="text-white 29 text-sm">10</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Firing </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
        </div>
      </div>
      <div
        class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          Type
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Email </span>
            <span class="text-white 29 text-sm">10</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Telegram </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Bale </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Webhook </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          Condition
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Status Down </span>
            <span class="text-white 29 text-sm">10</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Offline </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Cpu Above </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Memory Above </span>
            <span class="text-white 29 text-sm">20</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Disk Above </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          History
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Total </span>
            <span class="text-white 29 text-sm">10</span>
          </div>

          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Sent </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Failed </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
          <div
            class="flex justify-between items-center w-full bg-white/5 px-2 py-1 rounded-lg shadow shadow-white/10">
            <span class="text-white text-sm">Pending </span>
            <span class="text-white 29 text-sm">20</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="w-full h-[90vh] px-6 sm:py-6 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-7.75 overflow-y-auto custom-scroll pb-4">
    <div class="w-full flex flex-col justify-start items-center gap-2">
      <div
        class="w-full flex flex-col justify-start items-start gap-2 border p-3 border-[#0D0D0D]/5 dark:border-white/5 rounded-lg">
        <span class="text-sm text-black dark:text-white">Filter</span>
        <div class="w-full flex flex-col justify-start gap-3 items-start md:items-center z-10">
          <div
            class="flex w-full gap-1.5 px-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
            <label
              for="id"
              class="text-black dark:text-white text-base text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
              >Id</label>

            <input
              id="id"
              oninput={() => {
                handleParameters('id', filter.id);
              }}
              bind:value={filter.id}
              placeholder="Filter With Id"
              class="px-2.5 h-9 w-full rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
              type="text" />
          </div>

          <div class="flex justify-start items-center w-full gap-3 max-sm:flex-wrap">
            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Type</span>

              <Select
                onParamHandle={val => {
                  handleParameters('type', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.type}
                options={[
                  { name: 'all' },
                  { name: 'telegram' },
                  { name: 'bale' },
                  { name: 'email' },
                  { name: 'webhook' },
                ]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black pe-3 dark:text-white text-sm text-nowrap border-e border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Rel</span>

              <Select
                onParamHandle={val => {
                  handleParameters('rel', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize justify-between!"
                bind:value={filter.rel}
                options={[{ name: 'all' }, { name: 'agent' }, { name: 'check' }]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >status</span>

              <Select
                onParamHandle={val => {
                  handleParameters('status', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.status}
                options={[{ name: 'all' }, { name: 'enable' }, { name: 'disable' }]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20">
                Condition Type
              </span>

              <Select
                onParamHandle={val => {
                  handleParameters('condition_type', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.condition_type}
                options={[
                  { name: 'All' },
                  { name: 'status_Down' },
                  { name: 'cpu_above' },
                  { name: 'memory_above' },
                  { name: 'disk_above' },
                  { name: 'status_timeout' },
                  { name: 'status_up' },
                ]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20">
                Machine State
              </span>

              <Select
                onParamHandle={val => {
                  handleParameters('machine_state', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.machine_state}
                options={[
                  { name: 'All' },
                  { name: 'idle' },
                  { name: 'firing' },
                  { name: 'resolved' },
                ]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20">
                Sending status
              </span>

              <Select
                onParamHandle={val => {
                  handleParameters('last_status', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.last_status}
                options={[{ name: 'All' }, { name: 'sent' }, { name: 'failed' }]} />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-1.5 text-sm">
        <div
          class="w-full flex gap-2 justify-end items-center border-b pb-1.5 border-[#0D0D0D]/5 dark:border-white/5">
          {#each paramsList as filteredItem}
            <div
              class="px-4 relative py-1.25 rounded-md border border-blue-500/20 shadow-md shadow-blue-500/10 text-blue-500">
              <button
                aria-label="delete filter"
                type="button"
                onclick={() => {
                  removeParam(filteredItem[0]);
                }}
                class="absolute start-0 -top-1 px-1 py-1 rounded-sm bg-[#EF4444]/15 flex justify-center items-center cursor-pointer hover:bg-[#EF4444]/20">
                <div class="bg-[#ef4444] w-2 h-0.5"></div>
              </button>

              {filteredItem[1]}
            </div>
          {/each}
        </div>

        <div class="w-full mb-0.5 flex justify-start gap-1 items-center text-white">
          <span
            class="w-12 md:w-13 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Type</span>

          <span
            class="w-15 lg:w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Rel</span>
          <span
            class="w-15 lg:w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Status</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Condition Type</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Condition Value</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Machine State</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Send Status</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Date</span>
        </div>

        {#each data.results as result}
          <a
            href={`/alerts/${result.id}`}
            class="w-full h-12 flex hover:scale-x-101 transition-all duration-300 justify-start items-center gap-1 rounded-xl dark:text-white sm:p-1 border border-[#EF4444]/15 bg-[#640000bc]/5">
            <div class="w-12 flex justify-start items-center">
              <div
                class="flex justify-center items-center p-2 md:p-2 md:pe-2.5 rounded-xl {result.type ===
                'telegram'
                  ? 'bg-[#28a1da]/10'
                  : ''}">
                {@html iconSelector(result.type)}
              </div>
            </div>

            <div class=" h-full w-15 lg:w-18 xl:w-25 flex items-center justify-center">
              <button
                type="button"
                aria-label="relation type"
                onmouseenter={() => {
                  relationInfo = null;
                  relationInfoLoading = true;

                  let url;
                  if (result.check_id) {
                    http
                      .get(endpoints.singleCheck(result.check_id))
                      .then(
                        res =>
                          (relationInfo = { name: res.data?.data?.name, id: res.data?.data?.id }),
                      )
                      .finally(() => {
                        relationInfoLoading = false;
                      });
                  } else if (result.agent_id) {
                    http
                      .get(endpoints.singleAgent(result.agent_id))
                      .then(
                        res =>
                          (relationInfo = { name: res.data?.data?.name, id: res.data?.data?.id }),
                      )
                      .finally(() => {
                        relationInfoLoading = false;
                      });
                  } else return;
                }}
                onmouseleave={() => {
                  relationInfo = null;
                }}
                onfocus={() => {
                  relationInfo = null;
                  relationInfoLoading = true;

                  let url;
                  if (result.check_id) {
                    url = endpoints.singleCheck(result.check_id);
                  } else if (result.agent_id) {
                    url = endpoints.singleAgent(result.agent_id);
                  } else return;

                  http
                    .get(url)
                    .then(
                      res =>
                        (relationInfo = { name: res.data?.data?.name, id: res.data?.data?.id }),
                    )
                    .finally(() => {
                      relationInfoLoading = false;
                    });
                }}
                onblur={() => {
                  relationInfo = null;
                }}
                class="flex group relative justify-start items-center gap-1">
                <div
                  class="text-xs cursor-pointer lg:text-sm xl:text-md text-black dark:text-white capitalize">
                  {result.agent_id ? 'Agent' : 'Check'}
                </div>
                <img
                  class="cursor-pointer"
                  width="20"
                  height="20"
                  src="/icons/question.png"
                  alt="question" />
                {#if relationInfoLoading}
                  <div
                    class="absolute *:text-nowrap bottom-5 start-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
                    <div class="flex justify-between items-center w-full gap-2">
                      <span>id :</span>
                      <span class="bg-white/5 w-7 rounded-md animate-pulse h-4"></span>
                    </div>

                    <div class="flex justify-between min-w-30 items-center w-full gap-2">
                      <span>name :</span>
                      <span class="bg-white/5 w-20 rounded-md animate-pulse h-4"></span>
                    </div>
                  </div>
                {:else if relationInfo}
                  <div
                    class="absolute *:text-nowrap bottom-5 start-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
                    <div class="flex justify-between items-center w-full gap-2">
                      <span>Id :</span>
                      <span class="text-white">{relationInfo.id}</span>
                    </div>

                    <div class="flex justify-between items-center min-w-30 w-full gap-2">
                      <span>Name :</span>
                      <span class="text-white">{relationInfo.name}</span>
                    </div>

                    <!-- svelte-ignore node_invalid_placement_ssr -->
                    <a
                      href={result.agent_id
                        ? `/agents/${result.agent_id}`
                        : `/checkers/${relationInfo.id}`}
                      aria-label="go to relation page"
                      class="text-nowrap gap-2 justify-center items-center flex cursor-pointer mt-2 hover:opacity-70 rounded-md border border-[#2B7FFF]/20 px-2 py-1 w-full text-[#2B7FFF] text-xs">
                      {result.agent_id ? 'Agent' : 'Checker'} Page
                    </a>
                  </div>
                {:else}
                  <div
                    class="absolute text-nowrap py-2 px-3 group-hover:flex hidden bottom-5 start-1/2 -translate-x-1/2 bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl justify-center items-center overflow-hidden rounded-xl text-red-500/50 border border-[#F87171]/15 text-sm">
                    <div
                      class="w-full h-full relative flex justify-center items-center rounded-xl animate-pulse text-nowrap">
                      <div
                        class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
                        style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
                        <div class="w-full h-full bg-white/5"></div>
                      </div>

                      <div class="flex justify-center items-center gap-1 text-nowrap">
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
                        <span class="text-red-500/70 mt-0.5 text-nowrap">Something Is Wrong</span>
                      </div>
                    </div>
                  </div>
                {/if}
              </button>
            </div>
            <div class=" h-full w-15 lg:w-18 xl:w-25 flex items-center justify-center">
              <span
                class="text-xs lg:text-sm xl:text-md capitalize rounded-md w-15.75 py-0.5 flex justify-center items-center {result.enabled
                  ? 'text-[#00bc7d]/90 bg-[#00bc7d]/5'
                  : 'text-[#fa5757]/90 bg-[#F87171]/5'}">
                {result.enabled ? 'Enable' : 'Disable'}</span>
            </div>
            <div class=" h-full flex-1 flex items-center justify-center">
              <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                >{result.condition_type}</span>
            </div>
            <div class=" h-full flex-1 flex items-center justify-center">
              <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                >{result.condition_value ? result.condition_value + '%' : '-'}</span>
            </div>
            <div class=" h-full flex-1 flex items-center justify-center">
              <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                >{result.machine_state}</span>
            </div>
            <div class=" h-full flex-1 flex items-center justify-center gap-1">
              {#if result.last_status === 'sent'}
                <img class="mb-0.5 opacity-50" width="17" src="/icons/tick.svg" alt="tick" />
              {:else if result.last_status === 'failed'}
                <img class="mb-0.5 opacity-70" width="17" src="/icons/error.svg" alt="error" />
              {/if}

              <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                >{result.last_status}</span>
            </div>
            <div class=" h-full flex-1 flex items-center justify-center gap-1">
              <img class="mb-0.5" width="19" height="19" src="/icons/clock.png" alt="clock" />
              <span class="text-xs lg:text-sm xl:text-sm text-white/30">
                {new Date(result.last_fired_at).toLocaleString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}</span>
            </div>
          </a>
        {/each}
      </div>
    </div>

    {#if data?.results?.length && data.count > 1}
      <Pagination {filter} count={data.count} prev={data.prev} next={data.next} />
    {/if}
  </div>
</section>
