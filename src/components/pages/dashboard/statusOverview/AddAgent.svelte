<script>
  import { endpoints } from '../../../../endpints.svelte';
  import { http } from '../../../../services/http.svelte';
  import { closer } from '../../../../stores/modal.svelte';
  import Select from '../../../common/Select.svelte';
  import { AGENT_LIMIT } from '../../../config.svelte';

  const form = $state({
    enabled: true,
    name: '',
    token: '',
    timeout: 3,
    interval: 1,
  });

  function addAgentHandler() {
    http.post(endpoints.agents, {
      ...form,
    });
  }
</script>

<div
  class="bg-[#F9FAFB] dark:bg-[#121212] backdrop-blur-3xl border border-[#0D0D0D]/5 dark:border-white/10 rounded-xl w-150 flex flex-col">
  <div
    class="relative text-black dark:text-white border-b py-2 border-b-[#0D0D0D]/5 dark:border-b-white/10 flex justify-center items-center text-base capitalize">
    add new agent
    <div class="absolute end-3 top-2">
      <div class="flex justify-around items-center gap-2">
        <span class="text-xs w-[47.5px] {form.enabled ? 'text-[#00bc7d]' : 'text-[#6a7282]'}">
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
  <div class="flex flex-col justify-start items-start p-6 gap-6">
    <div class="flex flex-col justify-start items-start gap-1.5 w-full">
      <span class="text-white text-sm">Name</span>
      <input
        bind:value={form.name}
        placeholder="Please enter the checker name"
        class="px-3 h-9 w-full bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
        type="text" />
    </div>

    <div class="flex flex-col w-full">
      <div class="flex flex-col gap-1.5 justify-start items-start w-full pb-8">
        <span class="text-white text-sm">Authentication token</span>

        <input
          bind:value={form.token}
          placeholder="Please enter the authentication token"
          class="px-3 h-9 w-full bg-white/5 backdrop-blur-sm rounded-md placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
          type="text" />
      </div>

      <div
        class="flex justify-between items-center text-sm border-b pb-2 border-b-[#0D0D0D]/5 dark:border-b-white/10">
        <div class="flex justify-start items-center gap-1">
          <span class="flex justify-center items-center text-white">Timeout</span>
          <span class="flex justify-center items-center text-gray-400/40">(seconds)</span>
        </div>

        <div class="relative w-15 flex">
          <input
            type="number"
            value={form.timeout}
            oninput={e => {
              form.timeout = Number(e.target.value);
            }}
            onblur={e => {
              const value = Number(e.target.value);
              if (Number.isNaN(value) || value < AGENT_LIMIT.timeout.min)
                form.timeout = AGENT_LIMIT.timeout.min;
              else if (value > AGENT_LIMIT.timeout.max) form.timeout = AGENT_LIMIT.timeout.max;
            }}
            class="px-3 h-6.5 w-full bg-white/5 backdrop-blur-sm rounded-md
           text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

          <!-- Custom Arrows -->
          <div
            class="absolute end-2 top-1/2 -translate-y-1/2
           flex flex-col justify-center items-center gap-2.5 h-full">
            <button
              type="button"
              onclick={() => form.timeout < AGENT_LIMIT.timeout.max && (form.timeout += 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▲
            </button>

            <button
              type="button"
              onclick={() => form.timeout > AGENT_LIMIT.timeout.min && (form.timeout -= 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▼
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center text-sm pt-2">
        <div class="flex justify-start items-center gap-1">
          <span class="flex justify-center items-center mr-1 text-white">Interval</span>
          <span class="flex justify-center items-center text-gray-400/40">(seconds)</span>
        </div>

        <div class="relative w-15 flex">
          <input
            type="number"
            value={form.interval}
            oninput={e => {
              form.interval = Number(e.target.value);
            }}
            onblur={e => {
              const value = Number(e.target.value);
              if (Number.isNaN(value) || value < AGENT_LIMIT.interval.min)
                form.interval = AGENT_LIMIT.interval.min;
              else if (value > AGENT_LIMIT.interval.max) form.interval = AGENT_LIMIT.interval.max;
            }}
            class="px-3 h-6.5 w-full bg-white/5 backdrop-blur-sm rounded-md
           text-gray-400 text-sm outline-none tracking-wide appearance-none text-center" />

          <!-- Custom Arrows -->
          <div
            class="absolute end-2 top-1/2 -translate-y-1/2
           flex flex-col justify-center items-center gap-2.5 h-full">
            <button
              type="button"
              onclick={() => form.interval < AGENT_LIMIT.interval.max && (form.interval += 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▲
            </button>

            <button
              type="button"
              onclick={() => form.interval > AGENT_LIMIT.interval.min && (form.interval -= 1)}
              class="size-0.5 flex items-center justify-center
             text-gray-500 hover:text-gray-300 scale-75 cursor-pointer">
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      disabled={!(form.name && form.token && form.timeout && form.interval)}
      onclick={() => {
        addAgentHandler();
        closer({
          id: 'create-agents',
        });
      }}
      type="button"
      class="mt-10 me-auto w-fit px-10 text-sm text-[#10b981] h-8.5 flex justify-center items-center rounded-md cursor-pointer bg-[#22c55e]/10 hover:opacity-60 border border-[#00bc7d]/10 disabled:opacity-30 disabled:cursor-not-allowed">
      Add Agent
    </button>
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
