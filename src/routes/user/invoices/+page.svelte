<script lang="ts">
import { Toast, Link } from '$lib/components';
import { formatearFechaHora } from '$lib/utils/utils.client';

const props = $props();
const customer = props.data.customer;
let invoice = $state(props.data.invoice);
let fecha_hora = $state({fecha: '', hora: ''});
let toast = $state<Toast>();

fecha_hora = formatearFechaHora(invoice.created_at)

</script>

<Toast bind:this={toast} />

<div class="wr-bill">
  <div class="header-link">
    <Link href="/user">[Atrás]</Link>
  </div>
  <div class="header">
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
  {#if invoice.price - invoice.pay !== 0}
    <div>
      <h2 class="courier lb">DEBES</h2>
      <div class="courier invoice">${invoice.price} - ${invoice.pay} = ${invoice.price - invoice.pay}</div>
    </div>
  {:else}
    <div class="courier paid">PAGADO</div>
  {/if}
</div>

<style>
.lb {
  font-size: 1.2em;
  text-align: center;
  margin-bottom: 0.3em;
}
.paid {
  padding: 1em;
  background: #cee7b1;
  text-align: center;
  font-size: 1.1em;
  font-weight: 700;
}
.text {
  display: flex;
  align-items: center;
}
.text-p {
  display: flex;
  align-items: center;
  justify-content: right;
}
.invoice {
  padding: 1em 0.5em;
  background: #ffd8cc;
  text-align: center;
  font-weight: 600;
}
.header-link {
  margin-bottom: 2em;
  display: flex;
  gap: 1em;
  justify-content: center;
  background: #c8e1df;
  padding: 1em;
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
