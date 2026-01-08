<script lang="ts">
import { Toast, Link } from '$lib/components';
import { filtrarParametros, formatearFechaHora } from '$lib/utils/utils.client';
import { page } from '$app/state';

const props = $props();
const customer = props.data.customer;
let invoice = $state(props.data.invoice);
let fecha_hora = $state({fecha: '', hora: ''});
let back = filtrarParametros(page.url.href, ['page']);
let toast = $state<Toast>();
fecha_hora = formatearFechaHora(invoice.created_at)

</script>

<Toast bind:this={toast} />

<div class="wr-bill">
  <div class="header-link">
    <Link href="/admin/couple?{back}">[Atrás]</Link>
    <Link href="/admin">[Inicio]</Link>
  </div>
  <div class="header">
    <h1 class="courier">Factura: {invoice.invoice_number}</h1>
    <div class="courier">Cliente: {customer?.name}</div>
    <div class="courier">Fecha y hora: {fecha_hora.fecha} {fecha_hora.hora}</div>
  </div>
  <div class="container-items">
    <div class="row-item">
      <div class="courier count bold">#</div>
      <div class="courier bold">Prendas</div>
      <div class="courier price bold">Valor</div>
    </div>
    {#if invoice.items}
      <div class="container-rows">
        {#each invoice.items as item}
          <div class="row-item">
            <button class="courier count" class:check={item.delivered}>{item.count}</button>
            <div class="courier text">{item.garment}</div>
            <div class="courier price text-p">${item.price}</div>
          </div>
        {/each}
      </div>
      <div class="courier price">Total: {invoice.garment_number}&nbsp;&nbsp;&nbsp;Precio: ${invoice.price}</div>
    {/if}
  </div>

</div>

<style>
.text {
  display: flex;
  align-items: center;
}
.text-p {
  display: flex;
  align-items: center;
  justify-content: right;
}
.header-link {
  margin-bottom: 2em;
  display: flex;
  gap: 1em;
  justify-content: center;
  background: #c8e1df;
  padding: 0.5em;
}
:global {
  .btn-save > .load > svg {
    width: 20px;
    animation: girar 1.5s linear infinite;
  }
  .btn-save > span > svg {
    width: 20px;
  }
  .btn-save-invoice > svg {
    width: 24px;
    animation: girar 1.5s linear infinite;
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0 0.5em;
}
.bold {
  font-weight: 700;
}
.count {
  text-align: center;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}
.count.check {
  background: #19b319;
  color: #fff;
}
.price {
  text-align: right;
}
.container-rows {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}
.container-items {
  margin: 2em 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 0.5em;
}
.row-item {
  display: grid;
  grid-template-columns: 46px 1fr 80px;
  gap: 4px;
  position: relative;
  padding: 0.5em 0;
  border-bottom: 1px solid #ccc;
  min-height: 55px;
}
.wr-bill {
  max-width: 600px;
  margin: 0 auto;
}
</style>
