<script>
  import { onMount } from 'svelte';
  import { endpoints } from '../../endpoints.svelte';
  import { http } from '../../services/http.svelte';
  import { theme } from '../../stores/theme.svelte';
  let alerts = $state([]);

  onMount(() => {
    http.get(endpoints.alerts).then(res => (alerts = res.data));
  });
</script>

<div class="mt-[0.7vw]">
  <div class="w-full flex px-[1.7vw] h-[3.8vw] justify-center items-center">
    <div
      class="w-[5.5vw] h-[2.2vw] flex justify-center items-center gap-[0.5vw] bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#e5e7eb] dark:border-white/5 rounded-[14px]">
      <span class="text-[0.63vw] text-[#99a1af]">
        {$theme === 'dark' ? 'Dark' : 'Light'}
      </span>
      <button
        aria-label="theme toggle"
        onclick={() => theme.update(t => (t === 'dark' ? 'light' : 'dark'))}
        class="w-[2.35vw] h-[1.35vw] bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full relative cursor-pointer">
        <div
          style="box-shadow: 0 5px 30px #00bc7d;"
          class="absolute top-1/2 -translate-y-1/2 left-[0.1vw] size-[1.05vw] rounded-full bg-[#00bc7d] transition-transform duration-300 ease-in-out dark:translate-x-[1vw] translate-x-0">
        </div>
      </button>
    </div>
    <div
      class="ms-[0.6vw] size-[2.2vw] p-2.5 rounded-[14px] dark:bg-white/5 bg-[#0D0D0D]/5 border border-[#e5e7eb] dark:border-white/5 flex justify-center items-center cursor-pointer">
      <div class="relative">
        <div class="size-[0.2vw] absolute -top-[0.2vw] end-0 rounded-full bg-red-500"></div>
        <img class="size-[1vw]" src="/icons/bell.png" alt="bell" />
      </div>
    </div>

    <div class="h-10 flex justify-between items-center ms-auto gap-[2vw]">
      <div class="flex flex-col gap-0.5">
        <div
          class="w-fit px-4 text-[#ff6467]/80 text-[0.63vw] flex justify-center items-center gap-2 opacity-50 scale-90">
          <div
            style="box-shadow: 0 0 10px 1px #ff6467;"
            class="hidden size-1.5 bg-[#ff6467] rounded-full">
          </div>
          <span
            class="hover:animate-pulse text-[0.63vw] hover:[text-shadow:0_0_100px_#F87171,0_0_150px_#F87171,0_0_200px_#F87171,0_0_250px_#F87171,0_0_300px_#F87171]">
            {alerts[0] ||
              'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt, ducimus?'}
          </span>
        </div>
        <div
          class="w-fit bg-[#ff6467]/10 rounded-full text-[#ff6467]/80 text-[0.63vw] flex justify-center items-center gap-2">
          <div style="box-shadow: 0 0 10px 1px #ff6467;" class="rounded-full animate-pulse">
            <img class="size-[1vw]" src="/icons/error.svg" alt="error" />
          </div>
          <span
            class="hover:animate-pulse text-[0.63vw] hover:[text-shadow:0_0_100px_#F87171,0_0_150px_#F87171,0_0_200px_#F87171,0_0_250px_#F87171,0_0_300px_#F87171]">
            {alerts[1] ||
              'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt, ducimus?'}</span>
        </div>
      </div>

      <div class="h-[2vw] w-[0.07vw] bg-[#0D0D0D]/20 dark:bg-[#FFFFFF]/20"></div>

      <div class="flex gap-[0.5vw] justify-center items-center">
        <div class="flex flex-col justify-center items-end">
          <span class="text-[0.7vw] dark:text-white">Admin</span>

          <span class="text-[0.63vw] text-[#99A1AF]">System Administrator</span>
        </div>

        <div
          class="size-[2.2vw] rounded-[10px] flex justify-center items-center bg-[#00b478] cursor-pointer">
          <img class="size-[0.9vw]" src="/icons/user.svg" alt="user" />
        </div>
      </div>
    </div>
  </div>
</div>
