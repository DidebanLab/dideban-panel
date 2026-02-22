<script>
  import UptimeHistoryAll from './../../../../components/common/UptimeHistoryAll.svelte';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';
  import { onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import UptimeHistoryBox from '../../../../components/common/UptimeHistoryBox.svelte';
  import DeleteChecker from '../../../../components/pages/checker/DeleteChecker.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor';
  import ConfirmEditConfig from '../../../../components/pages/checker/ConfirmEditConfig.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';

  const id = $page.params.checker;
  let data = $state();
  let timeRange = $state(24);
  let enabled = $state();

  let histogram = $state();
  let isMobile = $state(innerWidth < 640);
  let history = $state();

  let summary = $state();

  let uptimeData = $state([
    {
      month: 'January',
      average: 90,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'February',
      average: 95,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94,
      ],
    },
    {
      month: 'March',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'April',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'May',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'June',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'July',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'August',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'September',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'October',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'November',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'December',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
  ]);

  // onMount(() => {
  //   http.get(endpoints.uptimeHistory + name).then(res => {
  //     uptimeData = res.data;
  //   });
  // });

  // $effect(() => {
  //   http.post(endpoints.performanceOverview, { agent_id: $page.params.checker }).then(res => (data = res.data));
  // });

  const statusColorHandler = status => {
    switch (status) {
      case 'up':
        return 'text-[#00bc7d]';

      case 'down':
        return 'text-[#F87171]';

      case 'error':
        return 'text-[#F87171]';

      case 'warn':
        return 'text-[#F97316]';
    }
  };

  onMount(() => {
    http.get(endpoints.checks + `/${id}`).then(res => {
      data = res.data?.data;
      enabled = res.data?.data.enabled;
    });
    http.get(endpoints.checks + `/${id}/summery`).then(res => (summary = res.data?.data));
    http
      .get(endpoints.checks + `/${id}/histogram`)
      .then(res => (histogram = res.data?.data?.histogram));
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start">
        <div class="flex flex-col justify-center items-start">
          <span class="text-black dark:text-white text-xl capitalize">{data?.name}</span>

          <div class="flex gap-1.25 justify-start items-center">
            <div class="flex justify-center items-center p-1 bg-white/10 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 50 50">
                <path
                  d="M0 0 C3 2 3 2 5 5 C5.86581772 9.4012401 6.01108378 11.47398762 3.52734375 15.22265625 C-2.95356484 22.8043561 -2.95356484 22.8043561 -7.04296875 23.1953125 C-7.75066406 23.17210938 -8.45835938 23.14890625 -9.1875 23.125 C-10.445625 23.08375 -11.70375 23.0425 -13 23 C-12.67 22.01 -12.34 21.02 -12 20 C-10.948125 19.731875 -9.89625 19.46375 -8.8125 19.1875 C-4.28625582 17.77768624 -1.62364229 15.95880545 1 12 C1.66887173 8.82876903 1.66887173 8.82876903 1 6 C-0.86218169 3.77298541 -0.86218169 3.77298541 -3.6875 3.4375 C-8.61362869 4.27401242 -11.10325139 7.04085547 -14 11 C-15.04798094 13.39142787 -15.52415422 15.40928408 -16 18 C-16.66 18 -17.32 18 -18 18 C-18.52300693 14.86195844 -18.64665842 12.12712428 -18 9 C-13.26581233 2.5148114 -8.27480357 -1.36067516 0 0 Z"
                  fill="#99a1af"
                  transform="translate(41,4)" />
                <path
                  d="M0 0 C1.8871875 0.061875 1.8871875 0.061875 3.8125 0.125 C3.4825 1.115 3.1525 2.105 2.8125 3.125 C1.760625 3.393125 0.70875 3.66125 -0.375 3.9375 C-4.90124418 5.34731376 -7.56385771 7.16619455 -10.1875 11.125 C-10.85637173 14.29623097 -10.85637173 14.29623097 -10.1875 17.125 C-8.32531831 19.35201459 -8.32531831 19.35201459 -5.5 19.6875 C-0.57387131 18.85098758 1.91575139 16.08414453 4.8125 12.125 C5.86048094 9.73357213 6.33665422 7.71571592 6.8125 5.125 C7.4725 5.125 8.1325 5.125 8.8125 5.125 C9.65080986 11.83147887 9.65080986 11.83147887 7.359375 15.3671875 C0.79088303 22.90163417 0.79088303 22.90163417 -5.0625 23.5625 C-8.40397704 23.45769352 -9.24568326 23.08621116 -12.1875 21.125 C-14.22910423 18.06259365 -15.0346899 15.96472834 -14.81640625 12.25390625 C-12.95928324 5.96737184 -6.66224659 -0.21843431 0 0 Z"
                  fill="#99a1af"
                  transform="translate(18.1875,22.875)" />
                <path
                  d="M0 0 C-0.49685857 4.25310932 -2.91961357 6.32031258 -5.875 9.25 C-6.75929688 10.14203125 -7.64359375 11.0340625 -8.5546875 11.953125 C-11 14 -11 14 -14 14 C-13.50314143 9.74689068 -11.08038643 7.67968742 -8.125 4.75 C-7.24070312 3.85796875 -6.35640625 2.9659375 -5.4453125 2.046875 C-3 0 -3 0 0 0 Z"
                  fill="#99a1af"
                  transform="translate(32,18)" />
              </svg>
            </div>
            <span
              class="flex justify-center items-center text-nowrap tracking-wider text-white/40 text-sm"
              >{data?.target}</span>
          </div>
        </div>

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
                  props: { data },
                });
              }}>
              <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
            <button
              class="cursor-pointer"
              aria-label="edit config"
              type="button"
              onclick={() => {
                opener({
                  id: 'edit-checker',
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
                        checkerId: data?.id,
                        name: data?.name,
                      },
                    });
                  } else {
                    http
                      .patch(`${endpoints.checks}/${data?.id}`, {
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
      </div>

      <div class="flex flex-col gap-4 w-full">
        {#await http.get( endpoints.checkHistory(id), { params: { short: true, page_size: isMobile ? 31 : 96 } }, ) then res}
          {@const REQUIRED_COUNT = isMobile ? 31 : 96}
          {@const items = res.data.data.slice(-REQUIRED_COUNT)}
          {@const missingCount = REQUIRED_COUNT - items.length}
          {@const error =
            items[0][1]?.toLowerCase() === 'error' || items[0][1]?.toLowerCase() === 'down'}
          {@const warn = items[0][1]?.toLowerCase() === 'timeout'}
          {@const ok = items[0][1]?.toLowerCase() === 'up'}

          <div
            class="relative flex flex-col h-35 p-6 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
            <div class="w-full flex justify-between items-start">
              <div class="w-fit flex flex-col justify-start items-start">
                <span class="text-lg text-black dark:text-white">Uptime</span>
                <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                  <span class="flex justify-center items-center text-nowrap">Last Check :</span>
                  <span class="flex justify-center items-center text-nowrap tracking-wider">
                    {new Date(data?.last_checked).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}</span>
                </div>
              </div>
              <span
                class="text-2xl {summary?.summary?.uptime_percent >= 90
                  ? 'text-[#008236]'
                  : summary?.summary?.uptime_percent >= 80
                    ? 'text-[#00D492]'
                    : summary?.summary?.uptime_percent >= 70
                      ? 'text-[#FDC700]'
                      : summary?.summary?.uptime_percent >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}">
                {summary?.summary?.uptime_percent}%
              </span>
            </div>

            <div
              class=" w-full z-10 flex flex-row-reverse gap-0.5 justify-between items-end absolute bottom-6 start-1/2 -translate-x-1/2 px-6">
              {#each items as detail (detail[0])}
                {@const status = detail[1]}

                <button
                  type="button"
                  aria-label="detail of status"
                  onmouseover={() => {
                    http
                      .get(`${endpoints.checkHistory(id)}/${detail[0]}`)
                      .then(res => (history = res.data.data));
                  }}
                  onmouseleave={() => {
                    history = null;
                  }}
                  onfocus={() => {
                    http
                      .get(`${endpoints.checkHistory(id)}/${detail[0]}`)
                      .then(res => (history = res.data.data));
                  }}
                  onblur={() => {
                    history = null;
                  }}
                  class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
                    'error' || status === 'down'
                    ? 'bg-[#EF4444]'
                    : status === 'timeout'
                      ? 'bg-[#F97316]'
                      : status === 'up'
                        ? 'bg-green-700'
                        : 'bg-[#FFFFFF]/10'}">
                  {#if history}
                    <div
                      class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                      <div class="w-full flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Status :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap capitalize {history?.status ===
                            'error' || history?.status === 'down'
                            ? 'text-[#F87171]'
                            : history?.status === 'timeout'
                              ? 'text-[#F97316]'
                              : history?.status === 'up'
                                ? 'text-green-700'
                                : ''}">{history?.status}</span>
                      </div>
                      {#if history?.response_time_ms}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Latency :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {responseTimeColor(
                              history?.response_time_ms,
                            )}">{history?.response_time_ms} ms</span>
                        </div>
                      {/if}
                      {#if history?.status_code}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Status Code :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {history?.status ===
                              'error' || history?.status === 'down'
                              ? 'text-[#F87171]'
                              : history?.status === 'up'
                                ? 'text-green-700'
                                : ''}">{history?.status_code}</span>
                        </div>
                      {/if}
                      {#if history?.error_message}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Error Message :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#F87171]"
                            >{history?.error_message}</span>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-sm pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                        {new Date(history?.checked_at).toLocaleString('en-CA', {
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
            </div>
          </div>
        {/await}
      </div>

      <div
        class="flex mx-auto sticky top-6 shadow-sm shadow-[#3b82f6]/50 z-200 text-white/20 w-88 py-2 justify-between px-5 text-sm items-center rounded-lg dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <button
          onclick={() => (timeRange = 1)}
          class="transition-all duration-300 {timeRange === 1
            ? 'text-[#3b82f6]'
            : 'cursor-pointer'}">1h</button>

        <div class="h-5 w-px bg-white/20"></div>
        <button
          onclick={() => (timeRange = 3)}
          class="transition-all duration-300 {timeRange === 3
            ? 'text-[#3b82f6]'
            : 'cursor-pointer'}">3h</button>
        <div class="h-5 w-px bg-white/20"></div>
        <button
          onclick={() => (timeRange = 6)}
          class="transition-all duration-300 {timeRange === 6
            ? 'text-[#3b82f6]'
            : 'cursor-pointer'}">6h</button>
        <div class="h-5 w-px bg-white/20"></div>
        <button
          onclick={() => (timeRange = 12)}
          class="transition-all duration-300 {timeRange === 12
            ? 'text-[#3b82f6]'
            : 'cursor-pointer'}">12h</button>
        <div class="h-5 w-px bg-white/20"></div>
        <button
          onclick={() => (timeRange = 24)}
          class="transition-all duration-300 {timeRange === 24
            ? 'text-[#3b82f6]'
            : 'cursor-pointer'}">24h</button>
      </div>

      <Latency
        {id}
        name={data?.name}
        subtitle={summary?.summary?.total_checks}
        averageLatency={summary?.summary?.avg_response_time} />

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between items-start">
          <div class="w-fit flex flex-col justify-start items-start">
            <span class="text-lg text-black dark:text-white"> Apdex history</span>
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
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Total Satisfied :</span>
                    <span class="text-white">{summary?.summary?.total_satisfied}</span>
                  </div>
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Total Tolerating :</span>
                    <span class="text-white">{summary?.summary?.total_tolerating}</span>
                  </div>
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Total Frustrated :</span>
                    <span class="text-white">{summary?.summary?.total_frustrated}</span>
                  </div>
                </div></button>
            </div>
          </div>
          <div
            class="flex text-2xl justify-end gap-2 items-center {summary?.summary?.apdex_score >= 90
              ? 'text-[#008236]'
              : summary?.summary?.apdex_score >= 80
                ? 'text-[#00D492]'
                : summary?.summary?.apdex_score >= 70
                  ? 'text-[#FDC700]'
                  : summary?.summary?.apdex_score >= 50
                    ? 'text-[#F97316]'
                    : 'text-[#EF4444]'}">
            <span>
              {summary?.summary?.apdex_rating}
            </span>

            <span class="h-7 w-px bg-white/15"></span>

            <span> {summary?.summary?.apdex_score}%</span>
          </div>
        </div>

        <div class="relative w-full z-10 flex flex-row-reverse gap-0.5 justify-start items-end">
          <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>
          {#await http.get(endpoints.checkApdexHistory(id)) then res}
            {@const REQUIRED_COUNT = 96}
            {@const items = res.data.data?.apdex_series.reverse().slice(-REQUIRED_COUNT)}
            {@const missingCount = REQUIRED_COUNT - items.length}
            {#each items as detail, i}
              <div
                style="height: {detail?.apdex_score / 2}px;"
                class="w-full rounded-[1px] cursor-pointer relative group border-t-4 {detail?.apdex_rating?.toLowerCase() ===
                'excellent'
                  ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                  : detail?.apdex_rating?.toLowerCase() === 'good'
                    ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.apdex_rating?.toLowerCase() === 'fair'
                      ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#c19700]'
                      : detail?.apdex_rating?.toLowerCase() === 'poor'
                        ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
                {#if i % 4 === 0}
                  <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {new Date(detail?.start_time).toLocaleString('en-CA', {
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
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
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
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
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
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Total Satisfied :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.total_satisfied}</span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Total Tolerating :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.total_tolerating}</span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Total Frustrated :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.total_frustrated}</span>
                  </div>

                  <div
                    class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>From</span>
                      <span class="text-white/30">
                        :
                        {new Date(detail?.start_time).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>

                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>Until</span>
                      <span class="text-white/30">
                        :
                        {new Date(detail?.end_time).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/await}
        </div>
      </div>

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex flex-col">
          <span class="text-black dark:text-white text-xl">Apdex Histogram</span><span
            class="text-sm text-[#99a1af]">Application health reflected in Apdex levels</span>
        </div>

        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end mt-4">
          {#await http.get(endpoints.checkHistogram(id)) then res}
            {@const items = res.data?.data?.histogram}
            {@const maxCount = Math.max(...items.map(i => i.count), 1)}
            {@const getWidthSize = rangeEnd => {
              switch (rangeEnd) {
                case -1:
                  return 'w-[5%] bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]';

                case 400:
                  return 'w-[5%] bg-green-700 border-t-green-900 hover:bg-green-800';
                case 1600:
                  return 'w-[15%] bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]';
                case 4800:
                  return 'w-[35%] bg-[#FDC700] border-t-[#c79c00] hover:bg-[#c19700]';
                case 8000:
                  return 'w-[35%] bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]';
              }
            }}

            {#each items as detail, i}
              {@const height = (detail?.count / maxCount) * 100}
              <div
                style="height: {height}px;"
                class="border-t-4 rounded-t-xs cursor-pointer relative {getWidthSize(
                  detail?.range_end,
                )} ">
                <div class="absolute start-1/2 -translate-x-1/2 -top-6 text-sm text-white">
                  {detail?.count}
                </div>
                {#if detail?.range_start !== 0}
                  <div class="absolute -bottom-2 text-xs -start-px bg-white/15 h-2 w-px"></div>
                  <div class="absolute -bottom-7 text-xs -start-3 text-white/20 text-nowrap">
                    {detail?.range_start}ms
                  </div>
                {/if}
              </div>
            {/each}

            {@const height = (10 / maxCount) * 100}
            <div
              style="height: {height}px;"
              class="border-t-4 w-[5%] rounded-t-xs cursor-pointer relative bg-[#410000] border-t-[#4b0000] hover:bg-[#410000]/70">
              <div class="absolute -bottom-2 text-xs -start-px bg-white/15 h-2 w-px"></div>
              <div class="absolute -bottom-2 text-xs end-0 bg-white/15 h-2 w-px"></div>
              <div class="absolute -bottom-7 text-xs -start-3 text-white/20 text-nowrap">+8ms</div>
              <div class="absolute -bottom-7 text-xs -end-1 text-white/20 text-nowrap">Errors</div>
            </div>
          {/await}
        </div>
      </div>
      <div
        class="w-full flex flex-col justify-start items-start gap-4 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
        <div class="flex flex-col">
          <span class="text-black dark:text-white text-xl">Uptime</span><span
            class="text-sm text-[#99a1af]">History Of Uptime</span>
        </div>

        <div class="w-full grid grid-cols-5 2xl:grid-cols-7 text-white gap-4 relative">
          <div class="absolute end-0 bottom-0 flex flex-col justify-center items-end gap-2">
            <div
              class="flex justify-center items-center gap-2 text-black dark:text-white/40 text-sm">
              <span> More than 80%</span>
              <div class="size-3.5 rounded-sm bg-red-600/70"></div>
            </div>
            <div
              class="flex justify-center items-center gap-2 text-black dark:text-white/40 text-sm">
              <span> {'50% < value < 80%'}</span>
              <div class="size-3.5 rounded-sm bg-[#F97316]"></div>
            </div>
            <div
              class="flex justify-center items-center gap-2 text-black dark:text-white/40 text-sm">
              <span>less Than 51 %</span>
              <div class="size-3.5 rounded-sm bg-green-700"></div>
            </div>
          </div>

          <!-- {#each uptimeData as item (item.month)}
            <UptimeHistoryBox {name} month={item.month} average={item.average} data={item.uptime} />
          {/each} -->
        </div>
      </div>
    </div>
  </div>
</section>
