<script>
  import { endpoints } from './../../../../endpoints.svelte.js';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import { alertStore } from '../../../../stores/alert.svelte.js';
  import { goto } from '$app/navigation';
  import ConfirmEditAgent from '../../../../components/pages/agent/ConfirmEditAgent.svelte';
  import DeleteAgent from '../../../../components/pages/agent/DeleteAgent.svelte';
  import EditAgent from '../../../../components/pages/agent/EditAgent.svelte';
  import getDate from '../../../../utils/getDate.js';
  import DateChanger from '../../../../components/common/DateChanger.svelte';
  import TimeRangeSelector from '../../../../components/common/TimeRangeSelector.svelte';
  import SummaryCalender from '../../../../components/common/SummaryCalender.svelte';
  import Uptime from '../../../../components/pages/agent/Uptime.svelte';
  import CollectDuration from '../../../../components/pages/agent/CollectDuration.svelte';
  import Metrics from '../../../../components/pages/agent/Metrics.svelte';
  import { off, on, subscribe, unsubscribe } from '../../../../services/ws.svelte.js';
  import DeleteAlert from '../../../../components/common/DeleteAlert.svelte';

  const id = $page.params.agent;
  let trigger = $state(0);
  let hours = $state(24);
  let date = $state(null);
  let agent = $state(null);
  let enabled = $state(null);
  let summary = $state(null);
  let toDay = $state(null);
  let summaryWithDate = $state(null);
  let isDeleted = $state(false);
  let loading = $state({ summaryWithDate: false, agent: true, summaryYearly: true });

  onMount(() => {
    loading.summaryYearly = true;
    http
      .get(endpoints.agentSummaryYearly(id))
      .then(res => {
        const current = res.data.data.find(i => Object.values(i.history).includes(-1));
        const day = Object.keys(current.history).find(key => current.history[key] === -1);
        toDay = `${current.year}-${current.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        summary = res.data?.data;
      })
      .finally(() => {
        loading.summaryYearly = false;
      });

    subscribe(`agents:${id}`);
    on('agent.status.changed', handleStatus);
    on('agent.updated', handleUpdated);
    on('agent.deleted', handleDeleted);
  });

  onDestroy(() => {
    off('agent.status.changed', handleStatus);
    off('agent.updated', handleUpdated);
    off('agent.deleted', handleDeleted);
    unsubscribe(`agents:${id}`);
  });

  function handleStatus(data) {
    console.log(data);
    agent = { ...agent, status: data?.status };
  }

  function handleDeleted(data) {
    if (isDeleted) return;

    opener({
      id: 'delete-alert',
      isOutClicker: false,
      content: DeleteAlert,
      props: { type: 'agent' },
    });
  }

  function handleUpdated(data) {
    http.get(endpoints.singleAgent(data?.id)).then(res => {
      agent = res.data?.data;
      enabled = res.data?.data.enabled;
    });
  }

  $effect(() => {
    loading.agent = true;
    const update = trigger;
    http
      .get(endpoints.singleAgent(id))
      .then(res => {
        agent = res.data?.data;
        enabled = res.data?.data.enabled;
      })
      .finally(() => {
        loading.agent = false;
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
        goto(`/agents/${id}`);
        return;
      }
      loading.summaryWithDate = true;
      http
        .get(endpoints.agentSummaryDate(id, date))
        .then(res => {
          summaryWithDate = {
            ...res.data.data,
            uptime_series: res.data?.data?.uptime_series?.reverse(),
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
      {#if loading.agent}
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
      {:else if agent}
        <div class="w-full flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            <span class="text-black dark:text-white text-xl capitalize">{agent?.name}</span>

            <span
              class="flex justify-center items-center text-nowrap tracking-wider text-sm {agent?.status ===
              'online'
                ? 'text-green-700'
                : 'text-[#F87171]'}">{agent?.status}</span>
          </div>

          {#if date}
            <button
              onclick={() => {
                goto(`/agents/${id}`);
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
          {:else if agent}
            <div
              class="flex flex-col-reverse sm:flex-row justify-start items-end sm:justify-center sm:items-center gap-1.5 sm:gap-3">
              <div class="flex justify-center items-center gap-1.75">
                <button
                  class="cursor-pointer"
                  aria-label="delete agent"
                  type="button"
                  onclick={() => {
                    opener({
                      id: 'delete-agent',
                      content: DeleteAgent,
                      props: {
                        name: agent?.name,
                        id: agent?.id,
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
                      id: 'edit-agent',
                      content: EditAgent,
                      props: {
                        name: agent?.name,
                        interval_seconds: agent?.interval_seconds,
                        enabled: agent?.enabled,
                        id: agent?.id,
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
                          content: ConfirmEditAgent,
                          props: {
                            name: agent?.name,
                            onEdited: () => {
                              trigger += 1;
                            },
                          },
                        });
                      } else {
                        http
                          .patch(endpoints.singleAgent(agent?.id), {
                            enabled: true,
                          })
                          .then(res => {
                            trigger += 1;
                            alertStore.addAlert({
                              message: `Agent ${agent?.name} activation updated successfully.`,
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
          type="agent"
          bind:value={summaryWithDate}
          {summary}
          {id}
          {toDay}
          {date}
          loading={loading.summaryYearly} />
      {:else}
        <div
          class="w-full relative overflow-hidden rounded-[14px] text-red-500/50 animate-pulse border border-[#F87171]/15 h-26.5 lg:h-13 roud flex justify-center items-center text-xl">
          <div
            class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
            style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
            <div class="w-full h-full bg-white/5"></div>
          </div>

          <div class="flex justify-center items-center gap-1">
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
            <span class="text-xl text-red-500/70 mt-0.5">Something Is Wrong</span>
          </div>
        </div>
      {/if}
    </div>

    <Uptime
      agentId={+id}
      {date}
      {summaryWithDate}
      summaryWithDateLoading={loading.summaryWithDate} />

    <TimeRangeSelector
      {date}
      bind:value={hours}
      interval={agent?.interval_seconds}
      loading={loading.check} />

    <CollectDuration
      {id}
      {date}
      {summaryWithDate}
      {hours}
      summaryWithDateLoading={loading.summaryWithDate} />

    <Metrics
      {id}
      {date}
      {summaryWithDate}
      {hours}
      summaryWithDateLoading={loading.summaryWithDate} />

    <SummaryCalender
      bind:value={toDay}
      type="agent"
      {summary}
      {id}
      {date}
      loading={loading.summaryYearly} />
  </div>
</section>
