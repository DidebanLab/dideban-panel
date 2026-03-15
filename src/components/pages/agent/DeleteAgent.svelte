<script>
  import { onMount } from 'svelte';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { alertStore } from '../../../stores/alert.svelte';
  import { closer } from '../../../stores/modal.svelte';
  import { goto } from '$app/navigation';

  let step = $state(1);
  let nameInput = $state('');
  let nameRef = $state();
  let { name, id } = $props();

  $effect(() => {
    if (step === 2) {
      nameRef?.focus();
    }
  });
</script>

<div
  class="relative group overflow-hidden backdrop-blur-3xl px-3 py-2.5 border bor rounded-xl w-[90vw] max-h-[90vh] md:fit sm:w-150 flex flex-col justify-start items-start border-[#F87171]/20 bg-[#F9FAFB] dark:bg-[#121212]">
  <div
    class="absolute -top-10 start-0 size-0 rounded-full group-hover:top-0 group-hover:start-7 transition-all duration-700"
    style="box-shadow: 0 0 120px 100px rgb(255,100,103,0.1)">
    <div class="w-full h-full bg-white/5"></div>
  </div>

  <div class="flex justify-center items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <span class="text-xl text-red-500/70 mt-px">Danger Zone</span>
  </div>

  <div class="w-full h-px bg-[#F87171]/20 mt-2.5"></div>
  <div class="flex justify-between items-end w-full gap-10">
    <div class="flex flex-col justify-start items-start gap-2 pt-2 w-full">
      <span class="text-black dark:text-white text-base">Delete This Agent</span>
      {#if step === 1}
        <span class="text-[#90A1AF] text-sm"
          >Once you delete a Agent, there is no going back. Please be certain.
        </span>
      {:else if step === 2}
        <span class="text-[#90A1AF] text-sm"
          >To confirm, type <span class="text-red-500/70">"{name}"</span> in the box below
        </span>
        <input
          bind:this={nameRef}
          bind:value={nameInput}
          placeholder="Please enter the agent name"
          class="px-3 h-9 w-full bg-[#0D0D0D]/5 dark:bg-white/5 backdrop-blur-sm rounded-lg placeholder:text-gray-400/40 text-gray-400 text-sm outline-none tracking-wide"
          type="text" />
      {/if}
    </div>

    <button
      disabled={step === 2 && name.toLowerCase() !== nameInput.toLowerCase()}
      onclick={() => {
        if (step === 1) {
          step = 2;
        } else if (step === 2) {
          http.delete(endpoints.singleAgent(id)).then(res => {
            alertStore.addAlert({
              message: res.data.data.message,
              type: 'successful',
            });
          });

          closer({
            id: 'delete-agent',
          });

          goto('/');
        }
      }}
      aria-label="delete-confirm"
      class="border cursor-pointer border-red-500/30 rounded-md px-4 hover:opacity-70 py-1.5 text-red-500/90 text-sm ms-auto disabled:border-red-500/10 disabled:text-red-500/30 disabled:cursor-not-allowed"
      >Delete
    </button>
  </div>
</div>
