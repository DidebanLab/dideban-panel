<script>
  import Alert from './../../../components/global/Alert.svelte';
  import { onDestroy, onMount, untrack } from 'svelte';
  import Pagination from '../../../components/common/Pagination.svelte';
  import Select from '../../../components/common/Select.svelte';
  import LatencyChart from '../../../components/common/LatencyChart.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  import { opener } from '../../../stores/modal.svelte';
  import { LIMITATIONS } from '../../../components/config.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteURL } from 'svelte/reactivity';
  import { off, on, subscribe, unsubscribe } from '../../../services/ws.svelte';
  import AddAlert from '../../../components/pages/alerts/AddAlert.svelte';

  let isMounted = false;
  let timeoutId = null;
  let abortController;

  let isMobile = $state(innerWidth < 641);
  let relationInfo = $state(null);
  let relationInfoLoading = $state(true);
  let paramsList = $state([]);

  let filter = $state({
    id: $page.url.searchParams.get('id') || '',
    rel: $page.url.searchParams.get('rel') || 'all',
    status: $page.url.searchParams.get('status') || 'all',
    type: $page.url.searchParams.get('type') || 'all',
    condition_type: $page.url.searchParams.get('condition_type') || 'all',
    machine_state: $page.url.searchParams.get('machine_state') || 'all',
    last_status: $page.url.searchParams.get('last_status') || 'all',
  });

  let alertStats = $state({
    total: 10,
    enabled: 8,
    disabled: 2,
    firing: 1,
    resolved: 0,
    history: {
      total: 500,
      sent: 480,
      failed: 15,
      pending: 5,
    },
  });

  let channelStats = $state({
    total: 5,
    enabled: 4,
    disabled: 1,
    by_type: {
      telegram: 2,
      bale: 1,
      email: 1,
      webhook: 1,
    },
    linked_alerts: 12,
  });

  let alertStatsLoading = $state(true);

  let alerts = $state({
    results: [
      {
        id: 1,
        check_id: 1,
        agent_id: null,
        type: 'bale',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_up',
        condition_value: null,
        enabled: false, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 2,
        check_id: 2,
        agent_id: null,
        type: 'email',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 3,
        check_id: 3,
        agent_id: null,
        type: 'webhook',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
      {
        id: 4,
        check_id: 5,
        agent_id: null,
        type: 'telegram',
        config: '{"token":"...","chat_id":"..."}',
        condition_type: 'status_down',
        condition_value: null,
        enabled: true, // enable , disable
        notify_on_recovery: true,
        repeat_interval_seconds: 300,
        escalation_delay_seconds: 0,
        machine_state: 'resolved', //idle , resolved , firing
        last_fired_at: '2026-04-10T08:30:00Z',
        last_status: 'sent',
        created_at: '2026-03-01T12:00:00Z',
      },
    ],
    count: '',
    next: '',
    prev: '',
  });

  let alertsLoading = $state(false);

  function handleCreated(data) {
    alerts = [data, ...alerts];
  }

  function handleUpdated(data) {
    const initailAlets = alerts.filter(item => item.id !== data?.id);
    alerts = [data, ...initailAlerts];
  }

  function handleDeleted(data) {
    alerts = alerts.filter(item => item.id !== data?.id);
  }

  const getAllParams = () => {
    const params = $page.url.searchParams;
    const result = [];

    const keys = [...params.keys()].filter(
      key =>
        ['id', 'rel', 'status', 'type', 'condition_type', 'machine_state', 'last_status'].includes(
          key,
        ) && params.get(key).length,
    );

    for (const key of keys) {
      const value = params.get(key);

      result.unshift([key, params.get(key)]);
    }

    return result;
  };

  function removeParam(keyToRemove) {
    const url = new SvelteURL($page.url);
    if (keyToRemove === 'id') {
      filter.id = '';
    } else {
      filter[keyToRemove] = 'all';
    }
    url.searchParams.delete(keyToRemove);
    goto(url.toString(), { keepFocus: true, noScroll: true });
  }

  function handleParameters(key, value) {
    const url = new SvelteURL($page.url);
    if (key === 'id') {
      if (url.searchParams.has('id')) {
        if (value.length) {
          url.searchParams.set('id', value);
        } else {
          url.searchParams.delete('id');
        }
      } else {
        if (value.length) {
          url.searchParams.append('id', value);
        }
      }
    } else if (value === 'all') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }

    goto(url.toString(), { keepFocus: true, noScroll: true });
  }

  function iconSelector(channel) {
    switch (channel) {
      case 'telegram':
        return `<svg
            width="20"
            class="telegram-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill='#32ABE7'
            aria-label="Telegram">
            <path d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
          </svg>`;

      case 'webhook':
        return `<div class="flex flex-col justify-center items-center">
          <span class="text-white text-xs">Web</span>
          <span class="text-white text-xs">hook</span>
          </div>`;
      //Bale icon is Fake
      case 'bale':
        return `<img src="/icons/bale.png" alt="bale" width="22" />`;

      case 'email':
        return `<img src="/icons/email.png" alt="bale" width="23" />`;
    }
  }

  onMount(async () => {
    alertStatsLoading = true;

    await http
      .get(endpoints.alertsStats)
      .then(res => {
        alertStats = res.data?.data;
      })
      .finally(() => {
        alertStatsLoading = false;
      });

    subscribe('alerts');
    on('alert.created', handleCreated);
    on('alert.updated', handleUpdated);
    on('alert.deleted', handleDeleted);
    on('alert.stats.updated', data => {
      alertStats = data;
    });
  });

  onDestroy(() => {
    off('alert.created', handleCreated);
    off('alert.updated', handleUpdated);
    off('alert.deleted', handleDeleted);
    off('alert.stats.updated', data => {
      alertStats = data;
    });

    unsubscribe('alerts');
  });

  $effect(() => {
    // alertsLoading = true;
    // alerts = null;

    const paramsEntries = getAllParams();
    const paramsObject = Object.fromEntries(paramsEntries);
    paramsList = paramsEntries;

    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!isMounted) {
      http
        .get(endpoints.alerts, { params: paramsObject })
        .then(res => {
          // alerts = res.data?.data;
        })
        .finally(() => {
          // alertsLoading = false;
        });

      untrack(() => {
        isMounted = true;
      });
    } else {
      timeoutId = setTimeout(() => {
        http
          .get(endpoints.alerts, {
            params: paramsObject,
            signal: abortController.signal,
          })
          .then(res => {
            // alerts = res.data?.data;
          })
          .finally(() => {
            // alertsLoading = false;
          });
      }, 3000);
    }
  });

  function handleGlobalKeyDown(event) {
    const isAKey = event.key === 'A' || event.code === 'KeyA';

    if ((event.ctrlKey || event.metaKey) && event.shiftKey && isAKey) {
      event.preventDefault();

      opener({
        id: 'create-alert',
        content: AddAlert,
        props: {
          // onAdded: () => {
          //   trigger += 1;
          // },
        },
      });
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleGlobalKeyDown);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
  onkeydown={event => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
      event.preventDefault();

      console.log('salam');
    }
  }}
  class="w-full flex flex-col gap-8 sm:p-7.75 sm:pt-2.5">
  <div
    class="w-full sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] h-auto flex flex-col gap-8 p-6 border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px]">
    <div class="flex flex-col justify-start items-start gap-1">
      <div class="text-lg sm:text-xl dark:text-white capitalize">Alerts Stats</div>
      <span class="text-sm text-[#99a1af]">Lorem ipsum dolor sit amet psum</span>
    </div>

    <div class="w-full h-full grid grid-cols-5 gap-3">
      <div
        class="rounded-[14px] col-span-1 border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3">
        <div
          class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
          Alert Overview
        </div>

        <div class="h-full w-full flex flex-col gap-1.75">
          <div
            class="flex justify-between items-center border-[#2B7FFF]/20 rounded-[14px] border w-full h-full relative overflow-hidden group p-1 pe-4">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
            </div>

            <span
              class="text-white bg-[#2B7FFF]/10 flex justify-center items-center rounded-xl py-2 px-3 h-full w-17.75"
              >Total
            </span>
            <span class="text-white text-2xl">{alertStats.total}</span>
          </div>

          <div
            class="flex justify-between items-center border-[#00bc7d]/20 rounded-[14px] border w-full h-full relative overflow-hidden group p-1 pe-4">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(0,212,146,0.8);">
            </div>

            <span
              class="text-white text-sm bg-[#00bc7d]/5 flex justify-center items-center rounded-xl py-2 px-3 h-full w-17.75"
              >Enable
            </span>
            <span class="text-white text-2xl">{alertStats.enabled}</span>
          </div>

          <div
            class="flex justify-between items-center border-[#FB2C36]/15 rounded-[14px] border w-full h-full relative overflow-hidden group p-1 pe-4">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(255,100,103)">
            </div>

            <span
              class="text-white text-sm bg-[#F87171]/5 flex justify-center items-center rounded-xl py-2 px-3 h-full w-17.75"
              >Disable
            </span>
            <span class="text-white text-2xl">{alertStats.disabled}</span>
          </div>
        </div>
      </div>

      <div class="w-full h-full flex-col gap-2 grid grid-cols-5 col-span-4">
        <div
          class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-start gap-2 col-span-2">
          <div
            class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
            Channels
          </div>

          <div class="w-full grid grid-rows-2 gap-2">
            <div class="w-full gap-2 h-full grid grid-cols-4">
              <div
                class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border col-span-1 h-full relative overflow-hidden group">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
                  <div class="w-full h-full bg-white/5"></div>
                </div>
                <div
                  class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl py-px">
                  <span class="text-base text-black dark:text-white">Total</span>
                </div>

                <span class=" xl:text-2xl 2xl:text-3xl text-white my-auto text-xl"
                  >{channelStats?.total || 0}</span>
              </div>

              <div class="h-full col-span-3 flex flex-col gap-2">
                <div
                  class="flex justify-between items-center border-[#00bc7d]/20 rounded-[14px] border w-full h-full relative overflow-hidden group p-1 pe-4">
                  <div
                    class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                    style="box-shadow: 0 0 100px 30px rgb(0,212,146,0.8);">
                  </div>

                  <span
                    class="text-white text-sm bg-[#00bc7d]/5 flex justify-center items-center rounded-xl py-2 px-3 h-full w-17.75"
                    >Enable
                  </span>
                  <span class="text-white text-2xl">{channelStats.enabled}</span>
                </div>

                <div
                  class="flex justify-between items-center border-[#FB2C36]/15 rounded-[14px] border w-full h-full relative overflow-hidden group p-1 pe-4">
                  <div
                    class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                    style="box-shadow: 0 0 100px 30px rgb(255,100,103)">
                  </div>

                  <span
                    class="text-white text-sm bg-[#F87171]/5 flex justify-center items-center rounded-xl py-2 px-3 h-full w-17.75"
                    >Disable
                  </span>
                  <span class="text-white text-2xl">{channelStats.disabled}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center gap-2 h-full">
              <div
                class="border-[#B5B41F]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgb(252,200,0);">
                  <div class="w-full h-full bg-white/5"></div>
                </div>
                <div
                  class="relative flex items-center justify-around gap-2.5 bg-[#B5B41F]/10 w-full rounded-xl h-[26px]">
                  <img
                    class="absolute top-1/2 -translate-y-1/2 start-1.5 w-[17px]"
                    width="18"
                    src="/icons/email.png"
                    alt="email" />
                  <span class="text-sm text-black dark:text-white pt-px">Email</span>
                </div>

                <span class="xl:text-2xl 2xl:text-3xl text-white text-xl my-auto"
                  >{channelStats?.by_type.email || 0}</span>
                <img
                  class="opacity-5 absolute bottom-0 end-0"
                  width="70"
                  src="/icons/email.png"
                  alt="email" />
              </div>
              <div
                class="border-white/10 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(255,255,255,0.5);">
                  <div class="w-full h-full bg-white/5"></div>
                </div>
                <div
                  class="relative flex items-center justify-center gap-2.5 bg-white/5 w-full rounded-xl h-[26px]">
                  <div class="flex flex-col justify-center items-center">
                    <span class="text-white text-xs">WH</span>
                  </div>

                  <span class="text-xs text-black dark:text-white flex justify-start items-end">
                    Webhook
                  </span>
                </div>

                <span class="xl:text-2xl 2xl:text-3xl text-white text-xl my-auto"
                  >{channelStats?.by_type.webhook || 0}</span>
                <div
                  class="flex justify-center items-center rounded-md bg-white/5 opacity-5 absolute bottom-1 end-0">
                  <div class="flex flex-col justify-center items-center">
                    <span class="text-white text-2xl">Web</span>
                    <span class="text-white text-lg">hook</span>
                  </div>
                </div>
              </div>
              <div
                class="border-[#28a1da]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(50, 171, 231, 1)">
                  <div class="w-full h-full bg-white/5"></div>
                </div>
                <div
                  class="relative flex items-center justify-start px-1.5 gap-2.5 bg-[#28a1da]/10 w-full rounded-xl h-[26px]">
                  <svg
                    width="19.5"
                    class="telegram-icon w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#32ABE7"
                    aria-label="Telegram">
                    <path
                      d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
                  </svg>
                  <span class="text-xs text-black dark:text-white first-letter:text-sm"
                    >Telegram</span>
                </div>

                <span class="xl:text-2xl 2xl:text-3xl text-white text-xl my-auto"
                  >{channelStats?.by_type.telegram || 0}</span>
                <svg
                  width="70"
                  class="telegram-icon opacity-10 absolute bottom-0 end-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#32ABE7"
                  aria-label="Telegram">
                  <path
                    d="M22.5 3.5L1.7 11.6c-1 .4-.9 1.8.1 2.1l5.3 1.7 2 6.3c.3.9 1.5 1.1 2.1.4l3-3.4 5.5 4.1c.8.6 2 .1 2.2-.9l3.3-17.2c.2-1.1-.8-2-1.9-1.6zm-4.3 5.2l-8.5 7.6-.3 3.1-1.4-4.4 10.2-6.3z" />
                </svg>
              </div>
              <div
                class="border-[#0ACA9B]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
                <div
                  class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
                  style="box-shadow: 0 0 100px 30px rgba(10, 202, 155, 0.7);">
                  <div class="w-full h-full bg-white/5"></div>
                </div>
                <div
                  class="relative flex items-center justify-center gap-2.5 bg-[#0ACA9B]/10 w-full rounded-xl h-[26px]">
                  <img
                    class="absolute top-1/2 -translate-y-1/2 start-1.5 w-4.5"
                    width="20"
                    src="/icons/bale.png"
                    alt="bale" />
                  <span class="text-sm text-black dark:text-white">Bale</span>
                </div>

                <span class="xl:text-2xl 2xl:text-3xl text-white text-xl my-auto"
                  >{channelStats?.by_type.bale || 0}</span>
                <img
                  class="opacity-5 absolute bottom-0 end-0"
                  width="70"
                  src="/icons/bale.png"
                  alt="bale" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-3 h-full flex flex-col gap-2">
          <div
            class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3 w-full h-full">
            <div
              class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
              State Machine
            </div>

            <div class="h-full w-full gap-0.5 flex justify-center items-center">
              <div
                style="width:{((alertStats.enabled - (alertStats.firing + alertStats.resolved)) *
                  100) /
                  alertStats.enabled}%;"
                class="bg-[#31AAE6] hover:bg-[#31AAE6]/60 rounded-s-md h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#31AAE6]"></span> idle
                  </span>

                  <span class="text-white/40"
                    >{alertStats.enabled - (alertStats.firing + alertStats.resolved)}</span>
                </div>
              </div>
              <div
                style="width:{((alertStats.enabled - alertStats.firing) * 100) /
                  alertStats.enabled}%;"
                class=" bg-[#FDC700] hover:bg-[#FDC700]/60 h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#FDC700]"></span> firing
                  </span>

                  <span class="text-white/40">{alertStats.firing}</span>
                </div>
              </div>
              <div
                style="width:{((alertStats.enabled - alertStats.resolved) * 100) /
                  alertStats.enabled}%;"
                class=" w-1/5 bg-[#00BC7D] hover:bg-[#00BC7D]/60 rounded-e-md h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#00BC7D]"></span> resolved
                  </span>

                  <span class="text-white/40">{alertStats.firing}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-start gap-12 items-end">
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#31AAE6]"></span> idle
              </span>
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#FDC700]"></span> firing
              </span>

              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#00BC7D]"></span> resolved
              </span>
            </div>
          </div>

          <div
            class="rounded-[14px] border border-[#0D0D0D]/5 dark:border-white/5 p-4 flex flex-col justify-between gap-3 w-full h-full">
            <div
              class="text-base text-white w-full border-b border-[#0D0D0D]/5 dark:border-white/5 pb-1">
              History
            </div>

            <div class="h-full w-full gap-0.5 flex justify-center items-center">
              <div
                class=" w-1/5 bg-[#31AAE6] hover:bg-[#31AAE6]/60 rounded-s-md h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#31AAE6]"></span> total
                  </span>

                  <span class="text-white/40">{alertStats.history.total}</span>
                </div>
              </div>
              <div
                class=" w-3/5 bg-[#FDC700] hover:bg-[#FDC700]/60 h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#FDC700]"></span> pending
                  </span>

                  <span class="text-white/40">{alertStats.history.pending}</span>
                </div>
              </div>
              <div
                class=" w-1/5 bg-[#00BC7D] hover:bg-[#00BC7D]/60 h-2 cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#00BC7D]"></span> sent
                  </span>

                  <span class="text-white/40">{alertStats.history.sent}</span>
                </div>
              </div>

              <div
                class=" w-1/5 bg-[#EF4444] hover:bg-[#EF4444]/60 h-2 rounded-e-full cursor-pointer relative group">
                <div
                  class="absolute hidden w-40 text-xs group-hover:flex -top-10 start-1/2 -translate-x-1/2 rounded-lg border bg-black/80 backdrop-blur-2xl border-white/15 justify-between items-center py-2 px-3">
                  <span
                    class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5 capitalize">
                    <span class="size-2 bg-[#EF4444]"></span> failed
                  </span>

                  <span class="text-white/40">{alertStats.history.failed}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-start gap-12 items-end">
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#31AAE6]"></span> total
              </span>
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#FDC700]"></span> pending
              </span>
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#00BC7D]"></span> sent
              </span>
              <span class="flex justify-center items-center text-xs text-white text-nowrap gap-1.5">
                <span class="size-2 bg-[#EF4444]"></span> failed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="w-full h-[90vh] px-6 sm:py-6 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 flex flex-col gap-7.75 overflow-y-auto custom-scroll pb-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex flex-col justify-start items-start gap-1">
        <div class="text-lg sm:text-xl dark:text-white capitalize">Alerts List</div>
        <span class="text-sm text-[#99a1af]">Lorem ipsum dolor sit amet psum</span>
      </div>

      <button
        type="button"
        onclick={() => {
          opener({
            id: 'create-alert',
            content: AddAlert,
            props: {
              // onAdded: () => {
              //   trigger += 1;
              // },
            },
          });
        }}
        class="w-10 sm:w-34.25 h-10 flex justify-center gap-2 px-4 items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
        <span class="text-nowrap text-sm hidden sm:flex justify-center items-center"
          >Add Alert</span>
        +
      </button>
    </div>
    <div class="w-full flex flex-col justify-start items-center gap-2 h-full">
      <div
        class="w-full flex flex-col justify-start items-start gap-2 border p-3 border-[#0D0D0D]/5 dark:border-white/5 rounded-lg">
        <span class="text-base text-black dark:text-white">Filter</span>
        <div class="w-full flex flex-col justify-start gap-3 items-start md:items-center z-10">
          <div
            class="flex w-full gap-1.5 px-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
            <label
              for="id"
              class="text-black dark:text-white text-base text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
              >Id</label>

            <input
              id="id"
              oninput={() => {
                handleParameters('id', filter.id);
              }}
              bind:value={filter.id}
              placeholder={`Enter ${filter.rel === 'check' ? 'checker id' : filter.rel === 'agent' ? 'agent id' : 'checker/agent id'}`}
              class="px-2.5 h-9 w-full rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
              type="text" />
          </div>

          <div class="flex justify-start items-center w-full gap-3 max-sm:flex-wrap select-none">
            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Channel</span>

              <Select
                onParamHandle={val => {
                  handleParameters('type', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.type}
                options={[
                  { name: 'all' },
                  { name: 'telegram' },
                  { name: 'bale' },
                  { name: 'email' },
                  { name: 'webhook' },
                ]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black pe-3 dark:text-white text-sm text-nowrap border-e border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >Rel</span>

              <Select
                onParamHandle={val => {
                  handleParameters('rel', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize justify-between!"
                bind:value={filter.rel}
                options={[{ name: 'all' }, { name: 'agent' }, { name: 'check' }]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20"
                >status</span>

              <Select
                onParamHandle={val => {
                  handleParameters('status', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.status}
                options={[{ name: 'all' }, { name: 'enable' }, { name: 'disable' }]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20">
                Machine State
              </span>

              <Select
                onParamHandle={val => {
                  handleParameters('machine_state', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.machine_state}
                options={[
                  { name: 'all' },
                  { name: 'idle' },
                  { name: 'firing' },
                  { name: 'resolved' },
                ]} />
            </div>

            <div
              class="flex gap-1.5 ps-3 justify-start items-center bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md">
              <span
                class="text-black dark:text-white text-sm text-nowrap border-e pe-3 border-e-[#0D0D0D]/20 dark:border-e-white/20">
                Sending status
              </span>

              <Select
                onParamHandle={val => {
                  handleParameters('last_status', val);
                }}
                className="bg-transparent! backdrop-blur-none! px-1.5! capitalize"
                bind:value={filter.last_status}
                options={[{ name: 'all' }, { name: 'sent' }, { name: 'failed' }]} />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-1.5 text-sm h-full">
        <div
          class="w-full flex gap-2 justify-start items-center border-b pb-1.5 border-[#0D0D0D]/5 dark:border-white/5">
          {#each paramsList as filteredItem}
            <div
              class="px-4 relative py-1.25 rounded-md border border-blue-500/20 shadow-md shadow-blue-500/10 text-blue-500">
              <button
                aria-label="delete filter"
                type="button"
                onclick={() => {
                  removeParam(filteredItem[0]);
                }}
                class="absolute start-0 -top-1 px-1 py-1 rounded-sm bg-[#EF4444]/15 flex justify-center items-center cursor-pointer hover:bg-[#EF4444]/20">
                <div class="bg-[#ef4444] w-2 h-0.5"></div>
              </button>

              {filteredItem[1]}
            </div>
          {/each}
        </div>

        <div class="w-full mb-0.5 flex justify-start gap-1 items-center text-white">
          <span
            class="w-12 md:w-20 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Channel</span>

          <span
            class="w-15 lg:w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md"
            >Rel</span>
          <span
            class="w-15 lg:w-18 xl:w-25 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Status</span>

          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Machine State</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Send Status</span>
          <span
            class="flex-1 text-black dark:text-white text-center py-2 backdrop-blur-3xl bg-[#0D0D0D]/5 dark:bg-white/5 rounded-md text-nowrap"
            >Date</span>
        </div>
        {#if alertsLoading}{:else if alerts}
          {#if alerts.results.length}
            {#each alerts.results as result}
              <a
                href={`/alerts/${result.id}`}
                class="w-full flex hover:scale-x-101 transition-all duration-300 justify-start items-center gap-1 rounded-xl dark:text-white sm:p-0.5 border border-[#ef444427] bg-[#640000bc]/5">
                <div class="w-20">
                  <div class="size-[42px] flex justify-start items-center me-auto">
                    <div
                      class="flex justify-center items-center w-full h-full rounded-lg {result.type ===
                      'telegram'
                        ? 'bg-[#28a1da]/10'
                        : result.type === 'bale'
                          ? 'bg-[#0ACA9B]/10 '
                          : result.type === 'email'
                            ? 'bg-[#B5B41F]/10 '
                            : result.type === 'webhook'
                              ? 'bg-white/5 '
                              : ''}">
                      {@html iconSelector(result.type)}
                    </div>
                  </div>
                </div>

                <div class=" h-full w-15 lg:w-18 xl:w-25 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="relation type"
                    onmouseenter={() => {
                      relationInfo = null;
                      relationInfoLoading = true;

                      let url;
                      if (result.check_id) {
                        http
                          .get(endpoints.singleCheck(result.check_id))
                          .then(
                            res =>
                              (relationInfo = {
                                name: res.data?.data?.name,
                                id: res.data?.data?.id,
                              }),
                          )
                          .finally(() => {
                            relationInfoLoading = false;
                          });
                      } else if (result.agent_id) {
                        http
                          .get(endpoints.singleAgent(result.agent_id))
                          .then(
                            res =>
                              (relationInfo = {
                                name: res.data?.data?.name,
                                id: res.data?.data?.id,
                              }),
                          )
                          .finally(() => {
                            relationInfoLoading = false;
                          });
                      } else return;
                    }}
                    onmouseleave={() => {
                      relationInfo = null;
                    }}
                    onfocus={() => {
                      relationInfo = null;
                      relationInfoLoading = true;

                      let url;
                      if (result.check_id) {
                        url = endpoints.singleCheck(result.check_id);
                      } else if (result.agent_id) {
                        url = endpoints.singleAgent(result.agent_id);
                      } else return;

                      http
                        .get(url)
                        .then(
                          res =>
                            (relationInfo = { name: res.data?.data?.name, id: res.data?.data?.id }),
                        )
                        .finally(() => {
                          relationInfoLoading = false;
                        });
                    }}
                    onblur={() => {
                      relationInfo = null;
                    }}
                    class="flex group relative justify-start items-center gap-1">
                    <div
                      class="text-xs cursor-pointer lg:text-sm xl:text-md text-black dark:text-white capitalize">
                      {result.agent_id ? 'Agent' : 'Check'}
                    </div>
                    <img
                      class="cursor-pointer"
                      width="20"
                      height="20"
                      src="/icons/question.png"
                      alt="question" />
                    {#if relationInfoLoading}
                      <div
                        class="absolute *:text-nowrap bottom-5 start-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
                        <div class="flex justify-between items-center w-full gap-2">
                          <span>id :</span>
                          <span class="bg-white/5 w-7 rounded-md animate-pulse h-4"></span>
                        </div>

                        <div class="flex justify-between min-w-30 items-center w-full gap-2">
                          <span>name :</span>
                          <span class="bg-white/5 w-20 rounded-md animate-pulse h-4"></span>
                        </div>
                      </div>
                    {:else if relationInfo}
                      <div
                        class="absolute *:text-nowrap bottom-5 start-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
                        <div class="flex justify-between items-center w-full gap-2">
                          <span>Id :</span>
                          <span class="text-white">{relationInfo.id}</span>
                        </div>

                        <div class="flex justify-between items-center min-w-30 w-full gap-2">
                          <span>Name :</span>
                          <span class="text-white">{relationInfo.name}</span>
                        </div>

                        <!-- svelte-ignore node_invalid_placement_ssr -->
                        <a
                          href={result.agent_id
                            ? `/agents/${result.agent_id}`
                            : `/checkers/${relationInfo.id}`}
                          aria-label="go to relation page"
                          class="text-nowrap gap-2 justify-center items-center flex cursor-pointer mt-2 hover:opacity-70 rounded-md border border-[#2B7FFF]/20 px-2 py-1 w-full text-[#2B7FFF] text-xs">
                          {result.agent_id ? 'Agent' : 'Checker'} Page
                        </a>
                      </div>
                    {:else}
                      <div
                        class="absolute text-nowrap py-2 px-3 group-hover:flex hidden bottom-5 start-1/2 -translate-x-1/2 bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl justify-center items-center overflow-hidden rounded-xl text-red-500/50 border border-[#F87171]/15 text-sm">
                        <div
                          class="w-full h-full relative flex justify-center items-center rounded-xl animate-pulse text-nowrap">
                          <div
                            class="absolute top-1/2 start-1/2 -translate-1/2 h-0 rounded-full w-1/2"
                            style="box-shadow: 0 0 500px 100px rgb(255,100,103,0.1)">
                            <div class="w-full h-full bg-white/5"></div>
                          </div>

                          <div class="flex justify-center items-center gap-1 text-nowrap">
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
                            <span class="text-red-500/70 mt-0.5 text-nowrap"
                              >Something Is Wrong</span>
                          </div>
                        </div>
                      </div>
                    {/if}
                  </button>
                </div>
                <div class=" h-full w-15 lg:w-18 xl:w-25 flex items-center justify-center">
                  <span
                    class="text-xs lg:text-sm xl:text-md capitalize rounded-md w-15.75 py-0.5 flex justify-center items-center {result.enabled
                      ? 'text-[#00bc7d]/90 bg-[#00bc7d]/5'
                      : 'text-[#fa5757]/90 bg-[#F87171]/5'}">
                    {result.enabled ? 'Enable' : 'Disable'}</span>
                </div>

                <div class=" h-full flex-1 flex items-center justify-center">
                  <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                    >{result.machine_state}</span>
                </div>
                <div class=" h-full flex-1 flex items-center justify-center gap-1">
                  {#if result.last_status === 'sent'}
                    <img class="mb-0.5 opacity-50" width="17" src="/icons/tick.svg" alt="tick" />
                  {:else if result.last_status === 'failed'}
                    <img class="mb-0.5 opacity-70" width="17" src="/icons/error.svg" alt="error" />
                  {/if}

                  <span class="text-xs lg:text-sm xl:text-md text-white capitalize"
                    >{result.last_status}</span>
                </div>
                <div class=" h-full flex-1 flex items-center justify-center gap-1">
                  <img class="mb-0.5" width="19" height="19" src="/icons/clock.png" alt="clock" />
                  <span class="text-xs lg:text-sm xl:text-sm text-white/30">
                    {new Date(result.last_fired_at).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}</span>
                </div>
              </a>
            {/each}
          {:else}
            <div class="m-auto flex flex-col justify-center items-center gap-1 w-55">
              <span class="text-white text-2xl">No alerts found</span>
              <p class="text-[#99a1af] text-center">Your alert list is currently empty.</p>
              <p class="text-[#99a1af] text-center">Add your first alert.</p>

              <div class="flex justify-center items-center gap-2 mt-2">
                <div class="flex justify-start items-center gap-0.75 text-white">
                  <span class="bg-white/10 text-[10px] px-2 py-0.75 rounded-md">Ctrl</span>
                  +
                  <span class="bg-white/10 text-[10px] px-2 py-0.75 rounded-md">Shift</span>
                  +
                  <span class="bg-white/10 text-[10px] px-2 py-0.75 rounded-md">A</span>
                </div>

                <div class=" text-white/20 text-sm">or</div>
                <button
                  type="button"
                  onclick={() => {
                    opener({
                      id: 'create-alert',
                      content: AddAlert,
                      props: {
                        // onAdded: () => {
                        //   trigger += 1;
                        // },
                      },
                    });
                  }}
                  class="py-1 flex justify-center gap-1 px-2.5 items-center bg-[#22c55e]/10 rounded-lg text-sm text-[#10b981] cursor-pointer">
                  <span class="text-nowrap text-xs hidden sm:flex justify-center items-center"
                    >Add Alert</span>
                  +
                </button>
              </div>
            </div>
          {/if}
        {:else}{/if}
      </div>
    </div>

    {#if alerts?.results?.length && alerts.count > 1}
      <Pagination {filter} count={alerts.count} prev={alerts.prev} next={alerts.next} />
    {/if}
  </div>
</section>
