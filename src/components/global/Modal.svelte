<script>
  import { modals, closer } from '../../stores/modal.svelte';
</script>

{#each $modals as modal (modal.id)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-110 bg-black/10 backdrop-blur-sm flex justify-center items-center"
    aria-label="Close modal"
    onclick={e => {
      e.stopPropagation();

      if (modal?.isOutClicker) {
        closer({ id: modal.id });
      }
    }}>
    <div onclick={e => e.stopPropagation()}>
      {#if typeof modal.content === 'string'}
        {@html modal.content}
      {:else}
        <svelte:component this={modal.content} {...modal.props} />
      {/if}
    </div>
  </div>
{/each}
