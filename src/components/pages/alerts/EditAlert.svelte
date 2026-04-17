<script>
  import { closer } from '../../../stores/modal.svelte.js';
  import { onMount } from 'svelte';
  import { endpoints } from '../../../endpoints.svelte.js';
  import { http } from '../../../services/http.svelte.js';
  import { alertStore } from '../../../stores/alert.svelte.js';
  import Select from '../../common/Select.svelte';
  import { fly } from 'svelte/transition';

  let idInput;
  let {
    data = {
      check_id: 2,
      agent_id: null,
      type: 'telegram',
      config: '{"token":"1234:ABC","chat_id":"987654"}',
      condition_type: 'status_down',
      condition_value: null,
      timeout: 10,
      enabled: true,
      notify_on_recovery: true,
      repeat_interval_seconds: 300,
      escalation_delay_seconds: 60,
    },
    onEdited,
    id,
  } = $props();

  let form = $state({
    id,
    rel: data?.check_id ? 'check' : 'agent',
    type: data?.type,
    condition_type: data?.condition_type,
    condition_value: data?.condition_value,
    enabled: data?.enabled,
    notify_on_recovery: data?.notify_on_recovery,
    timeout: data?.timeout,
    repeat_interval_seconds: data?.repeat_interval_seconds,
    escalation_delay_seconds: data?.escalation_delay_seconds,
  });

  let telegramConfig = $state({
    token: null,
    chat_id: null,
  });

  let baleConfig = $state({
    token: null,
    chat_id: null,
  });

  let emailConfig = $state({
    smtp_host: null,
    smtp_port: 587,
    username: null,
    password: null,
    from: null,
    to: [''],
    use_starttls: true,
  });

  let webhookConfig = $state({
    url: null,
    method: 'POST',
    headers: [
      { key: 'Authorization', value: '' },
      { key: 'X-Custom-Header', value: '' },
    ],
    retry_count: 3,
  });

  let isBaleTokenChanged = $state(false);
  let isTelegramTokenChanged = $state(false);

  let baleTokenVisibility = $state(false);
  let telegramTokenVisibility = $state(false);
  let passwordVisibility = $state(false);

  function normalizeHeaders(headersArray) {
    return headersArray.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  function addAlertHandler() {
    let detail = { ...form };

    if (form.type === 'webhook') {
      const normalizedHeaders = normalizeHeaders(webhookConfig.headers);

      const config = {
        ...webhookConfig,
        headers: normalizedHeaders,
      };
    } else if (form.type === 'telegram') {
      detail = { ...detail, config: { ...telegramConfig } };
    } else if (form.type === 'bale') {
      detail = { ...detail, config: { ...baleConfig } };
    } else if (form.type === 'email') {
      detail = { ...detail, config: { ...emailConfig } };
    } else return;

    http.post(endpoints.alerts, detail).then(res => {
      onAdded?.();

      alertStore.addAlert({
        message: `New alert has been added successfully.`,
        type: 'successful',
      });

      closer({
        id: 'create-alert',
      });
    });
  }

  onMount(() => {
    idInput?.focus();
  });
</script>

<div
  class="bg-[#F9FAFB] dark:bg-[#121212] backdrop-blur-3xl border border-[#0D0D0D]/5 dark:border-white/10 rounded-xl w-[90vw] max-h-[90vh] md:h-fit sm:w-150 flex flex-col">
  <div
    class="relative text-black dark:text-white border-b py-2 border-b-[#0D0D0D]/5 dark:border-b-white/10 flex justify-center items-center text-base capitalize">
    Add New Alert
  </div>
  <div
    class="relative flex flex-col justify-start items-start p-6 gap-6 custom-scroll overflow-y-auto">
    <div class="flex flex-col justify-start items-start gap-1.5 w-full">
      <div class="flex items-center gap-1">
        <span class="text-black dark:text-white text-sm">Id</span>
        <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
      </div>
      <input
        bind:this={idInput}
        bind:value={form.id}
        placeholder="Please enter the checker/agent (id)"
        class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
        type="text" />
    </div>

    <div class="flex items-center gap-2 w-full z-20">
      <div class="flex flex-col justify-start items-start gap-1.5 w-full z-20">
        <div class="flex items-center gap-1">
          <span class="text-black dark:text-white text-sm">Relation</span>
          <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
        </div>
        <Select
          className="capitalize!"
          bind:value={form.rel}
          title="Select Relation"
          options={[{ name: 'agent' }, { name: 'check' }]} />
      </div>
      <div class="flex flex-col justify-start items-start gap-1.5 w-full z-20">
        <div class="flex items-center gap-1">
          <span class="text-black dark:text-white text-sm">Type</span>
          <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
        </div>
        <Select
          className="capitalize!"
          bind:value={form.type}
          title="Select Type"
          options={[
            { name: 'bale' },
            { name: 'email' },
            { name: 'webhook' },
            { name: 'telegram' },
          ]} />
      </div>
    </div>

    <div class="flex items-center gap-2 w-full z-10">
      <div class="flex flex-col justify-start items-start gap-1.5 w-full z-10">
        <div class="flex items-center gap-1">
          <span class="text-black dark:text-white text-sm">Condition type</span>
          <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
        </div>
        <Select
          className="capitalize!"
          bind:value={form.condition_type}
          title="Select Condition Type"
          options={[
            { name: 'status_down' },
            { name: 'status_up' },
            { name: 'status_timeout' },
            { name: 'cpu_above' },
            { name: 'memory_above' },
            { name: 'disk_above' },
          ]} />
      </div>
      <div class="flex flex-col justify-start items-start gap-1.5 w-full z-10">
        <div class="flex items-center gap-1">
          <span
            class="text-black dark:text-white text-sm {form.condition_type === 'status_down' ||
            form.condition_type === 'status_timeout' ||
            form.condition_type === 'status_up'
              ? 'text-black/5 dark:text-white/5'
              : ''}">Condition value</span>
          <span
            class="text-black/10 dark:text-white/10 text-sm {form.condition_type ===
              'status_down' ||
            form.condition_type === 'status_timeout' ||
            form.condition_type === 'status_up'
              ? 'hidden'
              : ''}">(required)</span>
        </div>
        <input
          disabled={form.condition_type === 'status_down' ||
            form.condition_type === 'status_timeout' ||
            form.condition_type === 'status_up'}
          bind:value={form.condition_value}
          placeholder="Please enter the checker/agent (id)"
          class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide {form.condition_type ===
            'status_down' ||
          form.condition_type === 'status_timeout' ||
          form.condition_type === 'status_up'
            ? 'opacity-30'
            : ''}"
          type="text" />
      </div>
    </div>
    <div
      class="flex w-full justify-between items-center text-sm text-gray-400 border-b pb-2 border-b-[#0D0D0D]/5 dark:border-b-white/10">
      <div class="flex justify-start items-center gap-1">
        <span class="flex justify-center items-center text-white">Timeout</span>
        <span class="flex justify-center items-center text-black/10 dark:text-white/10"
          >(seconds)</span>
      </div>

      <div class="relative w-15 flex">
        <input
          type="number"
          bind:value={form.timeout}
          oninput={e => {
            form.timeout = Number(e.target.value);
          }}
          onblur={e => {
            const value = Number(e.target.value);
            if (Number.isNaN(value) || value < 10) form.timeout = 10;
          }}
          class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

        <!-- Custom Arrows -->
        <div
          class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.25 h-full">
          <button
            type="button"
            onclick={() => (form.timeout += 1)}
            class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
            ▲
          </button>

          <button
            type="button"
            onclick={() => {
              if (form.timeout > 10) form.timeout -= 1;
            }}
            class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
            ▼
          </button>
        </div>
      </div>
    </div>

    {#if form.type}
      <div class="flex flex-col gap-2 w-full text-sm">
        <div class="w-full flex flex-col rounded-xl border border-[#0D0D0D]/5 dark:border-white/10">
          <div
            class="border-b border-b-[#0D0D0D]/5 dark:border-b-white/10 h-9 flex justify-start sm:justify-center items-center w-full relative">
            <span
              class="flex justify-center items-center capitalize text-sm tracking-wide text-black dark:text-white px-4"
              >{form.type} config</span>
          </div>
          <div class="p-4 w-full h-full flex flex-col max-h-70 overflow-y-auto custom-scroll gap-4">
            {#if form.type === 'webhook'}
              <div
                class="w-full flex flex-col sm:flex-row justify-start sm:justify-between items-start gap-2 z-11">
                <div class="flex flex-col justify-start items-start gap-1.5 w-35 z-10">
                  <span class="text-gray-400 text-sm">Method</span>
                  <Select
                    bind:value={webhookConfig.method}
                    title="Select method"
                    options={[
                      { name: 'GET' },
                      { name: 'POST' },
                      { name: 'PUT' },
                      { name: 'DELETE' },
                    ]} />
                </div>

                <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-400 text-sm">Url</span>
                    <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                  </div>
                  <input
                    bind:value={webhookConfig.url}
                    placeholder="Please enter the url"
                    class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                    type="text" />
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex flex-col gap-1.5 justify-start items-start w-full">
                  <span class="text-gray-400 text-sm">Headers</span>
                  <div
                    class="w-full overflow-y-auto custom-scroll h-fit max-h-32 flex flex-col gap-1.5">
                    {#each webhookConfig.headers as header, i}
                      <div class="flex justify-between items-center gap-1.5 w-full relative">
                        <input
                          bind:value={webhookConfig.headers[i].key}
                          placeholder="Key"
                          class="px-3 h-9 w-1/4 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                          type="text" />
                        <input
                          bind:value={webhookConfig.headers[i].value}
                          placeholder="Value"
                          class="px-3 h-9 w-3/4 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                          type="text" />
                        {#if i > 0}
                          <button
                            type="button"
                            class="absolute right-2 top-1/2 text-md cursor-pointer -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#ef4444] hover:bg-[#EF4444]/20 transition-colors z-10"
                            onclick={() => {
                              webhookConfig.headers.splice(i, 1);
                            }}>
                            -
                          </button>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
                <button
                  onclick={() => webhookConfig.headers.push({ key: '', value: '' })}
                  type="button"
                  class="flex justify-center items-center gap-1.5 ms-auto text-gray-400 cursor-pointer hover:text-gray-200 transition-all mt-1">
                  <span class="flex justify-center items-center text-[13px]">Add Header</span>
                  <span class="flex justify-center items-center text-base">+</span>
                </button>
              </div>

              <div
                class="flex justify-between items-center text-sm text-gray-400 border-t pt-2 border-t-[#0D0D0D]/5 dark:border-t-white/10">
                <span class="text-gray-400 text-sm">Retry count</span>

                <div class="relative w-15 flex">
                  <input
                    type="number"
                    bind:value={webhookConfig.retry_count}
                    oninput={e => {
                      webhookConfig.retry_count = Number(e.target.value);
                    }}
                    onblur={e => {
                      const value = Number(e.target.value);
                      if (Number.isNaN(value) || value < 0) {
                        webhookConfig.retry_count = 0;
                      }
                    }}
                    class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

                  <!-- Custom Arrows -->
                  <div
                    class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.5 h-full">
                    <button
                      type="button"
                      onclick={() => (webhookConfig.retry_count += 1)}
                      class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                      ▲
                    </button>

                    <button
                      type="button"
                      onclick={() => (webhookConfig.retry_count -= 1)}
                      class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            {:else if form.type === 'bale'}
              <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-sm">Token</span>
                  <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                </div>
                <div
                  class="flex items-center justify-center w-full h-9 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden px-3">
                  <input
                    bind:value={baleConfig.token}
                    oncopy={e => e.preventDefault()}
                    oncontextmenu={e => e.preventDefault()}
                    onkeypress={e => {
                      if (!isBaleTokenChanged) {
                        baleConfig.token = '';

                        isBaleTokenChanged = true;
                      }
                    }}
                    placeholder="Please enter token"
                    class="flex pt-px pe-3 h-9 w-full rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                    type={baleTokenVisibility ? 'text' : 'password'} />

                  <button
                    class="flex justify-center items-center {!isBaleTokenChanged
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'}"
                    onclick={() => {
                      if (isBaleTokenChanged) {
                        baleTokenVisibility = !baleTokenVisibility;
                      }
                    }}
                    type="button">
                    <img
                      width="20"
                      src={baleTokenVisibility ? '/icons/eye-slash.png' : '/icons/eye.png'}
                      alt="password display" /></button>
                </div>
              </div>

              <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-sm">Chat id</span>
                  <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                </div>
                <input
                  bind:value={baleConfig.chat_id}
                  placeholder="Please enter chat id"
                  class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                  type="text" />
              </div>
            {:else if form.type === 'telegram'}
              <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-sm">Token</span>
                  <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                </div>
                <div
                  class="flex items-center justify-center w-full h-9 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden px-3">
                  <input
                    placeholder="Please enter token"
                    oncopy={e => e.preventDefault()}
                    oncontextmenu={e => e.preventDefault()}
                    onkeypress={e => {
                      if (!isTelegramTokenChanged) {
                        telegramConfig.token = '';

                        isTelegramTokenChanged = true;
                      }
                    }}
                    bind:value={telegramConfig.token}
                    class="flex pt-px pe-3 h-9 w-full rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                    type={telegramTokenVisibility ? 'text' : 'password'} />

                  <button
                    class="flex justify-center items-center {!isTelegramTokenChanged
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'}"
                    onclick={() => {
                      if (isTelegramTokenChanged) {
                        telegramTokenVisibility = !telegramTokenVisibility;
                      }
                    }}
                    type="button">
                    <img
                      width="20"
                      src={telegramTokenVisibility ? '/icons/eye-slash.png' : '/icons/eye.png'}
                      alt="password display" /></button>
                </div>
              </div>

              <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-sm">Chat id</span>
                  <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                </div>
                <input
                  bind:value={telegramConfig.chat_id}
                  placeholder="Please enter chat id"
                  class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                  type="text" />
              </div>
            {:else if form.type === 'email'}
              <div class=" flex w-full gap-2">
                <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-400 text-sm">Smtp host</span>
                    <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                  </div>
                  <input
                    bind:value={emailConfig.smtp_host}
                    placeholder="Please enter smtp_host"
                    class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                    type="text" />
                </div>

                <div class="flex flex-col w-50 text-sm text-gray-400 gap-1.5">
                  <div class="flex justify-start items-center gap-1">
                    <span class="flex justify-center items-center">Smtp Port</span>
                    <span class="flex justify-center items-center text-gray-400/40"
                      >(required)</span>
                  </div>

                  <div class="relative w-full flex">
                    <input
                      type="number"
                      bind:value={emailConfig.smtp_port}
                      oninput={e => {
                        emailConfig.smtp_port = Number(e.target.value);
                      }}
                      onblur={e => {
                        const value = Number(e.target.value);
                        if (Number.isNaN(value) || value < 1) emailConfig.smtp_port = 465;
                      }}
                      class="px-3 h-9 w-full text-start bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none" />

                    <!-- Custom Arrows -->
                    <div
                      class="absolute end-3 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.5 h-full">
                      <button
                        type="button"
                        onclick={() => (emailConfig.smtp_port += 1)}
                        class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                        ▲
                      </button>

                      <button
                        type="button"
                        onclick={() => (emailConfig.smtp_port -= 1)}
                        class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-400 text-sm">Username</span>
                    <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                  </div>
                  <input
                    bind:value={emailConfig.username}
                    placeholder="Please enter your username"
                    class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                    type="text" />
                </div>

                <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-400 text-sm">Password</span>
                    <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                  </div>
                  <div
                    class="flex items-center justify-center w-full h-9 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden px-3">
                    <input
                      placeholder="Please enter your password"
                      bind:value={emailConfig.password}
                      class="flex pt-px pe-3 h-9 w-full rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                      type={passwordVisibility ? 'text' : 'password'} />

                    <button
                      class="flex justify-center items-center cursor-pointer"
                      onclick={() => (passwordVisibility = !passwordVisibility)}
                      type="button">
                      <img
                        width="20"
                        src={passwordVisibility ? '/icons/eye-slash.png' : '/icons/eye.png'}
                        alt="password display" /></button>
                  </div>
                </div>
              </div>

              <div class="flex flex-col justify-start items-start gap-1.5 w-full">
                <div class="flex items-center gap-1">
                  <span class="text-gray-400 text-sm">From</span>
                  <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                </div>
                <input
                  bind:value={emailConfig.from}
                  placeholder="Please enter the sender's address"
                  class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                  type="text" />
              </div>

              <div class="flex flex-col w-full">
                <div class="flex flex-col gap-1.5 justify-start items-start w-full">
                  <div class="flex items-center gap-1">
                    <span class="text-gray-400 text-sm">To</span>
                    <span class="text-black/10 dark:text-white/10 text-sm">(required)</span>
                  </div>
                  <div class="w-full overflow-y-auto custom-scroll max-h-25 flex flex-col gap-1.5">
                    {#each emailConfig.to as receiver, i}
                      <div class="flex justify-between items-center gap-1.5 w-full relative">
                        <input
                          bind:value={emailConfig.to[i]}
                          placeholder="Value"
                          class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                          type="text" />
                        {#if i > 0}
                          <button
                            type="button"
                            class="absolute right-2 top-1/2 text-md cursor-pointer -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#ef4444] hover:bg-[#EF4444]/20 transition-colors z-10"
                            onclick={() => {
                              emailConfig.to.splice(i, 1);
                            }}>
                            -
                          </button>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
                <button
                  onclick={() => emailConfig.to.push('')}
                  type="button"
                  class="flex justify-center items-center gap-1.5 ms-auto text-gray-400 cursor-pointer hover:text-gray-200 transition-all mt-2 mb-4">
                  <span class="flex justify-center items-center text-[13px]">Add Recipient</span>
                  <span class="flex justify-center items-center text-base">+</span>
                </button>
              </div>

              <div class="flex items-center w-full justify-between">
                <span class="text-sm text-gray-400">Url starttls</span>
                <button
                  aria-label="status toggle"
                  onclick={() => (emailConfig.use_starttls = !emailConfig.use_starttls)}
                  class="w-11 h-6 rounded-full relative cursor-pointer {emailConfig.use_starttls
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={emailConfig.use_starttls ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {emailConfig.use_starttls
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="flex flex-col gap-2 w-full">
      <div
        class="flex w-full justify-between items-center text-sm text-gray-400 border-b pb-2 border-b-[#0D0D0D]/5 dark:border-b-white/10">
        <div class="flex justify-start items-center gap-1">
          <span class="flex justify-center items-center text-white">Repeat interval</span>
          <span class="flex justify-center items-center text-black/10 dark:text-white/10"
            >(seconds)</span>
        </div>

        <div class="relative w-15 flex">
          <input
            type="number"
            bind:value={form.repeat_interval_seconds}
            oninput={e => {
              form.repeat_interval_seconds = Number(e.target.value);
            }}
            onblur={e => {
              const value = Number(e.target.value);
              if (Number.isNaN(value) || value < 0) form.repeat_interval_seconds = 0;
            }}
            class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

          <!-- Custom Arrows -->
          <div
            class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.25 h-full">
            <button
              type="button"
              onclick={() => (form.repeat_interval_seconds += 1)}
              class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
              ▲
            </button>

            <button
              type="button"
              onclick={() => {
                if (form.repeat_interval_seconds) form.repeat_interval_seconds -= 1;
              }}
              clas
              class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
              ▼
            </button>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-between items-center text-sm text-gray-400">
        <div class="flex justify-start items-center gap-1">
          <span class="flex justify-center items-center text-white">Escalation delay</span>
          <span class="flex justify-center items-center text-black/10 dark:text-white/10"
            >(seconds)</span>
        </div>

        <div class="relative w-15 flex">
          <input
            type="number"
            bind:value={form.escalation_delay_seconds}
            oninput={e => {
              form.escalation_delay_seconds = Number(e.target.value);
            }}
            onblur={e => {
              const value = Number(e.target.value);
              if (Number.isNaN(value) || value < 0) form.escalation_delay_seconds = 0;
            }}
            class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

          <!-- Custom Arrows -->
          <div
            class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.25 h-full">
            <button
              type="button"
              onclick={() => (form.escalation_delay_seconds += 1)}
              class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
              ▲
            </button>

            <button
              type="button"
              onclick={() => {
                if (form.escalation_delay_seconds) form.escalation_delay_seconds -= 1;
              }}
              class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-70 cursor-pointer">
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center text-sm w-full">
      <span class="flex justify-center items-center text-white text-sm">Notify of eecovery</span>

      <button
        aria-label="notify on recovery toggle"
        onclick={() => (form.notify_on_recovery = !form.notify_on_recovery)}
        class="w-11 h-6 rounded-full relative cursor-pointer {form.notify_on_recovery
          ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
          : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
        <div
          style={form.notify_on_recovery ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
          class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {form.notify_on_recovery
            ? 'translate-x-5 bg-[#00bc7d]'
            : 'translate-x-0 bg-[#4d4d4d]'}">
        </div>
      </button>
    </div>

    <div class="w-full flex justify-between items-center md:mt-10">
      <button
        disabled={!(
          form.id &&
          form.rel &&
          form.condition_type &&
          (form.type === 'telegram'
            ? telegramConfig.chat_id && telegramConfig.token
            : form.type === 'bale'
              ? baleConfig.chat_id && baleConfig.token
              : form.type === 'email'
                ? emailConfig.smtp_host &&
                  emailConfig.smtp_port &&
                  emailConfig.username &&
                  emailConfig.password &&
                  emailConfig.from &&
                  emailConfig.to[0].length
                : form.type === 'webhook' && webhookConfig.url)
        )}
        onclick={() => {
          addAlertHandler();
        }}
        type="button"
        class="me-auto w-fit px-5 sm:px-10 text-sm text-[#10b981] h-8.5 flex justify-center items-center rounded-md cursor-pointer bg-[#22c55e]/10 hover:opacity-60 border border-[#00bc7d]/10 disabled:opacity-50 disabled:dark:opacity-30 disabled:cursor-not-allowed">
        Add Alert
      </button>
      <div class="flex justify-around items-center gap-3">
        <span class="text-sm w-[47.5px] {form.enabled ? 'text-[#00bc7d]' : 'text-[#6a7282]'}">
          {form.enabled ? 'Enabled' : 'Disabled'}
        </span>
        <button
          aria-label="status toggle"
          onclick={() => (form.enabled = !form.enabled)}
          class="w-11 h-6 rounded-full relative cursor-pointer {form.enabled
            ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
            : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
          <div
            style={form.enabled ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
            class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {form.enabled
              ? 'translate-x-5 bg-[#00bc7d]'
              : 'translate-x-0 bg-[#4d4d4d]'}">
          </div>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
