<script>
  import { MACHINE } from '../../../../routes/(pages)/machine/[machine]/constant.svelte';
  import { AGENTS_DATA } from './constant.svelte';
  const { title, subtitle, data } = $props();
  AGENTS_DATA;
</script>

<div
  class="w-full p-6 rounded-[14px] bg-[#FFFFFF] dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start pb-4">
    <div class="flex flex-col gap-1">
      <span class="text-xl dark:text-white capitalize">{title}</span>
      <span class="text-sm text-[#99a1af] capitalize">{subtitle}</span>
    </div>
    <div
      class="w-12 h-10 flex justify-center items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
      +
    </div>
  </div>

  <div class="w-full grid grid-cols-1 gap-6">
    {#each AGENTS_DATA as item (item.id)}
      <div class="w-full flex flex-col gap-4 justify-center items-start">
        <h3 class="text-white text-lg capitalize">{item.agent_id}</h3>
        <div class="w-full grid grid-cols-3 gap-6">
          <div
            class="border rounded-[14px] flex flex-col py-6 gap-7
            {item.cpu[item.cpu.length - 1].usage_percent < 60
              ? 'border-[#0D0D0D]/5 dark:border-white/5 bg-[#F9FAFB] dark:bg-[#121212]'
              : item.cpu[item.cpu.length - 1].usage_percent < 80
                ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F9FAFB] dark:bg-[#F97316]'
                : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div class="flex justify-center items-center size-12 rounded-2xl bg-[#EF4444]/10">
                <img src="/icons/memory-red.svg" alt="container" />
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">CPU</span>
                <span class="text-xs text-[#99a1af]">Latency: {item.collect_duration_ms} ms</span>
              </div>
              <div
                style="box-shadow: 0 0 10px 1px #EF4444;"
                class="size-2.5 bg-[#EF4444] rounded-full ms-auto mb-auto mt-2">
              </div>
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
            class="border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] flex flex-col py-6 gap-6 bg-[#F9FAFB] dark:bg-[#121212]">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div class="flex justify-center items-center size-12 rounded-2xl bg-[#6366f1]/10">
                <img src="/icons/container.svg" alt="container" />
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">US-East-Cluster-01</span>
                <span class="text-xs text-[#99a1af]">Uptime: 99.99%</span>
              </div>
              <div
                style="box-shadow: 0 0 10px 1px #22c55e;"
                class="size-2.5 bg-[#22c55e] rounded-full ms-auto mb-auto mt-2">
              </div>
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
            class="border border-[#F97316]/15 rounded-[14px] flex flex-col py-6 gap-7 bg-[#F97316]/5">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div class="flex justify-center items-center size-12 rounded-2xl bg-[#F97316]/10">
                <img src="/icons/memory.svg" alt="memory" />
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">US-East-Cluster-01</span>
                <span class="text-xs text-[#F97316]">Uptime: 99.99%</span>
              </div>
              <div
                style="box-shadow: 0 0 8px 0.5px #F97316;"
                class="size-2.5 bg-[#F97316] rounded-full ms-auto mb-auto mt-2">
              </div>
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
        </div>
      </div>
    {/each}
  </div>
</div>
