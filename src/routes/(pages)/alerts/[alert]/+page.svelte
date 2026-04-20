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
  import { theme } from '../../../../stores/theme.svelte';

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
          value: 80,
        },
        {
          operator: 'AND',
          conditions: [
            {
              type: 'cpu_above',
              value: 80,
            },
            {
              operator: 'OR',
              conditions: [
                {
                  type: 'memory_above',
                  value: 90,
                },
                {
                  type: 'disk_above',
                  value: 95,
                },
              ],
            },
            {
              operator: 'OR',
              conditions: [
                {
                  type: 'memory_above',
                  value: 90,
                },
                {
                  type: 'disk_above',
                  value: 95,
                },
              ],
            },
          ],
        },
        {
          operator: 'OR',
          conditions: [
            {
              type: 'memory_above',
              value: 90,
            },
            {
              type: 'disk_above',
              value: 95,
            },
          ],
        },
      ],
    },
    enabled: true,
    notify_on_recovery: true,
    repeat_interval_seconds: 300,
    escalation_delay_seconds: 60,
    custom_message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum nostrum veniam',
    merge_with_system_message: true,
    last_fired_at: '2026-04-20T10:00:00Z',
    last_status: 'sent',
    created_at: '2026-01-01T10:00:00Z',
  });

  let conditionsHandler = $state({
    level: 1,
    operator: alert?.conditions?.operator,
    singleConditions: Array.isArray(alert?.conditions?.conditions)
      ? alert.conditions.conditions.filter(cd => !cd?.operator)
      : [],
    conditions: Array.isArray(alert?.conditions?.conditions) ? [{ ...alert.conditions }] : [], // اگر آرایه نبود، شرایط را خالی بگذار
  });

  let enabled = $state(null);
  let summary = $state(null);
  let summaryWithDate = $state(null);
  let isDeleted = $state(false);
  let alertLoading = $state(false);
  let isHeadersVisibility = $state(false);
  let isExpectedContentVisibility = $state(false);
  let isConditionsVisibility = $state(false);
  let isBodyVisibility = $state(false);

  let relationData = $state({
    id: 42,
    name: 'Production API',
    type: 'http',
    target: 'https://api.example.com/heh',
    config: {
      method: 'GET',
      expected_status: 200,
      expected_content: '',
      follow_redirects: true,
      verify_ssl: true,
      headers: { key: 'sds', value: '' },
      body: {},
    },
    enabled: true,
    interval_seconds: 60,
    timeout_seconds: 10,
    status: 'up',
    last_checked_at: '2026-01-31T14:30:00Z',
    created_at: '2026-01-30T08:00:00Z',
    updated_at: '2026-01-31T14:30:00Z',
  });

  function conditionsCounter(conditions, operator = null) {
    let conditionsCounter;
    if (operator) {
      conditionsCounter = conditions.length + 1;
    } else {
      conditionsCounter = conditions.length;
    }

    return conditionsCounter;
  }

  // onMount(() => {
  //   http.get(endpoints.singleCheck(2)).then(res => {
  //     relationData = res.data?.data;
  //   });
  // });

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
  onclick={() => {
    isConditionsVisibility = false;
    isHeadersVisibility = false;
    isExpectedContentVisibility = false;
    isBodyVisibility = false;
  }}
  class="w-full m-auto h-auto flex flex-col col-span-10 gap-7.75 px-6 sm:p-7.75 sm:py-2">
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
    <div class="w-full grid grid-cols-12 gap-4">
      <div
        class=" lg:border border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl flex flex-col gap-4 {alert.check_id
          ? 'col-span-4'
          : 'col-span-3'}">
        <!-- mahdi -->
        <div class="flex justify-between items-start text-sm w-full">
          <div class="flex flex-col gap-1 me-auto items-start h-13">
            <span class="flex justify-center items-center text-white text-sm sm:text-lg"
              >{alert.check_id ? 'Checker' : 'Agent'} Config</span>

            <div class="flex justify-end items-center gap-1 text-white/30">
              <span class="flex justify-center items-center gap-1 text-nowrap text-xs">
                <img width="17" height="17" src="/icons/clock.png" alt="clock" />Updated :</span>

              <div class="text-xs flex justify-center items-center gap-1 text-nowrap">
                {new Date(relationData.updated_at).toLocaleString('en-CA', {
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
        </div>

        {#if alert.agent_id}
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 h-full w-full">
            <span class="text-lg text-white">Config</span>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">name</span>

                <span class="text-white/30 text-sm flex items-center">{relationData.name}</span>
              </div>
              <div class="w-full mt-auto flex flex-col gap-2">
                <div
                  class="w-full py-2.5 border border-white/5 flex justify-between items-center rounded-lg p-4 mt-auto">
                  <span class="text-white text-sm">status</span>

                  <div
                    class=" text-xs lg:text-sm xl:text-md rounded-md w-15.75 py-0.5 flex justify-center items-center bg-[#00bc7d]/5 {relationData.status ===
                    'online'
                      ? 'text-[#00bc7d] '
                      : 'text-[#fa5757] '}">
                    {relationData.status}
                  </div>
                </div>

                <div
                  class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                  <span class="text-white text-sm">interval</span>

                  <span class="text-sm flex items-center text-[#e75500]"
                    >{relationData.interval_seconds}s</span>
                </div>
              </div>
            </div>
          </div>
        {:else}
          <div class="w-full h-full flex justify-between gap-3">
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-1 w-1/2 h-full">
              <a
                href={alert.check_id
                  ? `/checkers/${alert.check_id}`
                  : alert.agent_id
                    ? `/agents/${alert.agent_id}`
                    : '#'}
                class="border w-full py-0.75 text-sm flex justify-center items-center border-[#2B7FFF]/20 text-[#2B7FFF] bg-[#2B7FFF]/5 rounded-sm text-nowrap"
                >{relationData.name}</a>

              <div
                class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4 mt-auto">
                <span class="text-white text-sm">status</span>

                <div
                  class="text-sm flex justify-center items-center {relationData.enabled
                    ? 'text-[#00bc7d] '
                    : 'text-[#fa5757] '}">
                  {relationData.enabled ? 'enable' : 'disable'}
                </div>
              </div>
              <div
                class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                <span class="text-white text-sm">Type</span>

                <span class="text-sm flex items-center text-white/30">{relationData.type}</span>
              </div>
              <div
                class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                <span class="text-white text-sm">interval</span>

                <span class="text-sm flex items-center text-[#e75500]"
                  >{relationData.interval_seconds}s</span>
              </div>
              <div
                class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                <span class="text-white text-sm">timeout</span>

                <span class="text-sm flex items-center text-[#e75500]"
                  >{relationData.timeout_seconds}s</span>
              </div>
            </div>

            {#if relationData.type.toLowerCase() === 'ping'}
              <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-1/2 h-full">
                <span class="text-lg text-white">Ping Config</span>

                <span class="text-white/30 text-sm flex items-center pt-px w-full break-all">
                  {relationData.target}</span>

                <div class="flex flex-col gap-1 w-full mt-auto">
                  <div
                    class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                    <span class="text-white text-sm">ping count</span>

                    <span class="text-sm flex items-center text-[#e75500]"
                      >{relationData?.config?.count}</span>
                  </div>
                  <div
                    class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                    <span class="text-white text-sm">packet size</span>

                    <span class="text-sm flex items-center text-[#e75500]"
                      >{relationData?.config?.size}</span>
                  </div>
                  <div
                    class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                    <span class="text-white text-sm">interval</span>

                    <span class="text-sm flex items-center text-[#e75500]"
                      >{relationData?.config?.interval}</span>
                  </div>
                </div>
              </div>
            {:else}
              <div
                class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-1/2 h-full relative">
                <span class="text-lg text-white capitalize">{relationData.type} Config</span>

                <span class="text-white/30 text-sm flex items-center pt-px w-full break-all">
                  {relationData.target}</span>

                <div
                  onclick={e => {
                    e.stopPropagation();
                  }}
                  class="absolute min-w-50 h-fit bottom-full cursor-default start-full top-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl z-20 p-4 flex-col gap-1 {isHeadersVisibility ||
                  isExpectedContentVisibility ||
                  isBodyVisibility
                    ? 'flex'
                    : 'hidden'}">
                  <span class="text-white text-sm mb-1 me-auto"
                    >{isExpectedContentVisibility
                      ? 'Expected Content'
                      : isHeadersVisibility
                        ? 'Headers'
                        : isBodyVisibility && 'Body'}</span>
                  {#if isHeadersVisibility}
                    {#each relationData?.config?.headers && Object.entries(relationData?.config?.headers).filter(ent => ent[1]) as [key, value]}
                      <div
                        class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4 gap-15">
                        <span class="text-white text-sm">{key}</span>

                        <span class="text-sm flex items-center text-white/30">{value}</span>
                      </div>
                    {/each}
                  {:else if isBodyVisibility}
                    <div
                      class=" py-2 border border-white/5 rounded-lg p-4 text-white/30 text-sm min-h-20 w-50 break-all">
                      {JSON.stringify(relationData?.config?.body)}
                    </div>
                  {:else if isExpectedContentVisibility}
                    <div
                      class="w-full py-2 border border-white/5 rounded-lg p-4 text-white/30 text-sm min-h-20">
                      {relationData?.config?.expected_content}
                    </div>
                  {/if}
                </div>

                <div
                  class="flex flex-col gap-1 w-full mt-auto custom-scroll overflow-y-auto overflow-x-visible max-h-30 pe-2">
                  {#if 'method' in relationData.config}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">method</span>

                      <span class="text-sm flex items-center text-white/30"
                        >{relationData?.config?.method}</span>
                    </div>
                  {/if}

                  {#if 'follow_redirects' in relationData.config}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">follow redirects</span>

                      <span
                        class="text-sm flex items-center {relationData?.config?.follow_redirects
                          ? 'text-[#00bc7d]'
                          : 'text-[#fa5757]'}"
                        >{relationData?.config?.follow_redirects ? 'Yes' : 'No'}</span>
                    </div>
                  {/if}

                  {#if 'verify_ssl' in relationData.config}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">verify ssl</span>

                      <span
                        class="text-sm flex items-center {relationData?.config?.verify_ssl
                          ? 'text-[#00bc7d]'
                          : 'text-[#fa5757]'}"
                        >{relationData?.config?.verify_ssl ? 'Yes' : 'No'}</span>
                    </div>
                  {/if}

                  {#if relationData?.config?.body && Object.values(relationData?.config?.body).filter(h => h)?.length}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">body</span>

                      <div class="flex gap-2 justify-center items-center">
                        <span class="text-white text-sm pt-0.5"
                          >{Object.values(relationData?.config?.body).filter(h => h)?.length}</span>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                          onclick={e => {
                            e.stopPropagation();

                            isConditionsVisibility = false;
                            isHeadersVisibility = false;
                            isExpectedContentVisibility = false;

                            isBodyVisibility = !isBodyVisibility;
                          }}
                          class="bg-white/15 size-3.5 hover:bg-white/25 duration-75 cursor-pointer relative group transition-all rounded-full">
                          <span
                            class="absolute top-1/2 start-1/2 -translate-1/2 bg-white/50 group-hover:bg-white/70 duration-75 cursor-pointer transition-all size-1.75 rounded-full"
                          ></span>
                        </button>
                      </div>
                    </div>
                  {/if}
                  {#if relationData?.config?.headers && Object.values(relationData?.config?.headers).filter(h => h)?.length}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">headers</span>

                      <div class="flex gap-2 justify-center items-center">
                        <span class="text-white text-sm pt-0.5"
                          >{Object.values(relationData?.config?.headers).filter(h => h)
                            ?.length}</span>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                          onclick={e => {
                            e.stopPropagation();
                            isConditionsVisibility = false;
                            isExpectedContentVisibility = false;
                            isBodyVisibility = false;
                            isHeadersVisibility = !isHeadersVisibility;
                          }}
                          class="bg-white/15 size-3.5 hover:bg-white/25 duration-75 cursor-pointer relative group transition-all rounded-full">
                          <span
                            class="absolute top-1/2 start-1/2 -translate-1/2 bg-white/50 group-hover:bg-white/70 duration-75 cursor-pointer transition-all size-1.75 rounded-full"
                          ></span>
                        </button>
                      </div>
                    </div>
                  {/if}

                  {#if relationData?.config?.expected_status}
                    <div
                      class="w-full py-2 border border-white/5 flex flex-col gap-1 rounded-lg p-4">
                      <span class="text-white text-sm">expected status code</span>

                      <span class="text-xs flex items-center text-white/30"
                        >{relationData?.config?.expected_status}</span>
                    </div>
                  {/if}
                  {#if relationData?.config?.expected_content?.length}
                    <div
                      class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                      <span class="text-white text-sm">expected content</span>

                      <!-- svelte-ignore a11y_consider_explicit_label -->
                      <button
                        onclick={e => {
                          e.stopPropagation();
                          isConditionsVisibility = false;
                          isHeadersVisibility = false;
                          isBodyVisibility = false;
                          isExpectedContentVisibility = !isExpectedContentVisibility;
                        }}
                        class="bg-white/15 size-3.5 hover:bg-white/25 duration-75 cursor-pointer relative group transition-all rounded-full">
                        <span
                          class="absolute top-1/2 start-1/2 -translate-1/2 bg-white/50 group-hover:bg-white/70 duration-75 cursor-pointer transition-all size-1.75 rounded-full"
                        ></span>
                      </button>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
      <div
        class="lg:border flex flex-col gap-4 border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl {alert.check_id
          ? 'col-span-8 '
          : 'col-span-9'}">
        <div class="flex justify-between items-start text-sm w-full">
          <div class="flex flex-col gap-1 me-auto items-start">
            <span class="flex justify-center items-center text-white text-sm sm:text-lg"
              >Alert Config</span>

            <div class="flex items-center gap-2">
              <div class="flex justify-end items-center gap-2 text-white/30">
                <span class="flex justify-center items-center text-nowrap text-xs">
                  <img width="17" height="17" src="/icons/clock.png" alt="clock" />Last Fired :</span>

                <div class="text-xs flex justify-center items-center gap-1 text-nowrap">
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

              <div class="bg-white/10 w-px h-4"></div>

              <div class="flex justify-end items-end">
                <div class="flex gap-1 items-center justify-center">
                  {#if alert.last_status === 'sent'}
                    <span class="text-[#00bc7d] text-sm">Sent</span>
                  {:else if alert.last_status === 'failed'}
                    <span class="text-[#fa5757] text-sm">Failed</span>
                  {:else if alert.last_status === 'pending'}
                    <span class="text-[#FDC700]/30 text-sm animate-pulse">Pending ...</span>
                  {/if}
                </div>
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
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 h-full w-full">
            <span class="text-lg text-white">Control</span>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center"
                  >{alert.check_id ? 'checker id' : 'agent id'}</span>

                <span class="text-white/30 text-sm flex items-center"
                  >{alert.check_id ? alert.check_id : alert.agent_id}</span>
              </div>
              <div class="w-full flex flex-col gap-1 mt-auto">
                <div
                  class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                  <span class="text-white text-sm">repeat interval</span>

                  <span class="text-sm flex items-center text-[#e75500]"
                    >{alert.repeat_interval_seconds}s</span>
                </div>
                <div
                  class="w-full py-2 border border-white/5 flex justify-between items-center rounded-lg p-4">
                  <span class="text-white text-sm">escalation delay</span>

                  <span class="text-sm flex items-center text-[#e75500]"
                    >{alert.escalation_delay_seconds}s</span>
                </div>
              </div>
            </div>
          </div>
          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-full h-full">
            <span class="text-lg text-white">Condition</span>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">type</span>

                <span class="text-white/30 text-sm flex items-center"
                  >{alert.conditions.operator ? 'multi conditions' : alert.conditions.type}</span>
              </div>
              {#if !alert.conditions.operator && !(alert.conditions.type === 'status_down' || alert.conditions.type === 'status_up' || alert.conditions.type === 'status_timeout' || alert.conditions.type === 'status_error' || alert.conditions.type === 'offline')}
                <div class="flex items-start flex-col gap-1 w-full">
                  <span class="text-white h-full flex justify-center">Value</span>

                  <span class="text-white/30 text-sm flex items-center pt-px">
                    {alert.conditions.value}%</span>
                </div>
              {:else if alert.conditions.operator}
                <div class="flex w-full h-full justify-start items-center overflow-x-visible">
                  <div
                    class=" w-full mt-auto rounded-lg border border-white/5 p-3 py-2 flex flex-col gap-2">
                    <div class="flex justify-between items-center w-full">
                      <span class="text-white text-sm">parent operator :</span>
                      <span class="text-[#2B7FFF] text-sm lowercase"
                        >{alert.conditions.operator}</span>
                    </div>
                    <div class="flex justify-between items-center w-full">
                      <span class="text-white text-sm">conditions :</span>

                      <div
                        class="flex gap-2 justify-center items-center border border-white/5 rounded-lg px-2 py-1">
                        <span class="text-white text-sm pt-0.5"
                          >{conditionsCounter(alert.conditions.conditions, alert?.operator)}</span>
                        <button
                          onclick={e => {
                            e.stopPropagation();
                            isHeadersVisibility = false;
                            isExpectedContentVisibility = false;
                            isBodyVisibility = false;
                            isConditionsVisibility = !isConditionsVisibility;
                          }}
                          class="bg-white/15 size-3.5 hover:bg-white/25 duration-75 cursor-pointer relative group transition-all rounded-full">
                          <div
                            onclick={e => {
                              e.stopPropagation();
                            }}
                            class="absolute min-w-80 h-fit bottom-full cursor-default start-1/2 -translate-x-1/2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl z-20 p-4 flex-col gap-1 {isConditionsVisibility
                              ? 'flex'
                              : 'hidden'}">
                            <div class="flex justify-between w-full">
                              <span class="text-white text-sm"> Level : </span>
                              <span class="text-white/30 text-sm">{conditionsHandler.level}</span>
                            </div>

                            <div class="flex justify-between w-full">
                              <span class="text-white text-sm"> Parent Operator : </span>
                              <span class="text-[#2B7FFF] text-sm"
                                >{conditionsHandler.operator}</span>
                            </div>

                            <div class="flex justify-between w-full">
                              <span class="text-white text-sm"> Single Conditions : </span>
                              <span class="text-white/30 text-sm"
                                >{conditionsCounter(conditionsHandler.singleConditions)}</span>
                            </div>

                            <div class="w-full flex gap-2 h-auto">
                              <div class="bg-white rounded-full h-auto w-px mt-2"></div>
                              <div class="flex flex-col w-full mt-2 gap-2">
                                {#each conditionsHandler.singleConditions as condition}
                                  <div class="flex gap-2 w-full">
                                    <div
                                      class="flex justify-between items-center w-full rounded-lg border border-white/5 px-2 py-1">
                                      <span class="text-white text-sm text-nowrap"> type : </span>

                                      <span class="text-white/30 text-sm">{condition.type}</span>
                                    </div>
                                    {#if condition?.value}
                                      <div
                                        class="flex justify-center items-center rounded-lg border border-white/5 py-1 w-14">
                                        <span class="text-white/30 text-sm"
                                          >{condition?.value}%</span>
                                      </div>
                                    {/if}
                                  </div>
                                {/each}
                              </div>
                            </div>

                            {#if conditionsHandler?.conditions[conditionsHandler.level - 1]?.conditions?.filter(cd => cd?.operator)?.length}
                              <div class="flex justify-between w-full mt-2">
                                <span class="text-white text-sm"> Group Conditions : </span>
                                <span class="text-white/30 text-sm"
                                  >{conditionsCounter(
                                    conditionsHandler.conditions[
                                      conditionsHandler.level - 1
                                    ].conditions?.filter(cd => cd?.operator),
                                  )}</span>
                              </div>

                              <div class="w-full flex gap-2 h-auto">
                                <div class="bg-white rounded-full h-auto w-px mt-2"></div>
                                <div class="flex flex-col w-full mt-2 gap-2">
                                  {#each [...conditionsHandler.conditions[conditionsHandler.level - 1].conditions?.filter(cd => cd?.operator)] as condition}
                                    <!-- svelte-ignore node_invalid_placement_ssr -->
                                    <button
                                      onclick={e => {
                                        e.preventDefault();
                                        conditionsHandler = {
                                          operator: condition.operator,

                                          singleConditions: condition.conditions.filter(
                                            cd => !cd.operator,
                                          ),
                                          conditions: [...conditionsHandler.conditions, condition],
                                          level: conditionsHandler.level + 1,
                                        };
                                      }}
                                      class="flex justify-between items-center w-full rounded-lg border border-[#2B7FFF]/20 px-2 py-1 bg-[#2B7FFF]/5 cursor-pointer hover:scale-101 transition-all">
                                      <span class="text-white text-sm text-nowrap">
                                        Condtion Operatior :
                                      </span>

                                      <span class="text-sm text-[#2B7FFF]"
                                        >{condition.operator}</span>
                                    </button>
                                  {/each}
                                </div>
                              </div>
                            {/if}

                            {#if conditionsHandler.level > 1}
                              <!-- svelte-ignore node_invalid_placement_ssr -->
                              <button
                                class="cursor-pointer me-auto mt-2"
                                onclick={() => {
                                  if (conditionsHandler.level > 1) {
                                    conditionsHandler = {
                                      ...conditionsHandler,
                                      level: --conditionsHandler.level,
                                      operator:
                                        conditionsHandler.conditions[conditionsHandler.level - 1]
                                          .operator,

                                      singleConditions: conditionsHandler.conditions[
                                        conditionsHandler.level - 2
                                      ].conditions.filter(cd => !cd.operator),
                                    };
                                  }
                                }}
                                aria-label="prev slide"
                                type="button">
                                <svg
                                  class="rotate-180"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="27"
                                  viewBox="0 0 50 50">
                                  <path
                                    d="M0 0 C3.50602742 0.58046812 5.20849502 1.80123031 7.6875 4.3125 C8.28949219 4.90675781 8.89148437 5.50101563 9.51171875 6.11328125 C11.15761446 8.19981046 11.88713672 9.3374526 12 12 C10.63671875 14.0703125 10.63671875 14.0703125 8.6875 16.125 C8.05199219 16.80820312 7.41648438 17.49140625 6.76171875 18.1953125 C5.51591496 19.47150175 4.26108804 20.73891196 3 22 C2.01 22 1.02 22 0 22 C0.52162717 17.30535551 2.12514403 16.87485597 6 13 C-7.86 12.67 -21.72 12.34 -36 12 C-36 11.34 -36 10.68 -36 10 C-22.14 9.67 -8.28 9.34 6 9 C4.02 7.02 2.04 5.04 0 3 C0 2.01 0 1.02 0 0 Z"
                                    fill={$theme === 'dark' ? 'white' : '#0D0D0D'}
                                    transform="translate(37,14)" />
                                </svg>
                              </button>
                            {/if}
                          </div>

                          <span
                            class="absolute top-1/2 start-1/2 -translate-1/2 bg-white/50 group-hover:bg-white/70 duration-75 cursor-pointer transition-all size-1.75 rounded-full"
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 h-full w-full">
            <span class="text-lg text-white">Message</span>

            <div class="flex flex-col gap-3 w-full text-sm h-full">
              <div class="flex items-start flex-col gap-1 w-full">
                <span class="text-white h-full flex justify-center">merge with system message</span>

                <span
                  class="text-sm flex items-center {alert.merge_with_system_message
                    ? 'text-[#00bc7d]'
                    : 'text-[#fa5757]'}">{alert.merge_with_system_message ? 'Yes' : 'No'}</span>
              </div>
              <div class="flex items-start flex-col gap-2 w-full h-full">
                {#if alert.custom_message.length}
                  <div
                    class=" w-full mt-auto rounded-lg border border-white/5 p-3 py-2 flex flex-col gap-2 text-white/30">
                    <span class="text-white flex justify-center me-auto">Custom Message</span>

                    <p class="line-clamp-2">
                      {alert.custom_message}
                    </p>
                  </div>
                {:else}
                  <div
                    class=" w-full h-full rounded-lg border border-white/5 p-3 flex flex-col gap-2 text-white/30">
                    <span class="text-white flex">Custom Message</span>
                    <span class="mx-auto border border-white/5 p-2 rounded-lg mt-auto"
                      >Custom message not set</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <div class="w-full h-full flex flex-col gap-2">
            <div class="border border-white/5 rounded-lg p-4 flex flex-col gap-3 w-full h-full">
              <div class="w-full flex justify-between items-start">
                <span class="text-lg text-white">Channel</span>
                <div
                  class=" text-xs lg:text-sm xl:text-md rounded-md w-15.75 py-0.5 flex justify-center items-center bg-[#00bc7d]/5 {alert.enabled
                    ? 'text-[#00bc7d] '
                    : 'text-[#fa5757] '}">
                  {alert.channel.enabled ? 'enable' : 'disable'}
                </div>
              </div>

              <div class="flex flex-col gap-3 w-full text-sm h-full">
                <div class="flex items-start flex-col gap-1 w-full">
                  <span class="text-white h-full flex justify-center">name</span>

                  <span class="text-white/30 text-sm flex items-center">{alert.channel.name}</span>
                </div>
                <div class="flex items-start flex-col gap-1 w-full">
                  <span class="text-white h-full flex justify-center">type</span>

                  <div class="flex items-center gap-1">
                    <img src="/icons/bale.png" alt="bale" width="12" />
                    <span class="text-white/30 text-sm flex items-center pt-px">
                      {alert.channel.type}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="w-full py-4 border border-white/5 flex justify-between items-center rounded-lg p-4">
              <span class="text-white text-sm">notify on recovery</span>

              <span
                class="text-sm flex items-center {alert.notify_on_recovery
                  ? 'text-[#00bc7d]'
                  : 'text-[#fa5757]'}">{alert.notify_on_recovery ? 'Yes' : 'No'}</span>
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
