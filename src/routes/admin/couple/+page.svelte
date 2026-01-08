<script lang="ts">
import { Link, Pagination } from '$lib/components';
import { formatearFechaHora } from '$lib/utils/utils.client';

let { data } = $props();
type Invoice = {
  invoice_id: number;
  admin_id: number;
  user_id: number;
  name: string;
  invoice_number?: number;
  garment_number?: number;
  price: number;
  created_at: string;
  user_name: string;
  user_phone: number;
};

type PaginationResult = {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

let invoices: Invoice[] | [] = $derived(data.invoices as Invoice[]);
let pagination: PaginationResult | undefined = $state({limit: 0, page: 0, totalCount: 0, totalPages: 0});

$effect(()=>{
  pagination = data.pagination;
});

</script>

<div class="wr-bill">
  <div class="header-link">
    <Link href="/admin">Atrás</Link>
  </div>
  <h1 class="acoplar">Acoplar</h1>
  {#if invoices}
    <div class="wrapper-items">
      {#each invoices as row}
        {@const fecha = formatearFechaHora(row.created_at)}
        <a href="/admin/couple/info?invoiceId={row.invoice_id}&userId={row.user_id}&page={pagination?.page}" class="container-items">
          <div class="r-top">
            <span class="factura">Factura: {row.invoice_number}</span>
            <div class="prenda">Cliente: {row.user_name}</div>
            <div class="prenda">Celular: {row.user_phone}</div>
            <div class="prenda">Prendas: {row.garment_number} - Precio: ${row.price}</div>
            <div class="wr-fecha">
              <span class="fecha">{fecha.fecha}</span>
              <span class="fecha">-</span>
              <span class="fecha">{fecha.hora}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
    {#if pagination && pagination.totalPages > 1}
      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    {/if}
  {/if}
</div>

<style>
.acoplar {
  font-family: "Courier Prime", monospace;
  font-weight: 600;
  padding: 0 0.3em;
  font-size: 1.4em;
}
.wrapper-items {
  padding: 0 0.5em 2em;
}
.header-link {
  margin-bottom: 2em;
  display: flex;
  gap: 1em;
  justify-content: center;
  background: #c8e1df;
  padding: 0.5em;
}
.container-items {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #333;
}
.wr-fecha {
  display: flex;
  gap: 0.5em;
}
.factura {
  font-family: "Courier Prime", monospace;
  font-weight: 600;
}
.fecha {
  font-family: "Courier Prime", monospace;
  text-align: right;
  word-spacing: -4px;
}
.r-top {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
  padding: 1em 0;
  gap: 5px;
}
.prenda {
  font-family: "Courier Prime", monospace;
}
:global {
  .btn-save-invoice > svg {
    width: 24px;
    animation: girar 1.5s linear infinite;
  }
  .btn-search > span > svg {
    width: 20px;
  }
  .btn-delete > svg {
    width: 20px;
    color: red;
  }
}
.wr-bill {
  max-width: 600px;
  margin: 0 auto;
}
</style>
