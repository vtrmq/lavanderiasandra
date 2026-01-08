<script lang="ts">
import { goto } from '$app/navigation';
import { deserialize } from '$app/forms'; // enhance, 
import refresh from '$lib/assets/svg/refresh-ccw.svg?raw';
import { Toast, Link } from '$lib/components';
import { filtrarParametros, formatearFechaHora } from '$lib/utils/utils.client';
import { page } from '$app/state';

const props = $props();
const customer = props.data.customer;
let invoice = $state(props.data.invoice);
let fecha_hora = $state({fecha: '', hora: ''});
let pay = $state<number | string>('');
let abono = $state<number>(0);
let back = filtrarParametros(page.url.href, ['code']);
let isSave = $state(false);
let toast = $state<Toast>();
let invoice_id = parseInt(props.data.invoiceId);
let recibido = $state<number | string>('');
let cambio = $state(0);
let code = props.data.code;

$effect(() => {
  fecha_hora = formatearFechaHora(invoice.created_at)
  abono = invoice.pay === 0 ? 0 : invoice.pay;
});

const handleSave = async () => {
  const info = {
    user_id: customer.user_id,
    items: JSON.parse(JSON.stringify(invoice.items)),
    pay: abono + Number(pay),
    invoice_id
  }
  try {
    isSave = true;
    const response = await fetch('?/save', {
      method: 'POST',
      body: JSON.stringify(info)
    });
    
    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'failure') {
      goto('/');
    } else {
      goto(`/admin/output?code=${code}`);
    }
    
  } catch {
    goto('/');
  }
}

function handleCheck(index: number) {
  invoice.items[index].delivered = !invoice.items[index].delivered;
}

function handleInputRecibido() {
  if (Number(recibido) !== 0) {
    cambio = Number(recibido) - Number(pay);
  } else {
    cambio = 0;
  }
}

function handleInputPay() {
  if (Number(recibido) !== 0) {
    cambio = Number(recibido) - Number(pay);
  } else {
    cambio = 0;
  }
}

function handleBack() {
  goto(`/admin/output?${back}`);
}
</script>

<Toast bind:this={toast} />

<div class="wr-bill">
  <div class="header-link">
    <Link href="/admin/output?{back}">[Atrás]</Link>
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
        {#each invoice.items as item, index}
          <div class="row-item">
            <button class="courier count" class:check={item.delivered} onclick={()=>handleCheck(index)}>{item.count}</button>
            <div class="courier text">{item.garment}</div>
            <div class="courier price text-p">${item.price}</div>
          </div>
        {/each}
      </div>
      <div class="courier price">Total: {invoice.garment_number}&nbsp;&nbsp;&nbsp;Precio: ${invoice.price}</div>
    {/if}
  </div>

  <div class="courier price invoice">${invoice.price} - ${Number(abono) !== 0 ? (abono + Number(pay)) : (0 + Number(pay))} = ${invoice.price - (Number(abono) ? (abono + Number(pay)) : (0 + Number(pay)))}</div>
  <div class="form-pago">
    <div class="input-pay courier">
      <div>Pago: </div>
      <input name="pay" class="courier input-pago" type="number" bind:value={pay} oninput={handleInputPay} />
    </div>
    <div class="wr-actions-btn">
      <button class="courier btn-action btn-clear" onclick={handleBack}>Cancelar</button>
      <button class="courier btn-action btn-save-invoice" disabled={isSave} onclick={handleSave}>
        {#if isSave === false}
          Guardar
        {:else}
          {@html refresh}
        {/if}
      </button>
    </div>
  </div>
  <div class="wr-recibido">
    <h2 class="courier">Calcular cambio</h2>
    <div class="wrapper-recibido courier">
      <div>Recibido: </div>
      <input name="pay" class="courier input-pago" type="number" bind:value={recibido} oninput={handleInputRecibido} />
    </div>
    <div class="courier right">Cambio: ${cambio}</div>
  </div>
</div>

<style>
.btn-clear {
  background: #ffcdbd;
  box-shadow: rgb(227 151 127) 0px 7px 1px 0px;
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
.input-pay {
  padding: 0 0.5em 0 0.5em;
  outline: none;
  border: none;
  width: 100%;
  text-align: right;
  border: 1px solid #ccc;
  height: 45px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 54px 1fr;
  align-items: center;
  gap: 0.5em;
}
.wrapper-recibido {
  padding: 0 0.5em 0 0.5em;
  outline: none;
  border: none;
  width: 100%;
  text-align: right;
  border: 1px solid #ccc;
  height: 45px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 0.5em;
}
.right {
  text-align: right;
  padding: 0.5em;
}
.wr-recibido {
  padding: 0.5em 0.5em 3em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.input-pago {
  padding: 0.2em 0;
  border: none;
  outline: none;
  text-align: right;
  width: 100%;
}
.btn-save-invoice {
  background: #cde9ac;
  width: 95px;
  box-shadow: rgb(138 179 89) 0px 7px 1px 0px;
}
.wr-actions-btn {
  display: flex;
  gap: 2em;
  justify-content: center;
  margin: 1em;
}
.btn-action {
  padding: 0.5em 0.8em;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
}
.invoice {
  padding: 0.5em;
}
.header-link {
  margin-bottom: 2em;
  display: flex;
  gap: 1em;
  justify-content: center;
  background: #c8e1df;
  padding: 0.5em;
}
.form-pago {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  padding: 4px 4px 4px 0;
  margin: 0.5em;
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

@keyframes girar {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
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
/* Para Chrome, Safari, Edge y Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Para Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
