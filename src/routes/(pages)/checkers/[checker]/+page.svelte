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
  import ConfirmEditConfig from '../../../../components/pages/checker/ConfirmEditConfig.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { goto } from '$app/navigation';

  const REQUIRED_COUNT = $state(innerWidth < 640 ? 31 : 96);
  const id = $page.params.checker;
  let data = $state();
  let hours = $state(24);
  let enabled = $state();
  let date = $state(null);
  let histogram = $state();
  let history = $state();
  let missingCount = $derived(Math.max(0, REQUIRED_COUNT - (history?.data?.length ?? 0)));
  let historyDetail = $state();
  let apdex = $state();
  let summary = $state();
  let summaryWithDate = $state();

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  function getMonthName(month) {
    return MONTHS[month - 1];
  }

  onMount(() => {
    if (!date) {
      http
        .get(endpoints.checkHistory(id), {
          params: { short: true, detail: true, page_size: REQUIRED_COUNT },
        })
        .then(res => (history = { ...res.data, data: res.data?.data.slice(-REQUIRED_COUNT) }));

      http.get(endpoints.singleCheck(id)).then(res => {
        data = res.data?.data;
        enabled = res.data?.data.enabled;
      });
      http.get(endpoints.checkHistogram(id)).then(
        res =>
          (histogram = {
            ...res.data?.data,
            max_count: Math.max(...res.data?.data?.histogram.map(i => i.count), 1),
          }),
      );
    }

    http.get(endpoints.checkSummaryYearly(id)).then(res => (summary = res.data?.data));
  });

  function nextDate(data, year, month, day) {
    const maxDay = Object.keys(
      data.filter(item => Number(item.month) === Number(month))[0].history,
    ).length;
    let nextDay = Number(day);
    let nextMonth = Number(month);
    let nextYear = Number(year);
    if (Number(day) === maxDay) {
      nextDay = 1;
      if (nextMonth === 12) {
        nextMonth = 1;
        nextYear = nextYear + 1;
      } else {
        nextMonth = nextMonth + 1;
      }
    } else {
      nextDay = nextDay + 1;
    }

    goto(`/checkers/${id}?year=${nextYear}&month=${nextMonth}&day=${nextDay}`);
  }

  function preDate(data, year, month, day) {
    let perDay = Number(day);
    let perMonth = Number(month);
    let perYear = Number(year);

    if (perDay === 1) {
      if (perMonth === 1) {
        perMonth = 12;
        perYear = perYear - 1;
      } else {
        perMonth = perMonth - 1;
      }
      const prevMonthData = data.find(
        item => Number(item.year) === perYear && Number(item.month) === perMonth,
      );

      if (prevMonthData && prevMonthData.history) {
        const daysInMonth = Math.max(...Object.keys(prevMonthData.history).map(Number));
        perDay = daysInMonth;
      } else {
        return;
      }
    } else {
      perDay = perDay - 1;
    }

    goto(`/checkers/${id}?year=${perYear}&month=${perMonth}&day=${perDay}`);
  }
  $effect(() => {
    const year = $page.url.searchParams.get('year');
    let month = $page.url.searchParams.get('month');
    let day = $page.url.searchParams.get('day');

    if (month?.length < 2) month = `0${month}`;
    if (day?.length < 2) day = `0${day}`;

    if (year && month && day) {
      historyDetail = null;
      date = { year, month, day };
      http.get(endpoints.checksSummaryDate(id, `${year}-${month}-${day}`)).then(res => {
        summaryWithDate = {
          ...res.data?.data,
          histogram: {
            ...res.data?.data?.histogram,
            max_count: Math.max(...res.data?.data?.histogram.buckets.map(i => i.count), 1),
          },
        };
      });
    } else {
      date = null;
    }
    //---
    http.get(endpoints.checkApdexHistory(id), { params: { hours } }).then(
      res =>
        (apdex = {
          ...res.data?.data,
          apdex_series: res.data?.data?.apdex_series.reverse().slice(-96),
        }),
    );
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start relative">
        <div class="flex flex-col justify-center items-start">
          <span class="text-black dark:text-white text-xl capitalize">{data?.name}</span>

          <span
            class="flex justify-center items-center text-nowrap tracking-wider text-white/40 text-sm"
            >{data?.target}</span>
        </div>
        {#if date}
          <div
            class="flex items-center justify-between px-3 gap-4 bg-white/5 text-sm absolute top-0 rounded-md start-1/2 -translate-x-1/2 min-w-40 h-9.5 shadow-sm shadow-[#3b82f6]/50">
            <!-- Prev -->

            <button
              aria-label="prev date"
              onclick={() => {
                preDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7" />
              </svg></button>

            <!-- Date -->
            <div class="px-4 py-1.5 rounded-lg tracking-wide text-nowrap text-[#3b82f6]">
              {getMonthName($page.url.searchParams.get('month'))}
              {$page.url.searchParams.get('day')} , {$page.url.searchParams.get('year')}
            </div>

            <!-- Next -->
            <button
              aria-label="next date"
              onclick={() => {
                nextDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg></button>
          </div>
        {/if}

        {#if date}
          <button
            onclick={() => {
              goto(`/checkers/${id}`);
            }}
            class="flex items-center gap-2 ps-4 bg-emerald-500/10 animate-pulse hover:animate-none pe-2.5 h-8 text-xs rounded-full outline outline-offset-1 outline-emerald-500/60 text-emerald-400 cursor-pointer">
            Back to Today
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
        {:else}
          <div class="flex justify-center items-center gap-3">
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
                <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
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
                <img src="/icons/edit.png" alt="edit" width="24" height="24" />
              </button>
            </div>

            <div class="h-9 w-px bg-white/20"></div>
            {#key enabled}
              <div
                class="py-2 w-30 flex justify-center items-center gap-2 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#e5e7eb] dark:border-white/5 rounded-[14px]">
                <span class="text-xs text-[#99a1af]">
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onclick={() => {
                    if (enabled) {
                      opener({
                        id: 'confirm-edit',
                        content: ConfirmEditConfig,
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
                  class="w-11 h-6 bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full relative cursor-pointer">
                  <div
                    style="box-shadow: 0 5px 30px #00bc7d;"
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full bg-[#00bc7d] transition-transform duration-300 ease-in-out {enabled
                      ? 'translate-x-5'
                      : 'translate-x-0'}">
                  </div>
                </button>
              </div>
            {/key}
          </div>
        {/if}
      </div>

      <div class="flex flex-col gap-4 w-full">
        <div
          class="relative flex flex-col p-6 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {date
            ? 'h-43'
            : 'h-35'}">
          <div class="w-full flex justify-between items-start">
            <div class="w-fit flex flex-col justify-start items-start">
              <span class="text-lg text-black dark:text-white">Uptime</span>
              <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                <span class="flex justify-center items-center text-nowrap"
                  >{date ? 'Date : ' + summaryWithDate?.date : 'Last Check :'}</span>

                {#if !date}
                  <span class="flex justify-center items-center text-nowrap tracking-wider">
                    {new Date(history?.last_checked).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}</span>
                {/if}
              </div>
            </div>
            {#if date}
              <span
                class="text-2xl {summaryWithDate?.overall.uptime_percent
                  ? summaryWithDate?.overall.uptime_percent >= 90
                    ? 'text-[#008236]'
                    : summaryWithDate?.overall.uptime_percent >= 80
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall.uptime_percent >= 70
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall.uptime_percent >= 50
                          ? 'text-[#F97316]'
                          : 'text-[#EF4444]'
                  : 'text-white/20'}">
                {summaryWithDate?.overall.uptime_percent
                  ? summaryWithDate?.overall.uptime_percent + '%'
                  : 'No Data'}
              </span>
            {:else}
              <span
                class="text-2xl {history?.uptime_percent >= 90
                  ? 'text-[#008236]'
                  : history?.uptime_percent >= 80
                    ? 'text-[#00D492]'
                    : history?.uptime_percent >= 70
                      ? 'text-[#FDC700]'
                      : history?.uptime_percent >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}">
                {history?.uptime_percent}%
              </span>
            {/if}
          </div>

          <div
            class=" w-full z-10 flex flex-row-reverse gap-0.5 justify-between items-end absolute start-1/2 -translate-x-1/2 px-6 {date
              ? 'bottom-14'
              : 'bottom-6'}">
            {#if !date}
              {#each history?.data as detail (detail[0])}
                {@const status = detail[1]}

                <button
                  type="button"
                  aria-label="detail of status"
                  onmouseover={() => {
                    if (!date) {
                      http
                        .get(endpoints.checkHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onmouseleave={() => {
                    if (!date) {
                      historyDetail = null;
                    }
                  }}
                  onfocus={() => {
                    if (!date) {
                      http
                        .get(endpoints.checkHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onblur={() => {
                    if (!date) {
                      historyDetailDetail = null;
                    }
                  }}
                  class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
                    'error' || status === 'down'
                    ? 'bg-[#EF4444]'
                    : status === 'timeout'
                      ? 'bg-[#F97316]'
                      : status === 'up'
                        ? 'bg-green-700'
                        : 'bg-[#FFFFFF]/10'}">
                  {#if historyDetail}
                    <div
                      class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                      <div class="w-full flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Status :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap capitalize {historyDetail?.status ===
                            'error' || historyDetail?.status === 'down'
                            ? 'text-[#F87171]'
                            : historyDetail?.status === 'timeout'
                              ? 'text-[#F97316]'
                              : historyDetail?.status === 'up'
                                ? 'text-green-700'
                                : ''}">{historyDetail?.status}</span>
                      </div>
                      {#if historyDetail?.response_time_ms}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Latency :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {responseTimeColor(
                              historyDetail?.response_time_ms,
                            )}">{historyDetail?.response_time_ms} ms</span>
                        </div>
                      {/if}
                      {#if historyDetail?.status_code}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Status Code :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {historyDetail?.status ===
                              'error' || historyDetail?.status === 'down'
                              ? 'text-[#F87171]'
                              : historyDetail?.status === 'up'
                                ? 'text-green-700'
                                : ''}">{historyDetail?.status_code}</span>
                        </div>
                      {/if}
                      {#if historyDetail?.error_message}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Error Message :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#F87171]"
                            >{historyDetail?.error_message}</span>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-sm pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                        {new Date(historyDetail?.checked_at).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    </div>
                  {/if}
                </button>
              {/each}
              {#each Array(missingCount) as _, i}
                <div
                  aria-hidden="true"
                  class="w-4 h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
                </div>
              {/each}
            {:else}
              {#each summaryWithDate?.uptime_series as uptime, i}
                <button
                  type="button"
                  aria-label="detail of status"
                  class="w-full h-6 transition-all cursor-pointer relative group {uptime
                    ? uptime >= 90
                      ? 'hover:bg-[#008236]/70 bg-[#008236]'
                      : uptime >= 80
                        ? 'hover:bg-[#00D492]/70 bg-[#00D492]'
                        : uptime >= 70
                          ? 'hover:bg-[#FDC700]/70 bg-[#FDC700]'
                          : uptime >= 50
                            ? 'hover:bg-[#F97316]/70 bg-[#F97316]'
                            : 'hover:bg-[#EF4444]/70 bg-[#EF4444]'
                    : 'bg-white/10'}">
                  <div
                    class="absolute top-1/2 start-1/2 -translate-1/2 text-xs text-white transition-all">
                    {uptime && uptime + '%'}
                  </div>

                  <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>

                  <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                    {(summaryWithDate.uptime_series.length - i).toString().padStart(2, '0')}:00
                  </div>
                </button>
              {/each}

              <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full px-6">
                <div class="h-px w-full bg-white/10"></div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      {#if !date}
        <div
          class="flex mx-auto sticky top-6 shadow-sm shadow-[#3b82f6]/50 z-20 text-white/20 w-88 py-2 justify-between px-5 text-sm items-center rounded-lg dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
          <button
            onclick={() => (hours = 1)}
            class="transition-all duration-300 {hours === 1 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >1h</button>

          <div class="h-5 w-px bg-white/20"></div>
          <button
            onclick={() => (hours = 3)}
            class="transition-all duration-300 {hours === 3 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >3h</button>
          <div class="h-5 w-px bg-white/20"></div>
          <button
            onclick={() => (hours = 6)}
            class="transition-all duration-300 {hours === 6 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >6h</button>
          <div class="h-5 w-px bg-white/20"></div>
          <button
            onclick={() => (hours = 12)}
            class="transition-all duration-300 {hours === 12 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >12h</button>
          <div class="h-5 w-px bg-white/20"></div>
          <button
            onclick={() => (hours = 24)}
            class="transition-all duration-300 {hours === 24 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >24h</button>
        </div>
        <Latency {hours} {id} name={data?.name} />
      {/if}

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between items-start">
          <div class="w-fit flex flex-col justify-start items-start">
            <span class="text-lg text-black dark:text-white"> Apdex history</span>

            {#if date ? summaryWithDate?.overall?.total_satisfied || summaryWithDate?.overall?.total_tolerating || summaryWithDate?.overall?.total_frustrated : apdex?.total_satisfied || apdex?.total_tolerating || apdex?.total_frustrated}
              <div class="flex justify-start items-center gap-1">
                <span class="text-sm text-[#99a1af]">Detail Information</span>

                <button class="group relative">
                  <img
                    class="cursor-pointer"
                    width="20"
                    height="20"
                    src="/icons/question.png"
                    alt="question" />
                  <div
                    class="absolute *:text-nowrap bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm ms-2 start-full bottom-0 border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
                    {#if date ? summaryWithDate?.overall?.total_satisfied : apdex?.total_satisfied}
                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>Total Satisfied :</span>
                        <span class="text-white"
                          >{date
                            ? summaryWithDate?.overall?.total_satisfied
                            : apdex?.total_satisfied}</span>
                      </div>
                    {/if}
                    {#if date ? summaryWithDate?.overall?.total_tolerating : apdex?.total_tolerating}
                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>Total Tolerating :</span>
                        <span class="text-white">
                          {date
                            ? summaryWithDate?.overall?.total_tolerating
                            : apdex?.total_tolerating}</span>
                      </div>
                    {/if}
                    {#if date ? summaryWithDate?.overall?.total_frustrated : apdex?.total_frustrated}
                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>Total Frustrated :</span>
                        <span class="text-white">
                          {date
                            ? summaryWithDate?.overall?.total_frustrated
                            : apdex?.total_frustrated}</span>
                      </div>
                    {/if}
                  </div>
                </button>
              </div>{/if}
          </div>

          {#if date}
            {#if summaryWithDate?.overall?.apdex_score}
              <div class="flex text-2xl justify-end gap-2 items-center">
                <span
                  class={summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'excellent'
                    ? 'text-green-500'
                    : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}>
                  {summaryWithDate?.overall?.apdex_rating}
                </span>

                <span class="h-7 w-px bg-white/15"></span>

                <span
                  class={summaryWithDate?.overall?.apdex_score >= 90
                    ? 'text-[#008236]'
                    : summaryWithDate?.overall?.apdex_score >= 80
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.apdex_score >= 70
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.apdex_score >= 50
                          ? 'text-[#F97316]'
                          : 'text-[#EF4444]'}>
                  {summaryWithDate?.overall?.apdex_score}%</span>
              </div>
            {:else}
              <span class="text-white/20 text-2xl"> No Data </span>
            {/if}
          {:else if apdex?.apdex_score}
            <div class="flex text-2xl justify-end gap-2 items-center">
              <span
                class={apdex?.apdex_rating?.toLowerCase() === 'excellent'
                  ? 'text-green-500'
                  : apdex?.apdex_rating?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : apdex?.apdex_rating?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : apdex?.apdex_rating?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}>
                {apdex?.apdex_rating}
              </span>

              <span class="h-7 w-px bg-white/15"></span>

              <span
                class={summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 90
                  ? 'text-[#008236]'
                  : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 80
                    ? 'text-[#00D492]'
                    : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 70
                      ? 'text-[#FDC700]'
                      : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}>
                {summaryWithDate?.overall?.apdex_score || apdex?.apdex_score}%</span>
            </div>
          {:else}
            <span class="text-white/20 text-2xl"> No Data </span>
          {/if}
        </div>

        <div
          class="relative w-full z-10 flex gap-0.5 justify-start items-end {date
            ? ''
            : 'flex-row-reverse'}">
          <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>

          {#each date ? summaryWithDate?.apdex_series : apdex?.apdex_series as detail, i}
            <div
              style="height: {detail?.apdex_score / 2}px;"
              class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.apdex_rating?.toLowerCase() ===
              'excellent'
                ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                : detail?.apdex_rating?.toLowerCase() === 'good'
                  ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                  : detail?.apdex_rating?.toLowerCase() === 'fair'
                    ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                    : detail?.apdex_rating?.toLowerCase() === 'poor'
                      ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                      : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
              {#if i !== 0 && i % (date ? 1 : 3) === 0}
                <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                  <div class="relative">
                    <div
                      class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                      {date
                        ? detail?.start_time?.slice(0, 5)
                        : new Date(detail?.start_time).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                    </div>
                  </div>
                </div>
              {/if}

              {#if date && summaryWithDate?.apdex_series.length - 1 === i}
                <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
                  <div class="relative">
                    <div
                      class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                      {date
                        ? detail?.end_time
                        : new Date(detail?.end_time).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                    </div>
                  </div>
                </div>
              {/if}
              <div
                class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Apdex Rating :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.apdex_rating?.toLowerCase() ===
                    'excellent'
                      ? 'text-green-500'
                      : detail?.apdex_rating?.toLowerCase() === 'good'
                        ? 'text-[#00D492]'
                        : detail?.apdex_rating?.toLowerCase() === 'fair'
                          ? 'text-[#FDC700]'
                          : detail?.apdex_rating?.toLowerCase() === 'poor'
                            ? 'text-[#F97316]'
                            : 'text-[#F87171]'}">{detail?.apdex_rating}</span>
                </div>
                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Apdex Score :</span>
                  <span
                    class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.apdex_rating?.toLowerCase() ===
                    'excellent'
                      ? 'text-green-500'
                      : detail?.apdex_rating?.toLowerCase() === 'good'
                        ? 'text-[#00D492]'
                        : detail?.apdex_rating?.toLowerCase() === 'fair'
                          ? 'text-[#FDC700]'
                          : detail?.apdex_rating?.toLowerCase() === 'poor'
                            ? 'text-[#F97316]'
                            : 'text-[#F87171]'}">{detail?.apdex_score}%</span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Total Satisfied :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.total_satisfied}</span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Total Tolerating :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.total_tolerating}</span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Total Frustrated :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.total_frustrated}</span>
                </div>

                <div
                  class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>From</span>
                    <span class="text-white/30">
                      {date
                        ? detail.start_time
                        : `:${new Date(detail?.start_time).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}`}</span>
                  </div>

                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Until</span>
                    <span class="text-white/30">
                      {date
                        ? detail?.end_time
                        : `:${new Date(detail?.end_time).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}`}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
          {#if date && !summaryWithDate?.overall.apdex_score}
            {#each Array(24) as _, i}
              <div aria-hidden="true" class="w-full h-6 rounded-[1px] bg-white/10 relative">
                <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
                <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                  {(i + 1).toString().padStart(2, '0')}:00
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between w-full items-start">
          <div class="flex flex-col">
            <span class="text-black dark:text-white text-xl">Apdex Histogram</span><span
              class="text-sm text-[#99a1af]">Application health reflected in Apdex levels</span>
          </div>
          {#if date && !(summaryWithDate?.histogram?.error_count || summaryWithDate?.histogram?.buckets.some(item => item?.count))}
            <span class="text-2xl text-white/20"> No Data </span>
          {/if}
        </div>
        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end mt-4">
          <div class="absolute -bottom-1 w-full h-px bg-white/15"></div>

          {#each date ? summaryWithDate?.histogram?.buckets : histogram?.histogram as detail, i}
            <div
              style="height: {(detail?.count /
                (date ? summaryWithDate?.histogram?.max_count : histogram?.max_count)) *
                100}px;"
              class="border-t-4 rounded-t-xs cursor-pointer relative transition-all {detail?.range_end ===
              -1
                ? 'w-[5%] bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'
                : detail?.range_end === 400
                  ? 'w-[5%] bg-green-700 border-t-green-900 hover:bg-green-800'
                  : detail?.range_end === 1600
                    ? 'w-[15%] bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.range_end === 4800
                      ? 'w-[35%] bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.range_end === 8000
                        ? 'w-[35%] bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : ''}">
              <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-sm text-white">
                {detail?.count}
              </div>
              {#if detail?.range_start !== 0}
                <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
                <div class="absolute -bottom-7 text-xs -start-3 text-white/20 text-nowrap">
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
            class="border-t-4 w-[5%] rounded-t-xs cursor-pointer relative bg-[#410000] border-t-[#4b0000] hover:bg-[#410000]/70">
            <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-sm text-white">
              {date ? summaryWithDate?.histogram?.error_count : histogram?.error_count}
            </div>
            <div class="absolute -bottom-3 text-xs -start-px bg-white/15 h-2 w-px"></div>
            <div class="absolute -bottom-3 text-xs end-0 bg-white/15 h-2 w-px"></div>
            <div class="absolute -bottom-7 text-xs -start-3 text-white/20 text-nowrap">+8ms</div>
            <div class="absolute -bottom-7 text-xs -end-1 text-white/20 text-nowrap">Errors</div>
          </div>
        </div>
      </div>

      <div
        class="w-full grid grid-cols-6 gap-8 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
        {#each summary as item, i}
          {@const historyMap = new Map(Object.entries(item?.history ?? {}))}
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center w-full border-b border-b-white/15 pb-1">
              <span class="text-sm text-white"> {getMonthName(item.month)}</span>
              <div class="flex flex-col">
                <div
                  class="text-xs items-center justify-end gap-1 flex {item?.apdex_rate?.toLowerCase() ===
                  'excellent'
                    ? 'text-green-500'
                    : item?.apdex_rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : item?.apdex_rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : item?.apdex_rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}">
                  {#if item?.apdex_score === 0}
                    <span class="text-white/20 text-xs">No Data</span>
                  {:else}
                    <span class="opacity-50"> {item?.apdex_rate}</span>
                    <span class="bg-white/15 w-px h-4"></span>
                    <span> {item?.apdex_score}%</span>
                  {/if}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-7 grid-rows-5 gap-4 w-full">
              <div style="grid-column: span {new Date(item.year, item.month - 1, 1).getDay()};">
              </div>
              {#each historyMap as [day, value], i}
                {@const isSpecialModeWithDate =
                  date &&
                  Number(date?.year) === Number(item?.year) &&
                  Number(date?.month) === Number(item?.month) &&
                  Number(date?.day) === Number(day)}
                <button
                  onclick={() => {
                    const newUrl = new URL($page.url);
                    newUrl.searchParams.set('year', item?.year);
                    newUrl.searchParams.set('month', item?.month);
                    newUrl.searchParams.set('day', day);

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
                            ? 'rgba(0, 212, 146, 0.4)'
                            : value >= 70
                              ? 'rgba(253, 199, 0, 0.4)'
                              : value >= 50
                                ? 'rgba(249, 115, 22, 0.4)'
                                : 'rgba(239, 68, 68, 0.4)'
                      };`
                    : ''}
                  class="text-white aspect-square transition-all w-full flex items-center justify-center relative border border-white/15 group {isSpecialModeWithDate
                    ? 'animate-pulse'
                    : 'cursor-pointer'} {value >= 90
                    ? 'bg-[#008236]'
                    : value >= 80
                      ? 'bg-[#00D492]'
                      : value >= 70
                        ? 'bg-[#FDC700]'
                        : value >= 50
                          ? 'bg-[#F97316]'
                          : value !== null
                            ? 'bg-[#EF4444]'
                            : ' shadow-inner shadow-white/5 cursor-default!'} ">
                  <div
                    class="hidden absolute min-w-40 text-sm -top-20 border border-white/15 px-3 py-2 flex-col gap-1 bg-black/80 backdrop-blur-2xl rounded-xl z-10 {value !==
                      null && !isSpecialModeWithDate
                      ? 'group-hover:flex'
                      : ''}">
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
                                : 'text-[#EF4444]'}">{value}%</span>
                    </div>

                    <span
                      class="text-white/30 text-nowrap border-t pt-1 border-t-white/15 text-start"
                      >{item?.year}/{item?.month}/{day}</span>
                  </div>
                  <span class="absolute start-1/2 top-1/2 -translate-1/2">-</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
