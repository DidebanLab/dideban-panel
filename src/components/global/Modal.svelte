<script>
  import { modals, closer } from '../../stores/modal.svelte';

  modals;
</script>

{#each $modals as modal (modal.id)}
  <button
    type="button"
    class="fixed inset-0 z-100 bg-black/10 backdrop-blur-sm flex justify-center items-center"
    aria-label="Close modal"
    onclick={e => {
      e.stopPropagation();
      closer({ id: modal.id });
    }}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div onclick={e => e.stopPropagation()}>
      {#if typeof modal.content === 'string'}
        {@html modal.content}
      {:else}
        <svelte:component this={modal.content} />
      {/if}
    </div>
  </button>
{/each}
