<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import getMonthName from '../../utils/getMonth';
  import { http } from '../../services/http.svelte';
  import { endpoints } from '../../endpoints.svelte';
  import getDate from '../../utils/getDate';

  let { summary, date, id, value: toDay = $bindable(), type, loading } = $props();
</script>

{#if !loading}
  <div
    class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8 sm:border border-[#0D0D0D]/5 dark:border-white/5 sm:p-6 rounded-xl mt-9 sm:mt-0">
    {#each Array(12) as _, i}
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center w-full border-b border-b-white/10 pb-1">
          <span class="bg-white/5 w-10 h-4 animate-pulse rounded-md"></span>
          <span class="bg-white/5 w-12 h-4 animate-pulse rounded-md"></span>
        </div>

        <div
          class="grid grid-cols-7 grid-rows-5 gap-1.75 lg:gap-3 xl:gap-2.25 2xl:gap-2 3xl:gap-4 w-full">
          <div style="grid-column: span {i % 2 === 0 ? 2 : 4};"></div>
          {#each Array(i % 2 === 0 ? 30 : 29), i}
            <div class="aspect-square w-full bg-white/5 animate-pulse"></div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else if summary}
  <div
    class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8 sm:border border-[#0D0D0D]/5 dark:border-white/5 sm:p-6 rounded-xl mt-9 sm:mt-0">
    {#each summary as item, i}
      {@const historyMap = new Map(Object.entries(item?.history ?? {}))}
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center w-full border-b border-b-white/15 pb-1">
          <span class="text-xs sm:text-sm text-white"> {getMonthName(item?.month)}</span>
          <div class="flex flex-col">
            <div
              class="text-xs items-center justify-end gap-1 flex {item?.uptime >= 90
                ? 'text-[#008236]'
                : item?.uptime >= 80
                  ? 'text-[#00D492]'
                  : item?.uptime >= 70
                    ? 'text-[#FDC700]'
                    : item?.uptime >= 50
                      ? 'text-[#F97316]'
                      : 'text-[#EF4444]'}">
              {#if item?.uptime === 0}
                <span class="text-white/20 text-xs">No Data</span>
              {:else}
                <span> {item?.uptime}%</span>
              {/if}
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-7 grid-rows-5 gap-1.75 lg:gap-3 xl:gap-2.25 2xl:gap-2 3xl:gap-4 w-full">
          <div style="grid-column: span {new Date(item?.year, item?.month - 1, 1).getDay()};"></div>
          {#each historyMap as [day, value], i}
            {@const isSpecialModeWithDate =
              date &&
              +date?.year === +item?.year &&
              +date?.month === +item?.month &&
              +date?.day === +day}
            <button
              onclick={() => {
                if (value === -1) {
                  goto(`/${type === 'check' ? 'checkers' : 'agents'}/${id}`, {
                    keepfocus: true,
                    noScroll: true,
                  });
                  return;
                }
                const newUrl = new URL($page.url);
                newUrl.searchParams.set('date', `${item?.year}-${item?.month}-${day}`);

                goto(newUrl, {
                  keepfocus: true,
                  noScroll: true,
                });
              }}
              style={isSpecialModeWithDate
                ? `box-shadow: 0 0 7px 4px ${
                    value >= 90
                      ? 'rgba(0, 130, 54, 0.4)'
                      : value >= 80
                        ? '#00863864'
                        : value >= 70
                          ? 'rgba(253, 199, 0, 0.4)'
                          : value >= 50
                            ? 'rgba(249, 115, 22, 0.4)'
                            : 'rgba(239, 68, 68, 0.4)'
                  };`
                : ''}
              class="text-white aspect-square transition-all w-full flex items-center justify-center relative border border-white/15 group {isSpecialModeWithDate
                ? 'animate-pulse'
                : 'cursor-pointer'} {value
                ? value >= 90
                  ? 'bg-[#008236]'
                  : value >= 80
                    ? 'bg-[#00863864]'
                    : value >= 70
                      ? 'bg-[#FDC700]'
                      : value >= 50
                        ? 'bg-[#F97316]'
                        : value == !-1
                          ? 'bg-[#EF4444]'
                          : 'shadow-inner shadow-white/5 cursor-not-allowed! border-white/70!'
                : ' shadow-inner shadow-white/5 cursor-default!'} ">
              <div
                class="hidden absolute min-w-40 text-sm -top-20 border border-white/15 px-3 py-2 flex-col gap-1 bg-black/80 backdrop-blur-2xl rounded-xl z-10 {value !==
                  null && !isSpecialModeWithDate
                  ? 'group-hover:flex'
                  : ''}">
                {#if value === -1}
                  <span class="text-[#6a7282] text-nowrap">Today</span>
                {:else}
                  <div class="flex justify-between items-center">
                    <span class="text-[#6a7282] text-nowrap">Uptime :</span>
                    <span
                      class="text-nowrap {value >= 90
                        ? 'text-[#008236]'
                        : value >= 80
                          ? 'text-[#00D492]'
                          : value >= 70
                            ? 'text-[#FDC700]'
                            : value >= 50
                              ? 'text-[#F97316]'
                              : 'text-[#EF4444]'}"
                      >{value}%
                    </span>
                  </div>

                  <span class="text-white/30 text-nowrap border-t pt-1 border-t-white/15 text-start"
                    >{item?.year}/{item?.month}/{day}</span>
                {/if}
              </div>
              <span class="absolute start-1/2 top-1/2 -translate-1/2">-</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
