<script>
  let { filter = $bindable(), count, prev = null, next = null } = $props();

  function setOffsetFromLink(link) {
    const params = new URLSearchParams(link);
    const newOffset = Number(params.get('offset'));

    filter = {
      ...filter,
      offset: newOffset,
    };
  }

  const currentPage = $derived(Math.floor(filter.offset / filter.limit) + 1);

  const totalPages = $derived(Math.ceil(count));

  const pages = $derived(() => {
    const result = [];
    if (totalPages <= 1) return result;

    result.push(1);

    if (currentPage > 4) result.push('...');

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      result.push(i);
    }

    if (currentPage < totalPages - 3) result.push('...');

    result.push(totalPages);
    return result;
  });
</script>

<ul class="flex items-center justify-center flex-wrap size-7 text-sm text-[#7c7c7c] w-full mt-2">
  <li>
    <button
      type="button"
      aria-label="prev button"
      class={`flex items-center justify-center px-1 size-7 rounded-md ${
        !prev ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#e7e7e7]'
      }`}
      onclick={() => prev && setOffsetFromLink(prev)}>
      <svg
        class="size-2.5 rtl:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 1 1 5l4 4" />
      </svg>
    </button>
  </li>

  {#each pages as page}
    <li>
      <button
        class={`flex items-center justify-center px-2.5 mx-px pt-1 pb-0.5 rounded-md ${
          currentPage === page
            ? 'bg-[#f89021] text-white'
            : page === '...'
              ? 'cursor-default'
              : 'cursor-pointer hover:bg-[#e7e7e7]'
        }`}
        onclick={() =>
          page !== '...' &&
          (filter = {
            ...filter,
            offset: (page - 1) * filter.limit,
          })}
        type="button"
        aria-label="page selection button">
        {page}</button>
    </li>
  {/each}

  <li>
    <button
      class={`flex items-center justify-center px-1 size-7 rounded-md ${
        !next ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#e7e7e7]'
      }`}
      type="button"
      aria-label="next button"
      onclick={() => next && setOffsetFromLink(next)}>
      <svg
        class="size-2.5 rtl:rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 9 4-4-4-4" />
      </svg>
    </button>
  </li>
</ul>
