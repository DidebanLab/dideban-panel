<script>
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import DeleteChecker from '../../../../components/pages/checker/DeleteChecker.svelte';
  import ConfirmEditChecker from '../../../../components/pages/checker/ConfirmEditChecker.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { goto } from '$app/navigation';
  import getDate from '../../../../utils/getDate';
  import { on, subscribe, off, unsubscribe } from '../../../../services/ws.svelte';
  import DeleteNotice from '../../../../components/common/DeleteNotice.svelte';
  import ConfirmEditAlert from '../../../../components/pages/alerts/ConfirmEditAlert.svelte';
  import DeleteAlert from '../../../../components/pages/alerts/DeleteAlert.svelte';
  import EditAlert from '../../../../components/pages/alerts/EditAlert.svelte';

  const id = $page.params.alert;
  let trigger = $state(0);
  let alert = $state({
    id: 1,
    check_id: 5,
    agent_id: null,
    channel_id: 1,
    channel: {
      id: 1,
      name: 'ربات بله عملیات',
      type: 'bale',
      enabled: true,
    },
    conditions: {
      operator: 'AND',
      conditions: [
        {
          type: 'cpu_above',
          value: 85,
        },
        {
          type: 'memory_above',
          value: 90,
        },
      ],
    },
    enabled: true,
    notify_on_recovery: true,
    repeat_interval_seconds: 300,
    escalation_delay_seconds: 60,
    custom_message: '',
    merge_with_system_message: true,
    last_fired_at: '2026-04-20T10:00:00Z',
    last_status: 'sent',
    created_at: '2026-01-01T10:00:00Z',
  });
  let enabled = $state(null);
  let summary = $state(null);
  let summaryWithDate = $state(null);
  let isDeleted = $state(false);
  let alertLoading = $state(false);

  let relationData = $state(null);

  onMount(() => {
    http.get(endpoints.singleCheck(2)).then(res => {
      relationData = res.data?.data;
    });
  });

  //   onMount(() => {
  //     subscribe(`alerts:${id}`);
  //     on('alert.updated', handleUpdated);
  //     on('alert.deleted', handleDeleted);
  //   });

  //   onDestroy(() => {
  //     off('alert.updated', handleUpdated);
  //     off('alert.deleted', handleDeleted);
  //     unsubscribe(`alerts:${id}`);
  //   });

  //   function handleDeleted(data) {
  //     if (isDeleted) return;

  //     opener({
  //       id: 'delete-alert',
  //       isOutClicker: false,
  //       content: DeleteNotice,
  //       props: { type: 'check' },
  //     });
  //   }

  //   function handleUpdated(data) {
  //     http.get(endpoints.singleAlert(data?.id)).then(res => {
  //       alert = res.data?.data;
  //       enabled = res.data?.data.enabled;
  //     });
  //   }

  //   $effect(() => {
  //     alertLoading = true;
  //     const update = trigger;
  //     http
  //       .get(endpoints.singleAlert(id))
  //       .then(res => {
  //         const data = res.data?.data;
  //         alert = data;
  //         enabled = data.enabled;
  //         const url = data.check_id
  //           ? endpoints.singleCheck(data.check_id)
  //           : data.agent_id && endpoints.singleAgent(data.agent_id);

  //         if (url)
  //           http.get(url).then(res => {
  //             relationData = res.data?.data;
  //           });
  //       })
  //       .finally(() => {
  //         alertLoading = false;
  //       });
  //   });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10 gap-7.75 px-6 sm:p-7.75 sm:py-2">
  <div
    class="w-full flex flex-col justify-start items-start gap-6 lg:border border-[#0D0D0D]/5 dark:border-white/5 lg:px-6 pt-1 pb-6 lg:py-6 lg:rounded-xl sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
    <div
      class="w-full relative flex flex-col gap-4 lg:gap-6 lg:flex-row justify-between items-center lg:items-start">
      {#if alertLoading}
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
      {:else if alert}
        <div class="w-full flex justify-between items-start">
          <div class="flex flex-col justify-center items-start">
            <span class="text-black dark:text-white text-lg sm:text-xl text-nowrap capitalize flex">
              Alert of {alert.check_id ? 'check' : 'agent'}
              <a
                href={alert.check_id
                  ? `/checkers/${alert.check_id}`
                  : alert.agent_id
                    ? `/agents/${alert.agent_id}`
                    : '#'}
                class="border ms-2 px-4 py-0.5 text-sm flex justify-center items-center border-[#2B7FFF]/20 text-[#2B7FFF] bg-[#2B7FFF]/5 rounded-sm text-nowrap"
                >{relationData?.name}</a>
            </span>
          </div>

          <div
            class="flex flex-col-reverse sm:flex-row justify-start items-end sm:justify-center sm:items-center gap-1.5 sm:gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <button
                class="cursor-pointer"
                aria-label="delete alert"
                type="button"
                onclick={() => {
                  opener({
                    id: 'delete-alert',
                    content: DeleteAlert,
                    props: {
                      name: relationData?.name,
                      id,
                      relType: `${alert.check_id ? 'checker' : alert.agent_id && 'agent'}`,
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
                    id: 'edit-alert',
                    content: EditAlert,
                    props: {
                      id,
                      data: alert,
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
                        content: ConfirmEditAlert,
                        props: {
                          relType: `${alert.check_id ? 'checker' : alert.agent_id && 'agent'}`,
                          name: relationData?.name,
                          onEdited: () => {
                            trigger += 1;
                          },
                        },
                      });
                    } else {
                      http
                        .patch(endpoints.singleAlert(id), {
                          enabled: true,
                        })
                        .then(res => {
                          trigger += 1;
                          alertStore.addAlert({
                            message: `alert of ${`${alert.check_id ? 'checker' : alert.agent_id && 'agent'}`} ${relationData?.name} activation updated successfully.`,
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
        </div>
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
    <div class="w-full grid grid-cols-12 gap-4 h-80">
      <div
        class="col-span-5 lg:border border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl flex flex-col gap-2">
      </div>
      <div
        class="col-span-7 lg:border flex flex-col gap-4 border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl">
        <div class="flex justify-between items-start text-sm w-full">
          <div class="flex flex-col gap-1 me-auto items-start">
            <span class="flex justify-center items-center text-white text-sm sm:text-lg"
              >Alert Config</span>

            <div class="flex justify-end items-center gap-2 text-white/15">
              <span class="flex justify-center items-center text-nowrap text-xs">
                <img width="17" height="17" src="/icons/clock.png" alt="clock" />Last fired :</span>

              <div
                class="text-xs flex justify-center items-center gap-1 text-[#707B76]/40 text-nowrap">
                {new Date(alert.last_fired_at).toLocaleString('en-CA', {
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
          </div>

          <div
            class="border w-20 py-1.5 rounded-lg flex justify-center items-center {alert.enabled
              ? 'text-[#00bc7d] bg-[#00bc7d]/5 border-[#00bc7d]/15'
              : 'text-[#fa5757] bg-[#F87171]/5 border-[#F87171]/15'}">
            {alert.enabled ? 'Enable' : 'Disable'}
          </div>
        </div>

        <div class="w-full flex gap-3 h-full">
          <div class=" flex flex-col gap-1 h-full w-full">
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 h-full"></div>
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 h-full"></div>
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 h-full"></div>
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 h-full"></div>
          </div>
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 h-full w-full"></div>
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-full h-full">
            <span class="text-lg text-white">Condition</span>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">Type</span>

                <span class="text-white/30 text-sm flex items-center"
                  >{alert.conditions.operator ? 'multi conditions' : alert.conditions.type}</span>
              </div>
              {#if !alert.conditions.operator && !(alert.conditions.type === 'status_down' || alert.conditions.type === 'status_up' || alert.conditions.type === 'status_timeout' || alert.conditions.type === 'status_error' || alert.conditions.type === 'offline')}
                <div class="flex items-start flex-col gap-1 w-full">
                  <span class="text-white h-full flex justify-center">Value</span>

                  <span class="text-white/30 text-sm flex items-center pt-px">
                    {alert.conditions.value}%</span>
                </div>
              {:else}
                <div class="flex items-start flex-col gap-1 w-full h-full">
                  <span class="text-white h-full flex justify-center">Conditions Tree</span>

                  <div class="flex w-full h-full justify-start items-center">
                    <div
                      class="relative text-[10px] text-white rounded-md flex justify-center items-center">
                      <div
                        class="absolute border border-e-0 border-white w-7 start-5 top-1/2 -translate-y-1/2 {alert
                          .conditions?.length > 2
                          ? 'h-9'
                          : 'h-7'}">
                        <div class="w-full h-full relative">
                          <div
                            class="absolute  flex justify-center items-center group transition-all cursor-pointer -top-1.75 -end-2 size-3.5 rounded-full bg-white/10 {alert
                              .conditions?.conditions?.operator
                              ? ''
                              : 'hover:bg-white/20 animate-pulse hover:animate-none'}">
                            <div class="bg-white/40 rounded-full size-1.5 group-hover:size-2"></div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="absolute border border-e-0 border-white w-7 start-5 top-1/2 -translate-y-1/2 {alert
                          .conditions?.length > 2
                          ? 'h-9'
                          : 'h-7'}">
                        <div class="w-full h-full relative">
                          <div
                            class="absolute flex justify-center items-center group transition-all cursor-pointer -bottom-1.75 -end-2 size-3.5 rounded-full bg-white/10 {alert
                              .conditions?.conditions?.operator
                              ? ''
                              : 'hover:bg-white/20 animate-pulse hover:animate-none'}">
                            <div class="bg-white/40 rounded-full size-1.5 group-hover:size-2"></div>
                          </div>
                        </div>
                      </div>

                      {#if alert.conditions?.length > 2}
                        <div class="absolute bg-white h-px w-7 start-7 top-1/2 -translate-y-1/2">
                        </div>
                      {/if}

                      <span class="z-20 bg-[#0D0D0D] text-orange-500 pe-1 py-px">AND</span>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-full h-full">
            <div class="w-full flex justify-between items-start">
              <span class="text-lg text-white">Channel</span>
              <div
                class=" text-xs lg:text-sm xl:text-md rounded-md w-15.75 py-0.5 flex justify-center items-center bg-[#00bc7d]/5 {alert.enabled
                  ? 'text-[#00bc7d]/80 '
                  : 'text-[#fa5757]/80 '}">
                {alert.channel.enabled ? 'enable' : 'disable'}
              </div>
            </div>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">name</span>

                <span class="text-white/30 text-sm flex items-center">{alert.channel.name}</span>
              </div>
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">Type</span>

                <div class="flex items-center gap-1">
                  <img class="opacity-50" src="/icons/bale.png" alt="bale" width="12" />
                  <span class="text-white/30 text-sm flex items-center pt-px">
                    {alert.channel.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- <div class="w-full flex justify-end items-end">
  <div class="flex gap-1 items-center justify-center">
    {#if alert.last_status === 'sent'}
      <img class="mb-0.5" width="15" src="/icons/tick.svg" alt="tick" />
      <span class="text-[#00bc7d]/50 text-sm">Sent</span>
    {:else if alert.last_status === 'failed'}
      <img class="mb-0.5 opacity-70" width="15" src="/icons/error.svg" alt="error" />

      <span class="text-white text-sm">Failed</span>
    {/if}
  </div>
</div> -->
