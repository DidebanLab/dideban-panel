<script>
  import { onMount } from 'svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import { http } from '../../../../services/http.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { closer } from '../../../../stores/modal.svelte';
  import Select from '../../../common/Select.svelte';
  import { CHECK_LIMIT } from '../../../config.svelte';
  import { fly } from 'svelte/transition';
  import { checkerNameRegex, checkerTargetRegexes } from '../../../../validators.svelte';

  const { data, onEdited } = $props();

  let nameInput;

  let body = $state(data?.config?.body ?? '');

  let httpConfig = $state({
    method: data?.config?.method,
    expected_status: data?.config?.expected_status ?? 200,
    expected_content: data?.config?.expected_content ?? '',
    follow_redirects: data?.config?.follow_redirects,
    verify_ssl: data?.config?.verify_ssl,
    headers: data?.config?.headers
      ? Object.entries(data.config.headers).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }],
  });

  let pingConfig = $state({
    count: data?.config?.count,
    size: data?.config?.size,
    interval: data?.config?.interval,
  });

  let form = $state({
    name: data?.name,
    target: data?.target,
    timeout_seconds: data?.timeout_seconds,
    interval_seconds: data?.interval_seconds,
    enabled: data?.enabled ?? true,
    type: data?.type,
  });

  function normalizeHeaders(headersArray) {
    return headersArray.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});
  }

  function editCheckerHandler() {
    let detail = { ...form };

    if (form.type === 'http') {
      const normalizedHeaders = normalizeHeaders(httpConfig.headers);

      const config = {
        ...httpConfig,
        headers: normalizedHeaders,
      };

      if (httpConfig.method === 'PATCH' || httpConfig.method === 'POST') {
        detail = { ...detail, config: { ...config, body } };
      } else {
        detail = { ...detail, config };
      }
    } else if (form.type === 'ping') {
      detail = { ...detail, config: { ...pingConfig, size: +pingConfig.size } };
    }

    http.patch(endpoints.singleCheck(data.id), detail).then(res => {
      onEdited?.();

      alertStore.addAlert({
        message: `checker ${res.data.data.name} updated successfully.`,
        type: 'successful',
      });

      closer({ id: 'edit-check' });
    });
  }

  onMount(() => {
    nameInput?.focus();
  });
</script>

<div
  class="bg-[#F9FAFB] dark:bg-[#121212] backdrop-blur-3xl border border-[#0D0D0D]/5 dark:border-white/10 rounded-xl w-[90vw] max-h-[90vh] md:h-fit sm:w-150 flex flex-col">
  <div
    class="relative text-black dark:text-white border-b py-2 border-b-[#0D0D0D]/5 dark:border-b-white/10 flex justify-center items-center text-base capitalize">
    Edit check
  </div>
  <div
    class="relative flex flex-col justify-start items-start p-6 gap-6 custom-scroll overflow-y-auto">
    <div class="flex flex-col justify-start items-start gap-1.5 w-full">
      <span class="text-black dark:text-white text-sm">Name</span>
      <input
        bind:this={nameInput}
        bind:value={form.name}
        placeholder="Please enter the checker name"
        class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
        type="text" />

      {#if !checkerNameRegex.test(form.name)}
        <span
          in:fly={{ y: -5, duration: 500 }}
          out:fly={{ y: -5, duration: 200 }}
          class="mt-1 block text-xs text-red-400">
          Name must be 1–100 characters and contain only letters, numbers, space, "-" or "_"
        </span>
      {/if}
    </div>
    <div
      class="w-full flex flex-col sm:flex-row justify-start sm:justify-between items-start gap-6 z-11">
      <div class="flex flex-col justify-start items-start gap-1.5 w-full z-10">
        <span class="text-black dark:text-white text-sm">Type</span>
        <Select
          bind:value={form.type}
          title="Select type"
          options={[{ name: 'http' }, { name: 'ping' }]} />
      </div>
      <div class="flex flex-col justify-start items-start gap-1.5 w-full">
        <span class="text-sm text-black dark:text-white {form.type ? '' : 'opacity-20'}"
          >Target</span>
        <input
          bind:value={form.target}
          disabled={!form.type}
          placeholder={form.type === 'http'
            ? 'Please enter the url'
            : form.type === 'ping'
              ? 'Please enter the hostname'
              : 'Please select a type first'}
          class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
          type="text" />

        {#if (form.target && form.type === 'http' && !checkerTargetRegexes.http.test(form.target)) || (form.type === 'ping' && !checkerTargetRegexes.ping.test(form.target))}
          <span
            in:fly={{ y: -5, duration: 500 }}
            out:fly={{ y: -5, duration: 200 }}
            class="mt-1 block text-xs text-red-400 tracking-tight">
            {#if form.type === 'http'}
              Must be a valid URL (http/https + host/port/path)
            {:else if form.type === 'ping'}
              Must be a valid hostname or IPv4
            {/if}
          </span>
        {/if}
      </div>
    </div>

    {#if form.type}
      <div class="flex flex-col gap-2 w-full">
        <div class="w-full flex flex-col rounded-xl border border-[#0D0D0D]/5 dark:border-white/10">
          <div
            class="border-b border-b-[#0D0D0D]/5 dark:border-b-white/10 h-9 flex justify-start sm:justify-center items-center w-full relative">
            <span
              class="flex justify-center items-center capitalize text-sm tracking-wide text-black dark:text-white px-4"
              >{form.type} setting</span>

            {#if form.type === 'http'}
              <Select
                className="w-[131.5px]! justify-end! bg-transparent! px-1.5! rounded-xl! h-6! z-2 absolute! end-1 "
                bind:value={httpConfig.method}
                options={[
                  { name: 'GET' },
                  { name: 'PUT' },
                  { name: 'DELETE' },
                  { name: 'POST' },
                ]} />
            {/if}
          </div>
          <div class="p-4 w-full h-full flex flex-col max-h-70 overflow-y-auto custom-scroll">
            {#if form.type === 'http'}
              <div class="flex flex-col gap-1.5 justify-start items-start w-full">
                <span class="text-gray-400 text-sm">Header</span>
                <div
                  class="w-full overflow-y-auto custom-scroll h-fit max-h-32 flex flex-col gap-1.5">
                  {#each httpConfig.headers as header, i}
                    <div class="flex justify-between items-center gap-1.5 w-full relative">
                      <input
                        bind:value={httpConfig.headers[i].key}
                        placeholder="Key"
                        class="px-3 h-9 w-1/4 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                        type="text" />
                      <input
                        bind:value={httpConfig.headers[i].value}
                        placeholder="Value"
                        class="px-3 h-9 w-3/4 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
                        type="text" />
                      {#if header === httpConfig.headers[httpConfig.headers.length - 1] && header !== httpConfig.headers[0]}
                        <button
                          onclick={() => {
                            httpConfig.headers.pop();
                          }}
                          type="button"
                          class="absolute start-0 -bottom-6 w-6 h-4 rounded-md bg-[#EF4444]/10 text-[#ef4444] flex justify-center items-center text-base cursor-pointer hover:bg-[#EF4444]/20">
                          -
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
              <button
                onclick={() => httpConfig.headers.push({ key: '', value: '' })}
                type="button"
                class="flex justify-center items-center gap-1.5 ms-auto text-gray-400 cursor-pointer hover:text-gray-200 transition-all mt-2 mb-4">
                <span class="flex justify-center items-center text-[13px]">Add Header</span>
                <span class="flex justify-center items-center text-base">+</span>
              </button>

              {#if form.type === 'http' && (httpConfig.method === 'POST' || httpConfig.method === 'PUT')}
                <div class="flex flex-col gap-1.5 w-full justify-start items-start mb-6">
                  <span class="text-sm text-gray-400 capitalize">Body</span>
                  <textarea
                    bind:value={body}
                    placeholder="Enter your body"
                    class="p-3 h-30 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm resize-none placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide rounded-md"
                    name="body"
                    id="body">
                  </textarea>
                </div>
              {/if}
            {/if}

            <div
              class="flex justify-between items-center text-sm text-gray-400 border-b pb-2 border-b-[#0D0D0D]/5 dark:border-b-white/10">
              <div class="flex justify-start items-center gap-1">
                <span class="flex justify-center items-center">timeout</span>
                <span class="flex justify-center items-center text-gray-400/40">(seconds)</span>
              </div>

              <div class="relative w-15 flex">
                <input
                  type="number"
                  value={form.timeout_seconds}
                  oninput={e => {
                    form.timeout_seconds = Number(e.target.value);
                  }}
                  onblur={e => {
                    const value = Number(e.target.value);
                    if (Number.isNaN(value) || value < CHECK_LIMIT.timeoutSeconds.min)
                      form.timeout_seconds = CHECK_LIMIT.timeoutSeconds.min;
                    else if (value > CHECK_LIMIT.timeoutSeconds.max)
                      form.timeout_seconds = CHECK_LIMIT.timeoutSeconds.max;
                  }}
                  class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

                <!-- Custom Arrows -->
                <div
                  class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.5 h-full">
                  <button
                    type="button"
                    onclick={() =>
                      form.timeout_seconds < CHECK_LIMIT.timeoutSeconds.max &&
                      (form.timeout_seconds += 1)}
                    class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                    ▲
                  </button>

                  <button
                    type="button"
                    onclick={() =>
                      form.timeout_seconds > CHECK_LIMIT.timeoutSeconds.min &&
                      (form.timeout_seconds -= 1)}
                    class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                    ▼
                  </button>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center text-sm text-gray-400 border-b py-2 border-b-[#0D0D0D]/5 dark:border-b-white/10">
              <div class="flex justify-start items-center gap-1">
                <span class="flex justify-center items-center mr-1">Interval</span>
                <span class="flex justify-center items-center text-gray-400/40">(seconds)</span>
              </div>

              <div class="relative w-15 flex">
                <input
                  type="number"
                  value={form.interval_seconds}
                  oninput={e => {
                    form.interval_seconds = Number(e.target.value);
                  }}
                  onblur={e => {
                    const value = Number(e.target.value);
                    if (Number.isNaN(value) || value < CHECK_LIMIT.intervalSeconds.min)
                      form.interval_seconds = CHECK_LIMIT.intervalSeconds.min;
                    else if (value > CHECK_LIMIT.intervalSeconds.max)
                      form.interval_seconds = CHECK_LIMIT.intervalSeconds.max;
                  }}
                  class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

                <div
                  class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.5 h-full">
                  <button
                    type="button"
                    onclick={() =>
                      form.interval_seconds < CHECK_LIMIT.intervalSeconds.max &&
                      (form.interval_seconds += 1)}
                    class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                    ▲
                  </button>

                  <button
                    type="button"
                    onclick={() =>
                      form.interval_seconds > CHECK_LIMIT.intervalSeconds.min &&
                      (form.interval_seconds -= 1)}
                    class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                    ▼
                  </button>
                </div>
              </div>
            </div>
            {#if form.type === 'http'}
              <div
                class="flex justify-between items-center text-sm text-gray-400 py-2 border-b border-b-[#0D0D0D]/5 dark:border-b-white/10">
                <span class="flex justify-center items-center">Expected status code</span>

                <input
                  bind:value={httpConfig.expected_status}
                  class="px-3 h-6.5 w-15 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide text-center"
                  type="text" />
              </div>

              <div
                class="flex flex-col gap-2.75 w-full justify-start items-start pt-2.5 pb-3.75 border-b border-b-[#0D0D0D]/5 dark:border-b-white/10">
                <div class="flex justify-start items-center gap-1 text-sm">
                  <span class="flex justify-center items-center text-gray-400"
                    >Expected content</span>
                  <span class="flex justify-center items-center text-gray-400/40">(optional)</span>
                </div>
                <textarea
                  bind:value={httpConfig.expected_content}
                  placeholder="Enter expected content (optional)"
                  class="p-3 h-30 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm resize-none placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide rounded-md"
                  name="expected_content"
                  id="expected_content">
                </textarea>
              </div>
              <div
                class="flex justify-between items-center text-sm text-gray-400 py-2 border-b border-b-[#0D0D0D]/5 dark:border-b-white/10">
                <span class="flex justify-center items-center">Follow HTTP Redirects</span>

                <button
                  aria-label="status toggle"
                  onclick={() => (httpConfig.follow_redirects = !httpConfig.follow_redirects)}
                  class="w-11 h-6 rounded-full relative cursor-pointer {httpConfig.follow_redirects
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={httpConfig.follow_redirects ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {httpConfig.follow_redirects
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
              <div class="flex justify-between items-center text-sm text-gray-400 pt-1.5">
                <span class="flex justify-center items-center">Verify SSL Certificates</span>

                <button
                  aria-label="status toggle"
                  onclick={() => (httpConfig.verify_ssl = !httpConfig.verify_ssl)}
                  class="w-11 h-6 rounded-full relative cursor-pointer {httpConfig.verify_ssl
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={httpConfig.verify_ssl ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {httpConfig.verify_ssl
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
            {:else}
              <div
                class="flex justify-between items-center text-sm text-gray-400 py-2 border-b border-b-[#0D0D0D]/5 dark:border-b-white/10">
                <span class="flex justify-center items-center">Ping count</span>

                <div class="relative w-15 flex">
                  <input
                    bind:value={pingConfig.count}
                    type="number"
                    class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

                  <div
                    class="absolute end-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-2.5 h-full">
                    <button
                      type="button"
                      class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                      ▲
                    </button>
                    <button
                      type="button"
                      class="size-0.5 flex items-center justify-center text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center text-sm text-gray-400 pt-2">
                <div class="flex justify-start items-center gap-1 text-sm">
                  <span class="flex justify-center items-center text-gray-400">Packet size</span>
                  <span class="flex justify-center items-center text-gray-400/40">(bytes)</span>
                </div>

                <input
                  bind:value={pingConfig.size}
                  class="px-3 h-6.5 w-15 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide text-center"
                  type="text" />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    <div class="w-full flex justify-between items-center md:mt-10">
      <button
        disabled={!(
          (form.name &&
            form.target &&
            checkerNameRegex.test(form.name) &&
            form.type === 'http' &&
            checkerTargetRegexes.http.test(form.target)) ||
          (form.type === 'ping' && checkerTargetRegexes.ping.test(form.target))
        )}
        onclick={() => {
          editCheckerHandler();
        }}
        type="button"
        class="me-auto w-fit px-5 sm:px-10 text-sm text-[#10b981] h-8.5 flex justify-center items-center rounded-md cursor-pointer bg-[#22c55e]/10 hover:opacity-60 border border-[#00bc7d]/10 disabled:opacity-50 disabled:dark:opacity-30 disabled:cursor-not-allowed">
        Edit Checker
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
