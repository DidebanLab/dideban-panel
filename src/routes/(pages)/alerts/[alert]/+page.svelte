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
    check_id: 2,
    agent_id: null,
    type: 'telegram',
    config: { token: 'ABC', chat_id: '987654' },
    condition_type: 'cpu_above',
    condition_value: 'ali',
    timeout: 10,
    enabled: true,
    notify_on_recovery: true,
    repeat_interval_seconds: 20,
    escalation_delay_seconds: 60,
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
    <div class="w-full grid grid-cols-12 gap-4">
      <div
        class="col-span-5 lg:border border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl flex flex-col gap-2">
      </div>
      <div
        class="col-span-7 lg:border flex flex-col gap-4 border-[#0D0D0D]/5 dark:border-white/5 p-5 lg:rounded-xl">
        <div class="flex justify-between items-start text-sm w-full">
          <span class="flex justify-center items-center text-white text-sm sm:text-lg"
            >Alert Config</span>

          <div
            class="border w-20 py-1.5 rounded-lg flex justify-center items-center {alert.enabled
              ? 'text-[#00bc7d] bg-[#00bc7d]/5 border-[#00bc7d]/15'
              : 'text-[#fa5757] bg-[#F87171]/5 border-[#F87171]/15'}">
            {alert.enabled ? 'Enable' : 'Disable'}
          </div>
        </div>

        <div class="w-full grid grid-cols-12 gap-2 h-full">
          <div
            class="flex-col flex w-full h-full gap-3 col-span-4 p-4 border border-[#0D0D0D]/10 dark:border-white/5 rounded-xl">
            <span class="text-white text-base">Type</span>

            <div class=" flex flex-col gap-1.5 w-full h-full">
              <div
                class="flex justify-between items-center border-[#0ACA9B]/20 rounded-[10px] border hover:scale-x-98 transition-all duration-300 w-full h-full relative overflow-hidden group p-1 pe-4">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(10, 202, 155, 0.7);">
                </div>
                <div class="text-[#0ACA9B]/40 text-base absolute top-1/2 start-1/2 -translate-1/2">
                  Bale
                </div>

                <div class="size-[37px] flex justify-start items-center">
                  <div
                    class="flex justify-center items-center w-full h-full rounded-md bg-[#0ACA9B]/10">
                    <img src="/icons/bale.png" alt="bale" width="22" />
                  </div>
                </div>
                <span class="text-[#0ACA9B] text-xl">3</span>
              </div>
              <div
                class="flex justify-between items-center border-[#B5B41F]/20 rounded-[10px] border hover:scale-x-98 transition-all duration-300 w-full h-full relative overflow-hidden group p-1 pe-4">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgb(252,200,0);">
                </div>
                <div class="text-[#B5B41F]/30 text-base absolute top-1/2 start-1/2 -translate-1/2">
                  Email
                </div>

                <div class="size-[37px] flex justify-start items-center">
                  <div
                    class="flex justify-center items-center w-full h-full rounded-md bg-[#B5B41F]/10">
                    <img src="/icons/email.png" alt="bale" width="23" />
                  </div>
                </div>
                <span class="text-[#B5B41F] text-xl">3</span>
              </div>
              <div
                class="flex justify-between items-center border-[#28a1da]/20 rounded-[10px] border hover:scale-x-98 transition-all duration-300 w-full h-full relative overflow-hidden group p-1 pe-4">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(50, 171, 231, 1)">
                </div>
                <div class="text-[#28a1da]/30 text-base absolute top-1/2 start-1/2 -translate-1/2">
                  Telegram
                </div>

                <div class="size-[37px] flex justify-start items-center">
                  <div
                    class="flex justify-center items-center w-full h-full rounded-md bg-[#28a1da]/10">
                    <svg
                      width="19.5"
                      class="telegram-icon me-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#32ABE7"
                      aria-label="Telegram">
                      <path
                        d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
                    </svg>
                  </div>
                </div>
                <span class="text-[#28a1da] text-xl">3</span>
              </div>
              <div
                class="flex justify-between items-center border-white/10 rounded-[10px] border hover:scale-x-98 transition-all duration-300 w-full h-full relative overflow-hidden group p-1 pe-4">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(255,255,255,0.5);">
                </div>
                <div class="text-white/15 text-base absolute top-1/2 start-1/2 -translate-1/2">
                  Webhook
                </div>

                <div class="size-[37px] flex justify-start items-center">
                  <div class="flex justify-center items-center w-full h-full rounded-md bg-white/5">
                    <div class="flex flex-col justify-center items-center">
                      <span class="text-white text-[10px]">Web</span>
                      <span class="text-white text-[10px]">hook</span>
                    </div>
                  </div>
                </div>
                <span class="text-white text-xl">3</span>
              </div>
            </div>
          </div>

          <div
            class="flex-col flex w-full h-full gap-3 col-span-3 p-4 border border-[#0D0D0D]/10 dark:border-white/5 rounded-xl">
            <span class="text-white text-base">Type</span>
          </div>

          <div class="col-span-5 border border-white"></div>
        </div>
      </div>
    </div>
  </div>
</section>
