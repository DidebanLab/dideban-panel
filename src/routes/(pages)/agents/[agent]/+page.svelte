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

  onMount(() => {
    http.get(endpoints.agentSummaryYearly(id)).then(res => {
      const current = res.data.data.find(i => Object.values(i.history).includes(-1));
      const day = Object.keys(current.history).find(key => current.history[key] === -1);
      toDay = `${current.year}-${current.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      summary = res.data?.data;
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
    const update = trigger;
    http.get(endpoints.singleAgent(id)).then(res => {
      agent = res.data?.data;
      enabled = res.data?.data.enabled;
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

      http.get(endpoints.agentSummaryDate(id, date)).then(res => {
        summaryWithDate = {
          ...res.data.data,
          uptime_series: res.data?.data?.uptime_series?.reverse(),
        };
      });
    }
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start relative">
        <div class="flex flex-col justify-center items-start">
          <span class="text-black dark:text-white text-xl capitalize">{agent?.name}</span>

          <span
            class="flex justify-center items-center text-nowrap tracking-wider text-sm {agent?.status ===
            'online'
              ? 'text-green-700'
              : 'text-[#F87171]'}">{agent?.status}</span>
        </div>

        {#if date ? date : toDay}
          <DateChanger type="agent" bind:value={summaryWithDate} {summary} {id} {toDay} {date} />
        {/if}

        {#if date}
          <button
            onclick={() => {
              goto(`/agents/${id}`);
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
        {:else if agent}
          <div class="flex justify-center items-center gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <button
                class="cursor-pointer"
                aria-label="delete agent"
                type="button"
                onclick={() => {
                  opener({
                    id: 'delete-agent',
                    content: DeleteAgent,
                    props: { name: agent?.name, id: agent?.id, onDelete: () => (isDeleted = true) },
                  });
                }}>
                <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
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
                  class="w-11 h-6 rounded-full relative cursor-pointer {enabled
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={enabled ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {enabled
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
            {/key}
          </div>
        {/if}
      </div>

      <Uptime agentId={+id} {date} {summaryWithDate} />

      {#if !date}
        <TimeRangeSelector bind:value={hours} interval={agent?.interval_seconds} />
      {/if}

      <CollectDuration {id} {date} {summaryWithDate} {hours} />

      <Metrics {id} {date} {summaryWithDate} {hours} />

      {#if summary}
        <SummaryCalender bind:value={toDay} type="agent" {summary} {id} {date} />
      {/if}
    </div>
  </div>
</section>
