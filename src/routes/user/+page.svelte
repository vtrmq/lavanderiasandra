<script lang="ts">
import { formatearFechaHora } from '$lib/utils/utils.client';
const props = $props();
const customer = props.data.customer;
const invoices = props.data.invoices;
</script>

<div>
  <div class="header">
    <h2 class="courier app">La lavandería</h2>
    <p class="courier customer">{customer.name}</p>
  </div>
  <div class="invoices">
    {#if invoices.length !== 0}
      <div class="wrapper-items">
        {#each invoices as row}
          {@const fecha = formatearFechaHora(row.created_at)}
          <a href="/user/invoices?userId={customer.user_id}&invoiceId={row.invoice_id}" class="container-items">
            <div class="r-top">
              <span class="courier factura">Factura: {row.invoice_number}</span>
              <div class="courier prenda">Prendas: {row.garment_number} - Precio: ${row.price}</div>
              <div class="wr-fecha">
                <span class="courier fecha">{fecha.fecha}</span>
                <span class="courier fecha">-</span>
                <span class="courier fecha">{fecha.hora}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
.app {
  font-size: 1.3em;
}
.header {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  background: #c8e1df;
}
.wr-fecha {
  display: flex;
  gap: 0.5em;
}
.factura {
  font-weight: 600;
}
.fecha {
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
.container-items {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #333;
}
.wrapper-items {
  padding: 0 0.5em 2em;
}
.customer {
}
.invoices {
}
</style>
