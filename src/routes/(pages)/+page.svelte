<script>
  import PerformanceOverview from '../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../components/pages/dashboard/TopRight.svelte';
  import { theme } from '../../stores/theme.svelte';
  import { MACHINE } from './machine/[machine]/constant.svelte';
</script>

<section class="w-full h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-3">
    <div class="w-full flex gap-7.75">
      <PerformanceOverview {theme} />
      <TopRight />
    </div>

    <StatusOverview
      type="agents"
      subtitle="Infrastructure Nodes & Cluster Health"
      data={AGENTS_DATA} />
    <StatusOverview
      type="checkers"
      subtitle="Microservices Health & Availability"
      data={AGENTS_DATA} />

    <div
      class="w-full p-6 rounded-[14px] bg-white dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5">
      <div class="w-full flex justify-between items-start pb-4">
        <div class="flex flex-col gap-1">
          <span class="text-xl dark:text-white">Agents Status</span>
          <span class="text-sm text-[#99a1af]">Microservices Health & Availability</span>
        </div>
        <div
          class="w-12 h-10 flex justify-center items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
          <img width="17" src="/icons/refresh-green.svg" alt="refresh" />
        </div>
      </div>

      <div class="w-full grid grid-cols-3 gap-6">
        <div
          class="w-full p-5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#00d492]/10 border border-[#00d492]/30">
              <img src="/icons/agent-green.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full">
              <span class="size-2 bg-[#00d492]"></span>
              <span class="text-xs text-[#00d492]">Active</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
        <div
          class="w-full p-5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#00d492]/10 border border-[#00d492]/30">
              <img src="/icons/agent-green.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full">
              <span class="size-2 bg-[#00d492]"></span>
              <span class="text-xs text-[#00d492]">Active</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
        <div
          class="w-full p-5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#00d492]/10 border border-[#00d492]/30">
              <img src="/icons/agent-green.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full">
              <span class="size-2 bg-[#00d492]"></span>
              <span class="text-xs text-[#00d492]">Active</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
        <div
          class="w-full p-5 rounded-xl bg-[#EF4444]/5 border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30">
              <img src="/icons/agent-red.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#EF4444]/20 border border-[#EF4444]/30 rounded-full">
              <span class="size-2 bg-[#EF4444]"></span>
              <span class="text-xs text-[#EF4444]">Active</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
        <div
          class="w-full p-5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#00d492]/10 border border-[#00d492]/30">
              <img src="/icons/agent-green.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full">
              <span class="size-2 bg-[#00d492]"></span>
              <span class="text-xs text-[#00d492]">Active</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
        <div
          class="w-full p-5 rounded-xl bg-[#F0B100]/5 border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-4">
          <div class="flex w-full justify-start items-center gap-4">
            <div
              class="flex justify-center items-center size-10 rounded-2xl bg-[#F0B100]/10 border border-[#F0B100]/30">
              <img src="/icons/agent-yellow.svg" alt="container" />
            </div>

            <div class="flex flex-col justify-center items-start gap-1">
              <span class="text-base dark:text-white">Agent-Alpha</span>
              <span class="text-xs text-[#99a1af]">192.168.1.45</span>
            </div>
            <div
              class="flex justify-center items-center gap-2 px-3 py-1.25 ms-auto mb-auto bg-[#F0B100]/20 border border-[#F0B100]/30 rounded-full">
              <span class="size-2 bg-[#F0B100]"></span>
              <span class="text-xs text-[#F0B100]">Warning</span>
            </div>
          </div>
          <div class="w-full h-36.25 flex flex-col justify-between gap-3">
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">CPU</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">RAM</span>
                <span class="dark:text-white">62%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-1.5 justify-center">
              <div class="flex justify-between items-start text-xs">
                <span class="text-[#99a1af]">Storage</span>
                <span class="dark:text-white">45%</span>
              </div>
              <div class="w-full flex gap-1 justify-center items-start">
                {#each MACHINE.cpu.slice(-50) as detail}
                  <div
                    class="size-1.25 rounded-[1px] {detail.usage_percent
                      ? detail.usage_percent < 65
                        ? 'bg-green-700'
                        : detail.usage_percent < 85
                          ? 'bg-[#F97316]'
                          : 'bg-[#EF4444]'
                      : 'bg-[#FFFFFF]/5'}">
                  </div>
                {/each}
              </div>
            </div>
            <div
              class="w-full pt-2 border-t border-[#0D0D0D]/5 dark:border-white/5 flex justify-between items-center text-[#99a1af] text-xs">
              <div class="flex items-center justify-start gap-1">
                <img src="/icons/time.svg" alt="time" />
                <span>Uptime</span>
              </div>
              <span class="dark:text-white">14d 6h 23m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full grid grid-cols-4 gap-7.5">
      <div
        class="flex flex-col p-5 gap-3 bg-white dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl">
        <div class="flex items-center gap-3">
          <span class="size-2 bg-[#22c55e] rounded-full"></span>
          <span class="dark:text-white text-base">Health Center</span>
        </div>
        <div class="text-xs text-[#99a1af]">
          Self-help tools for troubleshooting network issues.
        </div>
        <div
          class="w-full py-2.5 flex justify-center items-center gap-3 bg-[#e5e7eb] dark:bg-[#1a1c23] rounded-lg mt-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-[#22242e]">
          <span class="text-sm dark:text-[#d1d5db]">Health Check</span>
          <img
            src={$theme === 'dark' ? '/icons/arrow-forward.svg' : '/icons/chevron-light.svg'}
            alt="arrow forward" />
        </div>
      </div>
      <div
        class="flex flex-col p-5 gap-3 bg-white dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl">
        <div class="flex items-center gap-3">
          <span class="size-2 bg-[#3b82f6] rounded-full"></span>
          <span class="dark:text-white text-base">Performance</span>
        </div>
        <div class="text-xs text-[#99a1af]">Analyze latency and throughput bottlenecks.</div>
        <div
          class="w-full py-2.5 flex justify-center items-center gap-3 bg-[#e5e7eb] dark:bg-[#1a1c23] rounded-lg mt-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-[#22242e]">
          <span class="text-sm dark:text-[#d1d5db]">Analyze</span>
          <img
            src={$theme === 'dark' ? '/icons/arrow-forward.svg' : '/icons/chevron-light.svg'}
            alt="arrow forward" />
        </div>
      </div>
      <div
        class="flex flex-col p-5 gap-3 bg-white dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl">
        <div class="flex items-center gap-3">
          <span class="size-2 bg-[#a855f7] rounded-full"></span>
          <span class="dark:text-white text-base">Logs</span>
        </div>
        <div class="text-xs text-[#99a1af]">View real-time system and security logs.</div>
        <div
          class="w-full py-2.5 flex justify-center items-center gap-3 bg-[#e5e7eb] dark:bg-[#1a1c23] rounded-lg mt-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-[#22242e]">
          <span class="text-sm dark:text-[#d1d5db]">View Logs</span>
          <img
            src={$theme === 'dark' ? '/icons/arrow-forward.svg' : '/icons/chevron-light.svg'}
            alt="arrow forward" />
        </div>
      </div>
      <div
        class="flex flex-col p-5 gap-3 bg-white dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl">
        <div class="flex items-center gap-3">
          <span class="size-2 bg-[#f97316] rounded-full"></span>
          <span class="dark:text-white text-base">Alerts</span>
        </div>
        <div class="text-xs text-[#99a1af]">Configure notification policies and thresholds.</div>
        <div
          class="w-full py-2.5 flex justify-center items-center gap-3 bg-[#e5e7eb] dark:bg-[#1a1c23] rounded-lg mt-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-[#22242e]">
          <span class="text-sm dark:text-[#d1d5db]">Configure</span>
          <img
            src={$theme === 'dark' ? '/icons/arrow-forward.svg' : '/icons/chevron-light.svg'}
            alt="arrow forward" />
        </div>
      </div>
    </div>
  </div>
</section>
