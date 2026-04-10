<script>
  import SummaryCalender from './../../../../components/common/SummaryCalender.svelte';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import DeleteChecker from '../../../../components/pages/checker/DeleteChecker.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor';
  import ConfirmEditChecker from '../../../../components/pages/checker/ConfirmEditChecker.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { goto } from '$app/navigation';
  import getDate from '../../../../utils/getDate';
  import DateChanger from '../../../../components/common/DateChanger.svelte';
  import Uptime from '../../../../components/pages/checker/Uptime.svelte';
  import TimeRangeSelector from '../../../../components/common/TimeRangeSelector.svelte';
  import ApdexHistory from '../../../../components/pages/checker/ApdexHistory.svelte';
  import ApdexHistogram from '../../../../components/pages/checker/ApdexHistogram.svelte';
  import { off, on, subscribe, unsubscribe } from '../../../../services/ws.svelte';
  import DeleteAlert from '../../../../components/common/DeleteAlert.svelte';

  const id = $page.params.checker;
  let trigger = $state(0);
  let check = $state(null);
  let hours = $state(24);
  let enabled = $state(null);
  let date = $state(null);
  let toDay = $state(null);
  let summary = $state(null);
  let summaryWithDate = $state(null);
  let isDeleted = $state(false);
  let loading = $state({ summaryWithDate: false, check: true, summaryYearly: true });

  onMount(() => {
    loading.summaryYearly = true;
    http
      .get(endpoints.checkSummaryYearly(id))
      .then(res => {
        const current = res.data.data.find(i => Object.values(i.history).includes(-1));
        const day = Object.keys(current.history).find(key => current.history[key] === -1);
        toDay = `${current.year}-${current.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        summary = res.data?.data;
      })
      .finally(() => {
        loading.summaryYearly = false;
      });

    subscribe(`checks:${id}`);
    on('check.status.changed', handleStatus);
    on('check.updated', handleUpdated);
    on('check.deleted', handleDeleted);
  });

  onDestroy(() => {
    off('check.status.changed', handleStatus);
    off('check.updated', handleUpdated);
    off('check.deleted', handleDeleted);
    unsubscribe(`checks:${id}`);
  });

  function handleStatus(data) {
    check = { ...check, status: data?.status };
  }

  function handleDeleted(data) {
    if (isDeleted) return;

    opener({
      id: 'delete-alert',
      isOutClicker: false,
      content: DeleteAlert,
      props: { type: 'check' },
    });
  }

  function handleUpdated(data) {
    http.get(endpoints.singleCheck(data?.id)).then(res => {
      check = res.data?.data;
      enabled = res.data?.data.enabled;
    });
  }

  $effect(() => {
    loading.check = true;
    const update = trigger;
    http
      .get(endpoints.singleCheck(id))
      .then(res => {
        check = res.data?.data;
        enabled = res.data?.data.enabled;
      })
      .finally(() => {
        loading.check = false;
      });
  });

  $effect(() => {
    summaryWithDate = null;
    if ($page.url.searchParams.get('date')) {
      date = getDate($page.url.searchParams.get('date')).string;
    } else {
      date = null;
    }
  });

  $effect(() => {
    if (date) {
      if (date === toDay) {
        goto(`/checkers/${id}`);
        return;
      }
      loading.summaryWithDate = true;
      http
        .get(endpoints.checksSummaryDate(id, date))
        .then(res => {
          summaryWithDate = {
            ...res.data?.data,
            histogram: {
              ...res.data?.data?.histogram,
              max_count: Math.max(...res.data?.data?.histogram.buckets.map(i => i.count), 1),
            },
          };
        })
        .finally(() => {
          loading.summaryWithDate = false;
        });
    }
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10 gap-7.75 px-6 sm:p-7.75 sm:py-2">
  <div
    class="w-full flex flex-col justify-start items-start gap-6 lg:border border-[#0D0D0D]/5 dark:border-white/5 lg:px-6 pt-1 pb-6 lg:py-6 lg:rounded-xl">
    <div
      class="w-full flex flex-col gap-4 lg:gap-6 lg:flex-row justify-between items-center lg:items-start relative">
      {#if loading.check}
        <div class="w-full flex justify-between items-start">
          <div class="flex flex-col justify-center items-start gap-2">
            <span class="bg-white/5 h-6 w-30 rounded-md animate-pulse"></span>
            <span class="bg-white/5 h-5 w-20 rounded-md animate-pulse"></span>
          </div>

          <div
            class="flex flex-col-reverse sm:flex-row justify-start items-end sm:justify-center sm:items-center gap-1.5 sm:gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <span class="size-4.5 sm:size-6 rounded-md bg-white/5 animate-pulse"></span>
              <span class="size-4.5 sm:size-6 rounded-md bg-white/5 animate-pulse"></span>
            </div>

            <div class="h-9 w-px bg-white/10 hidden sm:block animate-pulse"></div>

            <div
              class="w-19.75 sm:w-30 rounded-xl bg-white/5 mt-1 h-[16.5px] sm:h-10.5 animate-pulse">
            </div>
          </div>
        </div>

        <div
          class="bg-white/5 lg:absolute lg:top-0 rounded-md lg:start-1/2 lg:-translate-x-1/2 w-full lg:w-[194.5px] h-9.5 animate-pulse">
        </div>
      {:else}
        <div class="w-full flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            <span class="text-black dark:text-white text-lg sm:text-xl capitalize text-nowrap">
              {check?.name}
            </span>
            <div class="flex justify-between items-center gap-2">
              <span
                class="text-base capitalize {check?.status === 'error' || check?.status === 'down'
                  ? 'text-[#EF4444]'
                  : check?.status === 'timeout'
                    ? 'text-[#F97316]'
                    : check?.status === 'up'
                      ? 'text-green-700'
                      : ''}">{check?.status === 'error' ? 'Down' : check?.status}</span>

              <span class="bg-white/20 h-4 w-px"></span>

              <span
                class="flex justify-center items-center text-nowrap tracking-wider text-white/40 text-sm"
                >{check?.target}
              </span>
            </div>
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
          {:else if check}
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
                      props: {
                        name: check?.name,
                        id: check?.id,
                        onDelete: () => (isDeleted = true),
                      },
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
                      props: {
                        data: check,
                        onEdited: () => {
                          trigger += 1;
                        },
                      },
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

              <div class="h-9 w-px bg-white/15 hidden sm:block"></div>
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
                            name: check?.name,
                            onEdited: () => {
                              trigger += 1;
                            },
                          },
                        });
                      } else {
                        http
                          .patch(endpoints.singleCheck(check?.id), {
                            enabled: true,
                          })
                          .then(res => {
                            trigger += 1;
                            alertStore.addAlert({
                              message: `Checker ${check?.name} activation updated successfully.`,
                              type: 'successful',
                            });
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

        <DateChanger
          type="check"
          bind:value={summaryWithDate}
          {summary}
          {id}
          {toDay}
          {date}
          loading={loading.summaryYearly} />
      {/if}
    </div>

    <Uptime
      checkId={id}
      {date}
      {summaryWithDate}
      summaryWithDateLoading={loading.summaryWithDate} />

    <TimeRangeSelector
      {date}
      bind:value={hours}
      interval={check?.interval_seconds}
      loading={loading.check} />

    <Latency {hours} {id} name={check?.name} />

    <ApdexHistory
      {id}
      {hours}
      {summaryWithDate}
      {date}
      summaryWithDateLoading={loading.summaryWithDate} />

    <ApdexHistogram
      {id}
      {hours}
      {summaryWithDate}
      {date}
      summaryWithDateLoading={loading.summaryWithDate} />

    <SummaryCalender
      bind:value={toDay}
      type="check"
      {summary}
      {id}
      {date}
      loading={loading.summaryYearly} />
  </div>
</section>
