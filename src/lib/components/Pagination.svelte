<script lang="ts">
import { goto } from '$app/navigation';
import chevronLeft from '$lib/assets/svg/chevron-left.svg?raw'
import chevronRight from '$lib/assets/svg/chevron-right.svg?raw'

let { page, totalPages } = $props();

// Construye la URL manteniendo otros parámetros de búsqueda
function goTo(p: number) {
  const params = new URLSearchParams(location.search);
  params.set("page", String(p));
  const url = `${location.pathname}?${params.toString()}`;
  goto(url);
}

const isFirst = $derived(page <= 1);
const isLast = $derived(page >= totalPages);
</script>

<div class="pagination">
  <button
    class="nav-btn"
    disabled={isFirst}
    onclick={() => goTo(page - 1)}>
    {@html chevronLeft}
  </button>

  <span class="middle">
    {page} de {totalPages}
  </span>

  <button
    class="nav-btn"
    disabled={isLast}
    onclick={() => goTo(page + 1)}>
    {@html chevronRight}
  </button>
</div>

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding: 1em 0;
  }

  .middle {
    font-size: 1em;
    color: #333;
    min-width: 80px;
    text-align: center;
    font-family: "Courier Prime", monospace;
  }

  .nav-btn {
    width: 48px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--color-border-input);
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition);
  }
  .nav-btn:hover {
    background: #ddebcc;
    border: 1px solid #aecbae;
  }
  :global {
    .nav-btn > svg {
      width: 24px;
      color: #737373;
    }
  }
  .nav-btn:disabled {
    cursor: not-allowed;
    background: #efefef;
  }
</style>

