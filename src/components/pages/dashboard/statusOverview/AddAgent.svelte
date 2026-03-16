<script>
  import { onMount } from 'svelte';
  import { endpoints } from '../../../../endpoints.svelte';
  import { http } from '../../../../services/http.svelte';
  import { alertStore } from '../../../../stores/alert.svelte';
  import { closer } from '../../../../stores/modal.svelte';
  import Select from '../../../common/Select.svelte';
  import { AGENT_LIMIT } from '../../../config.svelte';
  import { agentNameRegex } from '../../../../validators.svelte';
  import { fly } from 'svelte/transition';

  const form = $state({
    enabled: true,
    name: null,
    interval_seconds: 10,
  });

  let nameInput;

  onMount(() => {
    nameInput?.focus();
  });

  let token = $state();
  let tokenVisibility = $state(false);
  let isCopy = $state();

  function addAgentHandler() {
    http
      .post(endpoints.agents, {
        ...form,
      })
      .then(res => {
        token = res.data.data.auth_token;
        alertStore.addAlert({
          message: `Agent ${res.data.data.name} has been added successfully.`,
          type: 'successful',
        });
      });
  }
</script>

<div
  class=" backdrop-blur-3xl border rounded-xl w-[90vw] max-h-[90vh] md:h-fit sm:w-150 flex flex-col {token
    ? 'border-[#0D0D0D]/5 dark:border-[#00bc7d]/10 bg-[#F9FAFB] dark:bg-[#121212]'
    : 'border-[#0D0D0D]/5 dark:border-white/10 bg-[#F9FAFB] dark:bg-[#121212]'}">
  {#if !token}
    <div
      class=" text-black dark:text-white border-b py-2 border-b-[#0D0D0D]/5 dark:border-b-white/10 flex justify-center items-center text-base capitalize">
      add new agent
    </div>
  {/if}

  <div
    class="relative flex flex-col justify-start items-start p-6 gap-6 custom-scroll overflow-y-auto">
    {#if !token}
      <div class="flex flex-col justify-start items-start gap-1.5 w-full">
        <span class="text-black dark:text-white text-sm">Name</span>
        <input
          bind:this={nameInput}
          bind:value={form.name}
          placeholder="Please enter the agent name"
          class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
          type="text" />
        {#if !agentNameRegex.test(form.name)}
          <span
            in:fly={{ y: -5, duration: 500 }}
            out:fly={{ y: -5, duration: 200 }}
            class="mt-1 block text-xs text-red-400">
            Name must be 1–100 characters and contain only letters, numbers, space, "-" or "_"
          </span>
        {/if}
      </div>
      <div class="flex justify-between items-center text-sm w-full">
        <div class="flex justify-start items-center gap-1">
          <span class="flex justify-center items-center mr-1 text-black dark:text-white"
            >Interval</span>
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
              if (Number.isNaN(value) || value < AGENT_LIMIT.intervalSeconds.min)
                form.interval_seconds = AGENT_LIMIT.intervalSeconds.min;
              else if (value > AGENT_LIMIT.intervalSeconds.max)
                form.interval_seconds = AGENT_LIMIT.intervalSeconds.max;
            }}
            class="px-3 h-6.5 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-md
           text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

          <!-- Custom Arrows -->
          <div
            class="absolute end-2 top-1/2 -translate-y-1/2
           flex flex-col justify-center items-center gap-2.5 h-full">
            <button
              type="button"
              onclick={() =>
                form.interval_seconds < AGENT_LIMIT.intervalSeconds.max &&
                (form.interval_seconds += 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▲
            </button>

            <button
              type="button"
              onclick={() =>
                form.interval_seconds > AGENT_LIMIT.intervalSeconds.min &&
                (form.interval_seconds -= 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▼
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if token}<div class="flex flex-col justify-start items-start gap-3 w-full">
        <div class="flex justify-start items-center gap-2 w-full relative">
          <img width="18" src="/icons/tick.svg" alt="tick" />
          <span class="text-black dark:text-white text-sm">Feed Token</span>

          {#if isCopy}
            <span
              class="text-[#00B478] text-xs transition-all duration-300 bg-[#22c55e]/10 px-2 py-1 rounded-md absolute top-1/2 -translate-y-1/2 end-0"
              >Copied</span>
          {:else}
            <button
              class="cursor-pointer flex justify-center items-center absolute top-1/2 -translate-y-1/2 end-0"
              onclick={() => {
                isCopy = true;
              }}
              type="button">
              <img width="18" src="/icons/copy.png" alt="copy" />
            </button>
          {/if}
        </div>
        <div
          class="flex items-center justify-center w-full h-9 bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden px-3">
          <input
            disabled
            value={token}
            class="h-9 flex pt-px w-full text-gray-400 text-xs outline-none tracking-wide pe-3"
            type={tokenVisibility ? 'text' : 'password'} />

          <button
            class="flex justify-center items-center cursor-pointer"
            onclick={() => (tokenVisibility = !tokenVisibility)}
            type="button">
            <img
              width="20"
              src={tokenVisibility ? '/icons/eye-slash.png' : '/icons/eye.png'}
              alt="password display" /></button>
        </div>

        <span class="text-[#99A1AF] text-xs lg:text-sm text-start"
          >Make sure you save it - you won't be able to access it again.</span>
      </div>{/if}

    {#if !token}
      <div class="w-full flex justify-between items-center md:mt-10">
        <button
          disabled={!(form.name && form.interval_seconds && agentNameRegex.test(form.name))}
          onclick={() => {
            addAgentHandler();
          }}
          type="button"
          class="me-auto w-fit px-10 text-sm text-[#10b981] h-8.5 flex justify-center items-center rounded-md cursor-pointer bg-[#22c55e]/10 hover:opacity-60 border border-[#00bc7d]/10 disabled:opacity-50 disabled:dark:opacity-30 disabled:cursor-not-allowed">
          Add Agent
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
    {/if}
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
