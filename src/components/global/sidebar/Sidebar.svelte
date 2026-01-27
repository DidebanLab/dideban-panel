<script>
  import { page } from '$app/stores';
  import { theme } from '../../../stores/theme.svelte';
  import Support from './deps/Support.svelte';

  let isMenu = $state(false);
</script>

<div
  class="fixed 2xl:hidden flex justify-start items-center w-full bg-white dark:bg-black/10 border-b border-b-[#0D0D0D]/5 dark:border-b-[#222222] backdrop-blur-lg top-0 start-0 px-3 py-3 z-100">
  <button
    onclick={() => (isMenu = true)}
    class="text-black dark:text-white p-2 flex justify-start items-center gap-2 cursor-pointer rounded-[14px] dark:bg-white/5 bg-[#0D0D0D]/5 border border-[#e5e7eb] dark:border-white/5">
    <!-- svelte-ignore element_implicitly_closed -->
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Menu">
      <line
        class="dark:stroke-white stroke-[#686a6e]"
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke-width="2"
        stroke-linecap="round" />
      <line
        class="dark:stroke-white stroke-[#686a6e]"
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke-width="2"
        stroke-linecap="round" />
      <line
        class="dark:stroke-white stroke-[#686a6e]"
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke-width="2"
        stroke-linecap="round" />
    </svg></button>
  <div class="w-full h-full flex justify-end gap-4">
    <div
      class="py-2 w-25.75 flex justify-center items-center gap-2 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#e5e7eb] dark:border-white/5 rounded-[14px]">
      <span class="text-xs text-[#99a1af]">
        {$theme === 'dark' ? 'Dark' : 'Light'}
      </span>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        aria-label="theme toggle"
        onclick={() => theme.update(t => (t === 'dark' ? 'light' : 'dark'))}
        class="w-11 h-6 bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full relative cursor-pointer">
        <div
          style="box-shadow: 0 5px 30px #00bc7d;"
          class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full bg-[#00bc7d] transition-transform duration-300 ease-in-out dark:translate-x-5 translate-x-0">
        </div>
      </div>
    </div>
    <div
      class="size-10.5 p-2.5 rounded-[14px] dark:bg-white/5 bg-[#0D0D0D]/5 border border-[#e5e7eb] dark:border-white/5 flex justify-center items-center cursor-pointer">
      <div class="relative">
        <div class="size-1 absolute -top-1 end-0 rounded-full bg-red-500"></div>
        <img src="/icons/bell.png" alt="bell" />
      </div>
    </div>

    <div class="h-10 md:flex justify-between items-center gap-4 hidden">
      <div class="h-full w-px bg-[#0D0D0D]/20 dark:bg-[#FFFFFF]/20"></div>

      <div class="flex gap-2 justify-center items-center">
        <div class="flex flex-col justify-center items-end">
          <span class="text-sm dark:text-white">Admin</span>

          <span class="text-xs text-[#99A1AF]">System Administrator</span>
        </div>

        <div
          class="w-10.5 h-10 rounded-[14px] flex justify-center items-center bg-[#00b478] cursor-pointer">
          <img width="20" src="/icons/user.svg" alt="user" />
        </div>
      </div>
    </div>
  </div>
</div>

<button
  onclick={() => (isMenu = false)}
  class="2xl:block w-full 2xl:w-fit h-full fixed 2xl:static z-100 bg-black/10 backdrop-blur-sm {isMenu
    ? 'block'
    : 'hidden 2xl:block'}">
  <div class="absolute 2xl:hidden top-6 end-7 flex justify-center items-center cursor-pointer">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Close">
      <line
        class="stroke-black dark:stroke-white"
        x1="4"
        y1="4"
        x2="20"
        y2="20"
        stroke-width="2"
        stroke-linecap="round" />
      <line
        class="stroke-black dark:stroke-white"
        x1="20"
        y1="4"
        x2="4"
        y2="20"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round" />
    </svg>
  </div>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={e => e.stopPropagation()}
    class="h-full w-full md:w-[256px] bg-white dark:bg-[#0D0D0D] flex flex-col border-e border-[#0D0D0D]/5 dark:border-[#222222]">
    <div
      class="px-6 py-4 hidden 2xl:h-25.75 md:flex justify-start items-center border-b border-[#0D0D0D]/5 dark:border-[#222222]">
      <img src="/icons/torbu.png" alt="turbu" />
      <div class="flex flex-col ms-3 justify-center">
        <h2 class="dark:text-white font-semibold tracking-wider">Dideban</h2>
        <span class="text-[#00bc7d] text-sm">V 1.0.0</span>
      </div>
    </div>
    <div
      class="px-6 gap-4 py-4 flex 2xl:h-25.75 md:hidden justify-start items-center border-b border-[#0D0D0D]/5 dark:border-[#222222]">
      <div
        class="w-10.5 h-10 rounded-[14px] flex justify-center items-center bg-[#00b478] cursor-pointer">
        <img width="20" src="/icons/user.svg" alt="user" />
      </div>
      <div class="flex gap-2 justify-center items-center">
        <div class="flex flex-col justify-center items-start">
          <span class="text-sm dark:text-white">Admin</span>

          <span class="text-xs text-[#99A1AF]">System Administrator</span>
        </div>
      </div>
    </div>

    <div class="p-6 flex flex-col gap-4">
      <ul class="flex flex-col items-start justify-start gap-2">
        <li class="w-full rounded-[14px]">
          <a
            class="flex w-50 2xl:w-full justify-start items-center gap-3 py-2 px-2.5 rounded-[14px] {$page
              .url.pathname === '/'
              ? 'outline outline-[#00d492]/15 outline-offset-1 bg-[#00d492]/10 cursor-default'
              : 'cursor-pointer'}"
            href="/">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5"
                stroke={$page.url.pathname === '/' ? '#00D492' : '#99a1af'}
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M2.5 8.33322C2.49994 8.09078 2.55278 7.85124 2.65482 7.63132C2.75687 7.4114 2.90566 7.21639 3.09083 7.05989L8.92417 2.06073C9.22499 1.80648 9.60613 1.66699 10 1.66699C10.3939 1.66699 10.775 1.80648 11.0758 2.06073L16.9092 7.05989C17.0943 7.21639 17.2431 7.4114 17.3452 7.63132C17.4472 7.85124 17.5001 8.09078 17.5 8.33322V15.8332C17.5 16.2753 17.3244 16.6992 17.0118 17.0117C16.6993 17.3243 16.2754 17.4999 15.8333 17.4999H4.16667C3.72464 17.4999 3.30072 17.3243 2.98816 17.0117C2.67559 16.6992 2.5 16.2753 2.5 15.8332V8.33322Z"
                stroke={$page.url.pathname === '/' ? '#00D492' : '#99a1af'}
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span class="text-sm {$page.url.pathname === '/' ? 'text-[#00d492]' : 'text-[#99a1af]'}"
              >Dashboard</span
            ></a>
        </li>

        <li class="w-full">
          <a
            href="/alerts"
            class="flex w-full justify-start items-center gap-3 py-2 px-2.5 rounded-[14px] {$page
              .url.pathname === '/alerts'
              ? 'outline outline-[#00d492]/15 outline-offset-1 bg-[#00d492]/10 cursor-default'
              : 'cursor-pointer'}">
            <img src="/icons/bell.png" alt="bell" />
            <span
              class="text-sm {$page.url.pathname === '/alerts'
                ? 'text-[#00d492]'
                : 'text-[#99a1af]'}">Alerts</span
            ></a>
        </li>

        <li class="w-full">
          <a
            href="/settings"
            class="flex w-full justify-start items-center gap-3 py-2 px-2.5 rounded-[14px] {$page
              .url.pathname === '/setting'
              ? 'outline outline-[#00d492]/15 outline-offset-1 bg-[#00d492]/10 cursor-default'
              : 'cursor-pointer'}">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.1833 1.6665H9.81667C9.37464 1.6665 8.95072 1.8421 8.63816 2.15466C8.3256 2.46722 8.15 2.89114 8.15 3.33317V3.48317C8.1497 3.77544 8.07255 4.0625 7.92628 4.31553C7.78002 4.56857 7.56978 4.7787 7.31667 4.92484L6.95834 5.13317C6.70497 5.27945 6.41756 5.35646 6.125 5.35646C5.83244 5.35646 5.54503 5.27945 5.29167 5.13317L5.16667 5.0665C4.78422 4.84589 4.32987 4.78604 3.90334 4.90009C3.47681 5.01415 3.11296 5.29278 2.89167 5.67484L2.70833 5.9915C2.48772 6.37395 2.42787 6.82831 2.54192 7.25484C2.65598 7.68137 2.93461 8.04521 3.31667 8.2665L3.44167 8.34984C3.69356 8.49526 3.90302 8.70408 4.04921 8.95553C4.1954 9.20698 4.27325 9.49231 4.275 9.78317V10.2082C4.27617 10.5019 4.19971 10.7906 4.05337 11.0453C3.90703 11.2999 3.69601 11.5113 3.44167 11.6582L3.31667 11.7332C2.93461 11.9545 2.65598 12.3183 2.54192 12.7448C2.42787 13.1714 2.48772 13.6257 2.70833 14.0082L2.89167 14.3248C3.11296 14.7069 3.47681 14.9855 3.90334 15.0996C4.32987 15.2136 4.78422 15.1538 5.16667 14.9332L5.29167 14.8665C5.54503 14.7202 5.83244 14.6432 6.125 14.6432C6.41756 14.6432 6.70497 14.7202 6.95834 14.8665L7.31667 15.0748C7.56978 15.221 7.78002 15.4311 7.92628 15.6841C8.07255 15.9372 8.1497 16.2242 8.15 16.5165V16.6665C8.15 17.1085 8.3256 17.5325 8.63816 17.845C8.95072 18.1576 9.37464 18.3332 9.81667 18.3332H10.1833C10.6254 18.3332 11.0493 18.1576 11.3618 17.845C11.6744 17.5325 11.85 17.1085 11.85 16.6665V16.5165C11.8503 16.2242 11.9275 15.9372 12.0737 15.6841C12.22 15.4311 12.4302 15.221 12.6833 15.0748L13.0417 14.8665C13.295 14.7202 13.5824 14.6432 13.875 14.6432C14.1676 14.6432 14.455 14.7202 14.7083 14.8665L14.8333 14.9332C15.2158 15.1538 15.6701 15.2136 16.0967 15.0996C16.5232 14.9855 16.887 14.7069 17.1083 14.3248L17.2917 13.9998C17.5123 13.6174 17.5721 13.163 17.4581 12.7365C17.344 12.31 17.0654 11.9461 16.6833 11.7248L16.5583 11.6582C16.304 11.5113 16.093 11.2999 15.9466 11.0453C15.8003 10.7906 15.7238 10.5019 15.725 10.2082V9.7915C15.7238 9.49782 15.8003 9.20904 15.9466 8.95441C16.093 8.69978 16.304 8.48834 16.5583 8.3415L16.6833 8.2665C17.0654 8.04521 17.344 7.68137 17.4581 7.25484C17.5721 6.82831 17.5123 6.37395 17.2917 5.9915L17.1083 5.67484C16.887 5.29278 16.5232 5.01415 16.0967 4.90009C15.6701 4.78604 15.2158 4.84589 14.8333 5.0665L14.7083 5.13317C14.455 5.27945 14.1676 5.35646 13.875 5.35646C13.5824 5.35646 13.295 5.27945 13.0417 5.13317L12.6833 4.92484C12.4302 4.7787 12.22 4.56857 12.0737 4.31553C11.9275 4.0625 11.8503 3.77544 11.85 3.48317V3.33317C11.85 2.89114 11.6744 2.46722 11.3618 2.15466C11.0493 1.8421 10.6254 1.6665 10.1833 1.6665Z"
                stroke={$page.url.pathname === '/settings' ? '#00D492' : '#99a1af'}
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                stroke={$page.url.pathname === '/settings' ? '#00D492' : '#99a1af'}
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span
              class="text-sm {$page.url.pathname === '/settings'
                ? 'text-[#00d492]'
                : 'text-[#99a1af]'}">Settings</span
            ></a>
        </li>
      </ul>
    </div>

    <!-- Help section in slider-->
    <!-- <Support /> -->
  </div>
</button>
