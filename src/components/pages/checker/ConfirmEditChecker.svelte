<script>
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { alertStore } from '../../../stores/alert.svelte';
  import { closer } from '../../../stores/modal.svelte';
  import { page } from '$app/stores';

  const { name, onEdited } = $props();
</script>

<div
  class="relative group overflow-hidden backdrop-blur-3xl px-3 py-2.5 border bor rounded-xl w-[90vw] max-h-[90vh] md:fit sm:w-150 flex flex-col justify-start items-start border-[#FDC700]/20 bg-[#F9FAFB] dark:bg-[#121212]">
  <div
    class="absolute -top-10 start-0 size-0 rounded-full group-hover:top-0 group-hover:start-7 transition-all duration-700"
    style="box-shadow: 0 0 120px 100px rgba(253, 199, 0, 0.2)">
    <div class="w-full h-full bg-white/5"></div>
  </div>

  <div class="flex justify-center items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
        stroke="#FDC700"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M10 6.6665V9.99984"
        stroke="#FDC700"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M10 13.3335H10.0083"
        stroke="#FDC700"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
    <span class="text-xl text-[#FDC700] mt-px">Confirm Activation Update</span>
  </div>

  <div class="w-full h-px bg-[#FDC700]/20 mt-2.5"></div>

  <div class="flex justify-between items-end">
    <div class="flex flex-col justify-start items-start gap-2 py-3 w-full">
      <span class="text-black dark:text-white text-base">Confirm Activation Update</span>

      <span class="text-[#90A1AF] text-sm"
        >This action will update the current activation status. Please confirm to proceed.
      </span>
    </div>
    <button
      onclick={() => {
        http
          .patch(endpoints.singleCheck($page.params.checker), {
            enabled: false,
          })
          .then(res => {
            onEdited?.();

            alertStore.addAlert({
              message: `Checker ${name} activation updated successfully.`,
              type: 'successful',
            });
            
            closer({
              id: 'confirm-edit',
            });
          });
      }}
      aria-label="confirm-edit"
      class="border outline-none cursor-pointer rounded-md px-4 py-1.5 bg-[#FDC700]/10 text-[#FDC700] hover:opacity-70 border-[#FDC700]/10 text-sm ms-auto"
      >Confirm
    </button>
  </div>
</div>
