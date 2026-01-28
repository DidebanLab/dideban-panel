<script>
  import { onMount } from 'svelte';
  import Pagination from '../../../components/common/Pagination.svelte';
  import Select from '../../../components/common/Select.svelte';
  import UptimeChart from '../../../components/common/UptimeChart.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import { opener } from '../../../stores/modal.svelte';
  import { LIMITATIONS } from '../../../components/config.svelte';

  let isMobile = $state(innerWidth < 641);

  let filter = $state({
    id: '',
    rel: 'all',
    type: 'all',
    healthType: 'all',
    limit: 10,
    offset: 0,
  });

  let data = $state({
    results: [
      {
        id: 'main',
        type: 'telegram',
        rel: 'agent',
        healthType: 'cpu',
        message:
          'Lorem ipsum dolor sit amet consec tetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 50, 20, 80],
      },
      {
        id: 'main',
        type: 'telegram',
        rel: 'agent',
        healthType: 'cpu',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 50, 20, 80],
      },
      {
        id: 'main',
        type: 'telegram',
        rel: 'agent',
        healthType: 'cpu',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 50, 20, 80],
      },
      {
        id: 'main',
        type: 'telegram',
        rel: 'agent',
        healthType: 'cpu',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 50, 20, 80],
      },
      {
        id: 'main',
        type: 'telegram',
        rel: 'agent',
        healthType: 'cpu',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 50, 20, 80],
      },
      {
        id: 'test1',
        type: 'sms',
        rel: 'checker',
        healthType: 'collect_duration_ms',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [1000, 2000, 1000, 4200],
      },
      {
        id: 'development',
        type: 'email',
        rel: 'agent',
        healthType: 'disk',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, voluptatum quis incidunt amet quod numquam aspernatur accusantium nam rem repellendus et fugit magni pariatur cum, unde dolorem impedit! Magni, dolore!',
        data: [0, 40, 10, 70],
      },
    ],
    count: '',
    next: '',
    prev: '',
  });

  $effect(() => {
    const params = {
      id: '',
      rel: 'all',
      type: 'all',
      healthType: 'all',
      limit: filter.limit,
      offset: filter.offset,
    };

    http.get(endpoints.alerts, { params }).then(res => {
      data = {
        results: res.data.results,
        count: Math.ceil(res.data.count / filter.limit),
        next: res.data.next,
        prev: res.data.previous,
      };
    });
  });

  function errorSelector(healthType) {
    switch (healthType) {
      case 'cpu':
        return LIMITATIONS.cpu.error;
      case 'collect_duration_ms':
        return LIMITATIONS.collect_duration_ms.error;
      case 'memory':
        return LIMITATIONS.memory.error;
      case 'disk':
        return LIMITATIONS.disk.error;
    }
  }

  function iconSelector(type, error) {
    switch (type) {
      case 'telegram':
        return `<svg
            width="22"
            class="telegram-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=${error ? '#ef4444' : '#F97316'}
            aria-label="Telegram">
            <path d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
          </svg>`;

      case 'sms':
        return `<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke=${error ? '#ef4444' : '#F97316'}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="13" y2="12" />
            </svg>`;

      case 'email':
        return `<svg
            width="24"
            class="email-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill=${error ? '#ef4444' : '#F97316'}
            aria-label="Email">
            <path
              d="M20 4H4c-1.1 0-2 .9-2 2v12c0 
             1.1.9 2 2 2h16c1.1 0 2-.9 
             2-2V6c0-1.1-.9-2-2-2zm0 
             4-8 5-8-5V6l8 5 8-5v2z" />
          </svg>`;
    }
  }

  function filterHandler() {
    const params = { ...filter, offset: 0, limit: 10 };

    http.get(endpoints.alerts, { params }).then(res => {
      data = {
        results: res.data.results,
        count: Math.ceil(res.data.count / filter.limit),
        next: res.data.next,
        prev: res.data.previous,
      };
    });
  }
</script>

<section class="w-full m-auto h-[90vh] sm:p-7.75 sm:pt-2.5">
  <div
    class="w-full h-full px-6 sm:py-6 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-7.75 overflow-y-auto custom-scroll pb-4">
    <div class="flex justify-start items-center gap-4">
      <div
        class="flex justify-center items-center size-12 rounded-2xl bg-[#0D0D0D]/5 dark:bg-white/5">
        <img src="/icons/bell.png" alt="bell" />
      </div>

      <span class="text-black dark:text-white text-xl">Alerts History</span>
    </div>

    <div class="w-full flex flex-col justify-start items-center gap-2">
      <div
        class="w-full flex flex-col justify-start items-start gap-2 border p-3 border-[#0D0D0D]/5 dark:border-white/5 rounded-lg">
        <span class="text-sm text-black dark:text-white">Filter</span>
        <div
          class="w-full flex flex-col md:flex-row justify-start gap-3 items-start md:items-center z-10">
          <div
            class="flex gap-1.5 px-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md w-full">
            <label
              for="id"
              class="text-black dark:text-white text-base text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
              >Id</label>

            <input
              id="id"
              bind:value={filter.id}
              placeholder="Please enter the (Id)"
              class="px-2.5 h-9 w-full rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
              type="text" />
          </div>

          <div class="flex justify-start items-center w-full gap-3 max-sm:flex-wrap">
            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md w-fit">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Rel</span>

              <Select
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.rel}
                options={[{ name: 'all' }, { name: 'agent' }, { name: 'checker' }]} />
            </div>
            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md w-fit">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Type</span>

              <Select
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.type}
                options={[
                  { name: 'all' },
                  { name: 'telegram' },
                  { name: 'bale' },
                  { name: 'sms' },
                  { name: 'email' },
                ]} />
            </div>
            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md w-fit">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Health Type</span>

              <Select
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.healthType}
                options={[
                  { name: 'all' },
                  { name: 'cpu' },
                  { name: 'memory' },
                  { name: 'disk' },
                  { name: 'uptime' },
                  { name: 'latency' },
                ]} />
            </div>
            <button
              disabled={filter.healthType === 'all' &&
                filter.rel === 'all' &&
                filter.type === 'all' &&
                filter.id === ''}
              onclick={filterHandler}
              type="button"
              class="w-fit px-9 sm:px-7 md:px-10 ms-auto text-sm text-[#10b981] h-8.5 flex justify-center items-center rounded-md cursor-pointer bg-[#22c55e]/10 hover:opacity-60 border border-[#00bc7d]/10 disabled:opacity-50 disabled:dark:opacity-30 disabled:cursor-not-allowed">
              Filter
            </button>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2 text-sm">
        <div class="w-full flex justify-start gap-1 items-center text-white">
          <span
            class="w-12 md:w-13 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Type</span>
          <span
            class="w-22 md:w-25 xl:w-45 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Id</span>
          <span
            class="w-15 lg:w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Rel</span>
          <span
            class="w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Hl Type</span>
          <span
            class="hidden lg:inline w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Status</span>
          <span
            class="flex-1 hidden lg:inline text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Message</span>
          <span
            class="max-lg:flex-1 hidden sm:inline md:w-30 xl:w-61 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Chart</span>
          <span
            class="p-2 text-black dark:text-white text-center backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Detail</span>
        </div>

        {#each data.results as result}
          {@const error = result.data[result.data.length - 1] > errorSelector(result.healthType)}
          <div
            class="w-full h-12 sm:h-14 flex justify-start items-center gap-1 rounded-xl dark:text-white sm:p-1 border {error
              ? 'border-[#EF4444]/20 bg-[#610000]/5'
              : 'bg-[#F97316]/5 border-[#F97316]/15'}">
            <div
              class="flex justify-center items-center p-2.5 md:p-3 lg:bg-[#EF4444]/10 rounded-xl">
              {@html iconSelector(result.type, error)}
            </div>
            <div class=" h-full w-19 sm:w-22 md:w-25 xl:w-45 flex items-center justify-center">
              <span class="text-xs md:text-sm xl:text-lg capitalize">{result.id}</span>
            </div>
            <div class=" h-full w-14 sm:w-15 lg:w-18 xl:w-25 flex items-center justify-center">
              <span
                class="text-xs lg:text-sm xl:text-lg text-black/60 dark:text-white/30 capitalize"
                >{result.rel}</span>
            </div>
            <div class=" h-full w-16 sm:w-18 xl:w-25 flex items-center justify-center">
              <span
                class="text-xs lg:text-sm xl:text-lg text-black/60 dark:text-white/30 capitalize"
                >{result.healthType === 'collect_duration_ms'
                  ? 'latency'
                  : result.healthType}</span>
            </div>
            <div
              class="hidden lg:flex h-full w-18 xl:w-25 items-center justify-center overflow-hidden rounded-lg">
              <span
                class="text-xs lg:text-sm xl:text-lg {error
                  ? 'text-[#ef4444]/90'
                  : 'text-[#F97316]'}"
                >{result.data[result.data.length - 1]}{result.healthType === 'collect_duration_ms'
                  ? 'ms'
                  : '%'}</span>
            </div>
            <div
              class="flex-1 hidden lg:flex justify-center items-center h-full
         bg-linear-to-r via-[#0D0D0D]/5 dark:via-white/5
         rounded-md">
              <p
                class="px-2 lg:px-1 text-xs lg:text-sm xl:px-3 line-clamp-2 text-start text-black/60 dark:text-white/70">
                {result.message}
              </p>
            </div>
            <div
              class="hidden sm:w-45 ms-auto md:w-78 lg:w-45 xl:w-62 sm:flex justify-center items-center h-full rounded-md mt-4 scale-x-105">
              <UptimeChart
                name="Latency"
                height={isMobile ? 65 : 70}
                data={[...result.data]}
                unit={result.healthType === 'collect_duration_ms' ? 'ms' : '%'} />
            </div>
            <button
              type="button"
              aria-label="alert modal"
              onclick={() => {
                opener({
                  id: `create-alert`,
                  content: '',
                });
              }}
              class="w-11 pe-2 sm:pe-1 md:pe-0 lg:pe-1 flex justify-center items-center cursor-pointer">
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Menu">
                <line
                  class="dark:stroke-white stroke-[#686a6e]"
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                  stroke-width="2"
                  stroke-linecap="round" />
                <line
                  class="dark:stroke-white stroke-[#686a6e]"
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  stroke-width="2"
                  stroke-linecap="round" />
                <line
                  class="dark:stroke-white stroke-[#686a6e]"
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
            </button>
          </div>
        {/each}
      </div>
    </div>

    {#if data?.results?.length && data.count > 1}
      <Pagination {filter} count={data.count} prev={data.prev} next={data.next} />
    {/if}
  </div>
</section>
