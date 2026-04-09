<script>
  import Chart from '../../common/Chart.svelte';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { theme } from '../../../stores/theme.svelte';
  import { onDestroy, onMount } from 'svelte';
  import longPolling from '../../../services/longPolling';

  const isMobile = $state(innerWidth < 645);
  let { value: isAgentExist = $bindable() } = $props();
  let agents = $state();
  let activeIndex = $state(0);
  let isActive = $derived(agents[activeIndex]);
  let agentMetric = $state();
  let currentPoller = $state(null);

  const next = () => {
    if (activeIndex < agents.length - 1) {
      activeIndex++;
    } else {
      activeIndex = 0;
    }
  };

  const prev = () => {
    if (activeIndex > 0) {
      activeIndex--;
    } else {
      activeIndex = agents.length - 1;
    }
  };

  onMount(async () => {
    await http
      .get(endpoints.agents, {
        params: {
          page_size: 3,
          enabled: true,
        },
      })
      .then(res => {
        if (!res.data?.data?.length) {
          isAgentExist = false;
        }

        agents = res.data?.data;
      })
      .catch(() => {
        isAgentExist = false;
      });
  });

  $effect(() => {
    if (!agents || !agents.length) return;

    const id = agents[activeIndex]?.id;
    if (!id) return;

    currentPoller = longPolling(endpoints.agentMetric(id), {
      params: {
        max_points: 60,
      },
      onSuccess: d => {
        agentMetric = d;
      },
    });

    return () => {
      if (currentPoller) {
        currentPoller.stop();
      }
    };
  });

  onDestroy(() => {
    return () => {
      if (currentPoller) {
        currentPoller.stop();
      }
    };
  });
</script>

{#if agents?.length}
  <div
    class="w-full 3xl:w-[65%] h-auto px-6 sm:pt-6 sm:pb-1.5 rounded-[14px] sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
    <div class="flex relative flex-col gap-4 items-start justify-between w-full">
      {#each agents as agent (agent?.id)}
        {#if isActive?.id === agent?.id}
          <div
            class="w-full flex flex-col sm:flex-row justify-center items-start sm:justify-between sm:items-baseline">
            <div class="w-full flex flex-col justify-start items-start">
              <span class="text-lg sm:text-xl dark:text-white capitalize"
                >{agent.name} Performance Overview</span>
              <span class="text-sm text-[#99a1af]">System resource latest utilization trends</span>
            </div>

            {#if agents.length > 1}
              <div
                class="flex justify-start items-center gap-3 w-fit absolute sm:static max-sm:-bottom-6 max-sm:start-1/2 max-sm:-translate-x-1/2">
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
                  </svg>
                </button>

                <div class="flex justify-center items-center gap-3">
                  <button
                    aria-label="slide1"
                    onclick={() => (activeIndex = 0)}
                    class="h-5 group flex justify-center items-center {activeIndex === 0
                      ? ''
                      : 'cursor-pointer'}">
                    <div
                      style="{activeIndex === 0
                        ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                        : ''} "
                      class=" transition-all rounded-full h-0.5 {activeIndex === 0
                        ? 'w-6 bg-[#00b478]'
                        : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                    </div>
                  </button>
                  <button
                    aria-label="slide2"
                    onclick={() => (activeIndex = 1)}
                    class="h-5 group flex justify-center items-center {activeIndex === 1
                      ? ''
                      : 'cursor-pointer'}">
                    <div
                      style="{activeIndex === 1
                        ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                        : ''} "
                      class=" transition-all rounded-full h-0.5 {activeIndex === 1
                        ? 'w-6 bg-[#00b478]'
                        : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                    </div>
                  </button>

                  {#if agents.length > 2}
                    <button
                      aria-label="slide3"
                      onclick={() => (activeIndex = 2)}
                      class="h-5 group flex justify-center items-center {activeIndex === 2
                        ? ''
                        : 'cursor-pointer'}">
                      <div
                        style="{activeIndex === 2
                          ? 'box-shadow: 0 0 20px 1px rgba(0, 180, 120, 1);'
                          : ''} "
                        class=" transition-all rounded-full h-0.5 {activeIndex === 2
                          ? 'w-6 bg-[#00b478]'
                          : 'w-5 bg-[#0D0D0D]/30 dark:bg-white/20 group-hover:bg-[#00b478]/50'}">
                      </div>
                    </button>
                  {/if}
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
            {/if}
          </div>

          <div
            class="w-full flex flex-col md:flex-row justify-start md:justify-between lg:justify-start md:items-center gap-1 md:gap-10">
            <div
              class="h-full w-50 md:w-fit xl:w-fit flex justify-center items-center gap-4 xl:px-4 xl:py-3 rounded-[10px] xl:bg-[#F9FAFB] dark:xl:bg-[#121212] xl:border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #ad46ff;"
                  class="size-2.5 rounded-full bg-[#ad46ff]"></span>
                <span
                  class="flex justify-center items-center text-xs xl:text-sm text-[#6a7282] text-nowrap"
                  >Average CPU Usage :</span>
              </div>

              <span class="dark:text-white text-xs md:text-sm xl:text-base 2xl:text-lg"
                >{agentMetric?.avg_cpu_usage}%</span>
            </div>
            <div
              class="h-full w-50 md:w-fit xl:w-fit flex justify-center items-center gap-4 xl:px-4 xl:py-3 rounded-[10px] xl:bg-[#F9FAFB] dark:xl:bg-[#121212] xl:border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #2b7fff;"
                  class="size-2.5 rounded-full bg-[#2b7fff]"></span>
                <span
                  class="flex justify-center items-center text-xs xl:text-sm text-[#6a7282] text-nowrap"
                  >Average Memory Usage :</span>
              </div>

              <span class="dark:text-white text-xs md:text-sm xl:text-base 2xl:text-lg"
                >{agentMetric?.avg_memory_usage}%</span>
            </div>
            <div
              class="h-full w-50 md:w-fit xl:w-fit flex justify-center items-center gap-4 xl:px-4 xl:py-3 rounded-[10px] xl:bg-[#F9FAFB] dark:xl:bg-[#121212] xl:border border-[#0D0D0D]/5 dark:border-white/5">
              <div class="w-full flex justify-start items-center gap-2.5">
                <span
                  style="box-shadow: 0 0 10px 1px #22c55e;"
                  class="size-2.5 rounded-full bg-[#00bc7d]"></span>
                <span
                  class="flex justify-center items-center text-xs xl:text-sm text-[#6a7282] text-nowrap"
                  >Latest Disk Usage :</span>
              </div>

              <span class="dark:text-white text-xs md:text-sm xl:text-base 2xl:text-lg"
                >{agentMetric?.latest_disk_usage}%</span>
            </div>
          </div>
          {#if agentMetric}
            <Chart
              data={[
                {
                  name: 'CPU',
                  data: [...agentMetric?.cpu].reverse(),
                },
                {
                  name: 'Memory',
                  data: [...agentMetric?.memory].reverse(),
                },
              ]} />
          {/if}
        {/if}
      {/each}
    </div>
  </div>
{/if}
