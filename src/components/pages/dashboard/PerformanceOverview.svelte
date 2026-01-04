<script>
  import Chart from '../../common/Chart.svelte';
  import { MACHINES } from '../../../routes/(pages)/constant.svelte';

  const { theme } = $props();

  let width = $state(0);
  let isMobile = $derived(width < 365);
  let isTablet = $derived(width > 1279 && width < 1536);
  let visibleSeries = $state({
    CPU: true,
    Memory: true,
    Disk: true,
  });
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
</script>

<svelte:window bind:innerWidth={width} />

<div
  class="w-[65%] h-full p-6 pb-1.5 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="flex flex-col gap-4 items-start justify-around">
    {#each MACHINES as machine (machine.id)}
      {#if isActive === machine.agent_id}
        <div class="w-full flex justify-between items-baseline">
          <div class="w-full flex flex-col justify-start items-start">
            <span class="text-xl dark:text-white">{machine.agent_id} Performance Overview</span>
            <span class="text-sm text-[#99a1af]">System resource latest utilization trends</span>
          </div>

          <div class="flex justify- items-center gap-3">
            <button class="cursor-pointer" onclick={prev} aria-label="prev slide" type="button">
              <svg
                class="rotate-180"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50">
                <path
                  d="M0 0 C3.50602742 0.58046812 5.20849502 1.80123031 7.6875 4.3125 C8.28949219 4.90675781 8.89148437 5.50101563 9.51171875 6.11328125 C11.15761446 8.19981046 11.88713672 9.3374526 12 12 C10.63671875 14.0703125 10.63671875 14.0703125 8.6875 16.125 C8.05199219 16.80820312 7.41648438 17.49140625 6.76171875 18.1953125 C5.51591496 19.47150175 4.26108804 20.73891196 3 22 C2.01 22 1.02 22 0 22 C0.52162717 17.30535551 2.12514403 16.87485597 6 13 C-7.86 12.67 -21.72 12.34 -36 12 C-36 11.34 -36 10.68 -36 10 C-22.14 9.67 -8.28 9.34 6 9 C4.02 7.02 2.04 5.04 0 3 C0 2.01 0 1.02 0 0 Z"
                  fill={$theme === 'dark' ? 'white' : '#0D0D0D'}
                  transform="translate(37,14)" />
              </svg></button>

            <div class="flex justify-center items-center gap-3">
              <button
                aria-label="slide2"
                onclick={() => (activeIndex = 0)}
                class="h-5 group flex justify-center items-center {isActive === 'Beta'
                  ? ''
                  : 'cursor-pointer'}">
                <div
                  style="{isActive === 'Beta'
                    ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                    : ''} "
                  class=" transition-all rounded-full h-0.5 {isActive === 'Beta'
                    ? 'w-6 bg-[#00b478]'
                    : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                </div>
              </button>
              <button
                aria-label="slide1"
                onclick={() => (activeIndex = 1)}
                class="h-5 group flex justify-center items-center {isActive === 'Main'
                  ? ''
                  : 'cursor-pointer'}">
                <div
                  style="{isActive === 'Main'
                    ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                    : ''} "
                  class=" transition-all rounded-full h-0.5 {isActive === 'Main'
                    ? 'w-6 bg-[#00b478]'
                    : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                </div>
              </button>

              <button
                aria-label="slide3"
                onclick={() => (activeIndex = 2)}
                class="h-5 group flex justify-center items-center {isActive === 'Development'
                  ? ''
                  : 'cursor-pointer'}">
                <div
                  style="{isActive === 'Development'
                    ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                    : ''} "
                  class=" transition-all rounded-full h-0.5 {isActive === 'Development'
                    ? 'w-6 bg-[#00b478]'
                    : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                </div>
              </button>
            </div>
            <button class="cursor-pointer" onclick={next} aria-label="next slide" type="button">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50">
                <path
                  d="M0 0 C3.50602742 0.58046812 5.20849502 1.80123031 7.6875 4.3125 C8.28949219 4.90675781 8.89148437 5.50101563 9.51171875 6.11328125 C11.15761446 8.19981046 11.88713672 9.3374526 12 12 C10.63671875 14.0703125 10.63671875 14.0703125 8.6875 16.125 C8.05199219 16.80820312 7.41648438 17.49140625 6.76171875 18.1953125 C5.51591496 19.47150175 4.26108804 20.73891196 3 22 C2.01 22 1.02 22 0 22 C0.52162717 17.30535551 2.12514403 16.87485597 6 13 C-7.86 12.67 -21.72 12.34 -36 12 C-36 11.34 -36 10.68 -36 10 C-22.14 9.67 -8.28 9.34 6 9 C4.02 7.02 2.04 5.04 0 3 C0 2.01 0 1.02 0 0 Z"
                  fill={$theme === 'dark' ? 'white' : '#0D0D0D'}
                  transform="translate(37,14)" />
              </svg></button>
          </div>
        </div>

        <div class="w-full flex justify-start items-center gap-3">
          <div
            class="h-full min-w-50 flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
            <div class="w-full flex justify-start items-center gap-2.5">
              <span
                style="box-shadow: 0 0 10px 1px #ad46ff;"
                class="size-2.5 rounded-full bg-[#ad46ff]"></span>
              <span class="flex justify-center items-center text-sm text-[#6a7282]">Average CPU Usage :</span>
            </div>

            <span class="dark:text-white text-lg"
              >{machine.cpu[machine.cpu.length - 1].usage_percent}%</span>
          </div>
          <div
            class="h-full min-w-50 flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
            <div class="w-full flex justify-start items-center gap-2.5">
              <span
                style="box-shadow: 0 0 10px 1px #2b7fff;"
                class="size-2.5 rounded-full bg-[#2b7fff]"></span>
              <span class="text-sm text-[#6a7282]">Average Memory Usage :</span>
            </div>

            <span class="dark:text-white text-lg"
              >{machine.memory[machine.memory.length - 1].usage_percent}%</span>
          </div>
          <div
            class="h-full min-w-50 flex justify-center items-center gap-4 px-4 py-3 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
            <div class="w-full flex justify-start items-center gap-2.5">
              <span
                style="box-shadow: 0 0 10px 1px #22c55e;"
                class="size-2.5 rounded-full bg-[#00bc7d]"></span>
              <span class="text-sm text-[#6a7282]">Average Disk Usage :</span>
            </div>

            <span class="dark:text-white text-lg"
              >{machine.disk[machine.disk.length - 1].usage_percent}%</span>
          </div>
        </div>

        <Chart
          {isMobile}
          {visibleSeries}
          data={[
            {
              name: 'CPU',
              data: isMobile
                ? machine.cpu.slice(-50).map(d => d.usage_percent ?? 0)
                : machine.cpu.map(d => d.usage_percent ?? 0),
            },
            {
              name: 'Memory',
              data: isMobile
                ? machine.memory.slice(-50).map(d => d.usage_percent ?? 0)
                : machine.memory.map(d => d.usage_percent ?? 0),
            },
            {
              name: 'Disk',
              data: isMobile
                ? machine.disk.slice(-50).map(d => d.usage_percent ?? 0)
                : machine.disk.map(d => d.usage_percent ?? 0),
            },
          ]} />{/if}
    {/each}
  </div>
</div>
