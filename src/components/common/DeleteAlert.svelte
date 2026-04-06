<script>
  import { http } from '../../services/http.svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { alertStore } from '../../stores/alert.svelte';
  import { goto } from '$app/navigation';
  import { onDestroy, onMount } from 'svelte';
  import { closer } from '../../stores/modal.svelte';

  let { type } = $props();

  let count = $state(10);
  let interval = $state(null);

  function startCountdown() {
    if (interval || count <= 0) return;

    interval = setInterval(() => {
      if (count > 1) {
        count--;
      } else {
        clearInterval(interval);
        interval = null;

        goto('/');
        closer({
          id: 'delete-alert',
        });
      }
    }, 1000);
  }

  function stopCountdown() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopCountdown();
    } else {
      if (count > 0) {
        startCountdown();
      }
    }
  }

  onMount(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startCountdown();
  });

  onDestroy(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    stopCountdown();
  });
</script>

<div
  class="relative group overflow-hidden backdrop-blur-3xl px-3 py-2.5 border bor rounded-xl w-[90vw] max-h-[90vh] md:fit sm:w-150 flex flex-col justify-start items-start border-[#2B7FFF]/20 bg-[#F9FAFB] dark:bg-[#121212]">
  <div
    class="absolute -top-10 start-0 size-0 rounded-full group-hover:top-0 group-hover:start-7 transition-all duration-700"
    style="box-shadow: 0 0 120px 100px rgba(43, 127, 255, 0.2)">
    <div class="w-full h-full bg-white/5"></div>
  </div>

  <div class="flex justify-center items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
        stroke="#2B7FFF"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M10 6.6665V9.99984"
        stroke="#2B7FFF"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M10 13.3335H10.0083"
        stroke="#2B7FFF"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
    <span class="text-xl text-[#2B7FFF] mt-px">Notice</span>
  </div>

  <div class="w-full h-px bg-[#2B7FFF]/20 mt-2.5"></div>
  <div class="flex flex-col sm:flex-row justify-between items-end w-full gap-2 sm:gap-4">
    <div class="flex flex-col justify-start items-start gap-2 pt-2 w-full">
      <span class="text-black dark:text-white text-base"
        >This {type === 'check' ? 'Checker' : 'Agent'} has been removed by another user.</span>

      <span class="text-[#90A1AF] text-sm">
        You will be redirected to the dashboard in <span class="text-[#2B7FFF]">{count}</span> seconds.
      </span>
    </div>

    <button
      onclick={() => {
        goto('/');
        closer({
          id: 'delete-alert',
        });
      }}
      aria-label="go to dashboard"
      class="text-nowrap border cursor-pointer border-[#2B7FFF]/15 rounded-md px-4 hover:opacity-70 py-1.5 text-[#2B7FFF] text-sm ms-auto">
      Go to dashboard
    </button>
  </div>
</div>
