<script>
  import { MACHINE } from '../../routes/(pages)/machine/[machine]/constant.svelte';

  const { theme } = $props();
  MACHINE;
</script>

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
