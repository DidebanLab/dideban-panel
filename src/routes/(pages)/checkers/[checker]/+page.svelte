<script>
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';
  import { onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import DeleteChecker from '../../../../components/pages/checker/DeleteChecker.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor';
  import ConfirmEditChecker from '../../../../components/pages/checker/ConfirmEditChecker.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { goto } from '$app/navigation';
  import getMonthName from '../../../../utils/getMonth';
  import getDate from '../../../../utils/getDate';
  import DateChanger from '../../../../components/common/DateChanger.svelte';
  import Uptime from '../../../../components/pages/checker/Uptime.svelte';
  import TimeRangeSelector from '../../../../components/common/TimeRangeSelector.svelte';
  import ApdexHistory from '../../../../components/pages/checker/ApdexHistory.svelte';

  const id = $page.params.checker;
  let data = $state();
  let hours = $state(24);
  let enabled = $state();
  let date = $state(null);
  let toDay = $state();
  let histogram = $state();
  let summary = $state();
  let summaryWithDate = $state();

  onMount(() => {
    http.get(endpoints.singleCheck(id)).then(res => {
      data = res.data?.data;
      enabled = res.data?.data.enabled;
    });
  });

  $effect(() => {
    if ($page.url.searchParams.get('date')) {
      date = getDate($page.url.searchParams.get('date')).string;
    } else {
      date = null;
    }
  });

  $effect(() => {
    http.get(endpoints.checkSummaryYearly(id)).then(res => {
      const current = res.data.data.find(i => Object.values(i.history).includes(-1));
      const day = Object.keys(current.history).find(key => current.history[key] === -1);
      toDay = `${current.year}-${current.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (getDate($page.url.searchParams.get('date')).string === toDay) {
        goto(`/checkers/${id}`);
      }

      summary = res.data?.data;
    });

    if (date) {
      http.get(endpoints.checksSummaryDate(id, date)).then(res => {
        summaryWithDate = {
          ...res.data?.data,
          histogram: {
            ...res.data?.data?.histogram,
            max_count: Math.max(...res.data?.data?.histogram.buckets.map(i => i.count), 1),
          },
        };
      });
    }

    //----
    http.get(endpoints.checkHistogram(id), { params: { hours } }).then(
      res =>
        (histogram = {
          ...res.data?.data,
          max_count: Math.max(...res.data?.data?.histogram.map(i => i.count), 1),
        }),
    );
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 px-6 sm:p-7.75 sm:py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 lg:border border-[#0D0D0D]/5 dark:border-white/5 lg:px-6 pt-1 pb-6 lg:py-6 lg:rounded-xl">
      <div
        class="w-full flex flex-col gap-4 lg:gap-6 lg:flex-row justify-between items-center lg:items-start relative">
        <div class="w-full flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            {#if data?.name}
              <span class="text-black dark:text-white text-lg sm:text-xl capitalize text-nowrap"
                >{data?.name}</span
              >{:else}<div class="flex justify-center items-center gap-2">
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
                <span class="text-xl text-red-500/70 mt-0.5">Check with Id {id} Not Found</span>
              </div>{/if}

            {#if data?.target}
              <span
                class="flex justify-center items-center text-nowrap tracking-wider text-white/40 text-sm"
                >{data?.target}
              </span>
            {/if}
          </div>

          {#if date}
            <button
              onclick={() => {
                goto(`/checkers/${id}`);
              }}
              class="text-nowrap flex items-center gap-1 sm:gap-2 ps-4 bg-emerald-500/10 animate-pulse hover:animate-none mt-1.25 sm:mt-0 pe-2.5 h-6 sm:h-8 text-xs rounded-full outline outline-offset-1 outline-emerald-500/60 text-emerald-400 cursor-pointer">
              <span class="hidden sm:inline">Back to </span>Today
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.25 h-3.25 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          {:else if data}
            <div
              class="flex flex-col-reverse sm:flex-row justify-start items-end sm:justify-center sm:items-center gap-1.5 sm:gap-3">
              <div class="flex justify-center items-center gap-1.75">
                <button
                  class="cursor-pointer"
                  aria-label="delete checker"
                  type="button"
                  onclick={() => {
                    opener({
                      id: 'delete-checker',
                      content: DeleteChecker,
                      props: { name: data?.name, id: data?.id },
                    });
                  }}>
                  <img
                    class="size-4 sm:size-5"
                    src="/icons/trash.png"
                    alt="trash"
                    width="20"
                    height="20" /></button>
                <button
                  class="cursor-pointer"
                  aria-label="edit config"
                  type="button"
                  onclick={() => {
                    opener({
                      id: 'edit-check',
                      content: EditChecker,
                      props: { data },
                    });
                  }}>
                  <img
                    class="size-5 sm:size-6"
                    src="/icons/edit.png"
                    alt="edit"
                    width="24"
                    height="24" />
                </button>
              </div>

              <div class="h-9 w-px bg-white/ hidden sm:block"></div>
              {#key enabled}
                <div
                  class="sm:py-2 w-fit sm:w-30 flex justify-center items-center gap-2 sm:bg-[#0D0D0D]/5 sm:dark:bg-white/5 sm:border border-[#e5e7eb] dark:border-white/5 sm:rounded-[14px] mt-1 sm:mt-0">
                  <span class=" text-[11px] sm:text-xs text-[#99a1af]">
                    {enabled ? 'Enabled' : 'Disabled'}
                  </span>

                  <button
                    onclick={() => {
                      if (enabled) {
                        opener({
                          id: 'confirm-edit',
                          content: ConfirmEditChecker,
                          props: {
                            name: data?.name,
                          },
                        });
                      } else {
                        http
                          .patch(endpoints.singleCheck(data?.id), {
                            enabled: true,
                          })
                          .then(res => {
                            alertStore.addAlert({
                              message: `Checker ${data?.name} activation updated successfully.`,
                              type: 'successful',
                            });

                            location.href = `/checkers/${data?.id}`;
                          });
                      }
                    }}
                    aria-label="activation toggle"
                    class="w-7.5 h-4 sm:w-11 sm:h-6 rounded-full relative cursor-pointer {enabled
                      ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                      : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                    <div
                      style={enabled ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                      class="absolute top-1/2 -translate-y-1/2 left-px size-3 sm:size-5 rounded-full transition-transform duration-300 ease-in-out {enabled
                        ? 'translate-x-3.25 sm:translate-x-5 bg-[#00bc7d]'
                        : 'translate-x-0 bg-[#4d4d4d]'}">
                    </div>
                  </button>
                </div>
              {/key}
            </div>
          {/if}
        </div>

        {#if date ? date : toDay}
          <DateChanger type="check" bind:value={summaryWithDate} {summary} {id} {toDay} {date} />
        {/if}
      </div>

      <Uptime {id} {date} {summaryWithDate} />

      {#if !date}
        <TimeRangeSelector bind:value={hours} interval={data?.interval_seconds} />
        <Latency {hours} {id} name={data?.name} />
      {/if}

      <ApdexHistory {id} {hours} {summaryWithDate} {date} />

      <div
        class="relative w-full flex flex-col pt-8 sm:p-6 sm:pt-6 sm:pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between w-full items-start">
          <div class="flex flex-col">
            <span class="text-black dark:text-white text-lg sm:text-xl">Apdex Histogram</span><span
              class="text-sm text-[#99a1af]">Application health reflected in Apdex levels</span>
          </div>
          {#if date ? !(summaryWithDate?.histogram?.error_count || summaryWithDate?.histogram?.buckets.some(item => item?.count)) : !histogram}
            <span class="text-2xl text-white/20"> No Data </span>
          {/if}
        </div>
        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end mt-4">
          <div class="absolute -bottom-1 w-full h-px bg-white/15"></div>

          {#each (date ? summaryWithDate?.histogram?.buckets : histogram?.histogram) || [{ range_start: 0, range_end: 400, count: 0 }, { range_start: 400, range_end: 1600, count: 0 }, { range_start: 1600, range_end: 4800, count: 0 }, { range_start: 4800, range_end: 8000, count: 0 }, { range_start: 8000, range_end: -1, count: 0 }] as detail, i}
            <div
              style="height: {(detail?.count /
                (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)) *
                100}px;"
              class="border-t-4 rounded-t-xs cursor-pointer relative transition-all {detail?.range_end ===
              -1
                ? 'w-[12%] lg:w-[10%] xl:w-[5%] bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'
                : detail?.range_end === 400
                  ? 'w-[12%] lg:w-[10%] xl:w-[5%] bg-green-700 border-t-green-900 hover:bg-green-800'
                  : detail?.range_end === 1600
                    ? 'w-[12%] lg:w-[10%] xl:w-[15%] bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.range_end === 4800
                      ? 'w-[26%] lg:w-[30%] xl:w-[35%] bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.range_end === 8000
                        ? 'w-[26%] lg:w-[30%] xl:w-[35%] bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : ''}">
              <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-xs md:text-sm text-white">
                {detail?.count}
              </div>
              {#if detail?.range_start !== 0}
                <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
                <div
                  class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
                  {detail?.range_start}ms
                </div>
              {/if}
            </div>
          {/each}

          <div
            style="height: {Boolean(
              date ? summaryWithDate?.histogram?.error_count : histogram?.error_count,
            )
              ? (10 / (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)) * 100
              : 0}px;"
            class="border-t-4 w-[12%] lg:w-[10%] xl:w-[5%] rounded-t-xs cursor-pointer relative bg-[#410000] border-t-[#4b0000] hover:bg-[#410000]/70">
            <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-xs md:text-sm text-white">
              {date ? summaryWithDate?.histogram?.error_count || 0 : histogram?.error_count || 0}
            </div>
            <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
            <div class="absolute -bottom-3 text-xs end-0 bg-white/15 h-2 w-px"></div>
            <div
              class="absolute -bottom-7 text-[9px] sm:text-xs -start-3 text-white/20 text-nowrap">
              +8s
            </div>
            <div class="absolute -bottom-7 text-[9px] sm:text-xs -end-1 text-white/20 text-nowrap">
              Errors
            </div>
          </div>
        </div>
      </div>
      {#if summary}
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
                <div style="grid-column: span {new Date(item?.year, item?.month - 1, 1).getDay()};">
                </div>
                {#each historyMap as [day, value], i}
                  {@const isSpecialModeWithDate =
                    date &&
                    Number(date?.year) === Number(item?.year) &&
                    Number(date?.month) === Number(item?.month) &&
                    Number(date?.day) === Number(day)}
                  <button
                    onclick={() => {
                      if (value === -1) {
                        goto(`/checkers/${id}`, {
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

                        <span
                          class="text-white/30 text-nowrap border-t pt-1 border-t-white/15 text-start"
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
    </div>
  </div>
</section>
