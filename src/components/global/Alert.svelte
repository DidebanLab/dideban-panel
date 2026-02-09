<script>
  import { onDestroy } from 'svelte';
  import { alertStore } from '../../stores/alert.svelte';
  import { fly, fade } from 'svelte/transition';

  let alerts = $state([]);

  const unsubscribe = alertStore.subscribe(value => {
    alerts = value;
  });

  onDestroy(unsubscribe);

  function handleClose(id) {
    alertStore.removeAlert(id);
  }

  function getAlertMeta(type) {
    if (type === 'error')
      return {
        icon: '/icons/error.svg',
        className: 'border-[#EF4444]/10 bg-[#1c0101]/30',
        shadow: '#EF4444',
      };

    if (type === 'successful')
      return {
        icon: '/icons/tick.svg',
        className: ' border-[#00bc7d]/10 bg-[#00b478]/5',
        shadow: '#00b478',
      };

    return {
      icon: '/icons/warn.png',
      className: 'border-[#fdc700]/10 bg-[#fdc700]/5 ',
      shadow: '#fdc700',
    };
  }

  $effect(() => {
    if (!alerts.length) return;

    const timer = setTimeout(() => {
      alertStore.removeAlert(alerts[0].id);
    }, 3000);

    return () => clearTimeout(timer);
  });
</script>

<div
  class="fixed top-4 lg:top-6 left-0 right-0 z-1000 flex flex-col items-center space-y-1 lg:space-y-3">
  {#each alerts as alert (alert.id)}
    {@const meta = getAlertMeta(alert.type)}

    <div
      in:fly={{ y: -10, opacity: 0, duration: 1000 }}
      out:fly={{ x: 200, opacity: 0, duration: 1000 }}
      class={`relative group overflow-hidden backdrop-blur-2xl rounded-md border p-4 w-80 sm:w-[80%] lg:w-[70%] xl:w-[40%] flex items-center gap-2 text-sm lg:text-[15px] text-[#7c7c7c] transition-all ${meta.className}`}>
      <!-- glow -->
      <div
        class="absolute -top-2 start-0 size-0 rounded-full
        group-hover:top-5 group-hover:start-20 transition-all duration-1000"
        style="box-shadow: 0 0 120px 50px {meta.shadow}">
      </div>

      <img
        src={meta.icon}
        alt="alert type"
        width="20"
        height="20"
        class="absolute start-4 top-4.5" />

      <div class="flex flex-col justify-center items-start">
        <p class="indent-7 leading-relaxed text-black dark:text-white first-letter:capitalize">
          {alert.message}
        </p>

        {#if alert?.details}
          <p class="indent-7 leading-relaxed text-[#99A1AF] first-letter:capitalize">
            {alert.details}
          </p>
        {/if}
      </div>

      <button type="button" onclick={() => handleClose(alert.id)}>
        <img
          src="/icons/close.png"
          alt="close"
          width="18"
          height="18"
          class="cursor-pointer absolute top-2 end-2" />
      </button>
    </div>
  {/each}
</div>
