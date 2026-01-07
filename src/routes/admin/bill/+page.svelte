<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance, deserialize } from '$app/forms';
import { goto } from '$app/navigation';
import trash from '$lib/assets/svg/trash-2.svg?raw';
import search from '$lib/assets/svg/search.svg?raw';
import refresh from '$lib/assets/svg/refresh-ccw.svg?raw';
import { Toast, Link } from '$lib/components';

type Item = {
  count: string;
  garment: string;
  price: string;
  delivered: boolean;
};
type Customer = {
  name: string | null;
  user_id: number | null;
};

let toast = $state<Toast>();
let customer: Customer = $state({user_id: null, name: null});
let items: Item[] = $state([{count: '', garment: '', price: '', delivered: false}]);
let sum: number = $state(0);
let numberGarment: number = $state(0);
let code = $state('');
let load = $state(false);
let isSave = $state(false);
let pay = $state('');
let totalPagar = $state(0);
let dinero_recibido = $state('');
let dinero_devuelto = $state(0);

const handleSearchCustomer: SubmitFunction = ({formData, cancel}) => {
  let code_customer = formData.get('code_customer') as string;
  code_customer = code_customer.replace(/\s/g, '');
  if (code_customer.trim().length === 0) {
    toast?.action({message: 'Escribe el número de celular', time: 3000, type:'failure'});
    cancel();
    return;
  }
  code = code_customer.trim();
  load = true;
  return async ({ result }) => {
    load = false;
    if (result.type === 'failure') {
      goto('/');
    } else if (result.type === 'success') {
      customer = result.data?.customer;
      if (!customer?.name) {
        toast?.action({message: 'Cliente no encontrado', time: 3000, type:'failure'});
      }
    }
  }
}

function handleAddRow() {
  if (!customer?.name) {
    toast?.action({message: 'Falta el nombre del cliente', time: 3000, type:'failure'});
    return;
  }
  let sw = false;
  for (let i = 0; i < items.length; i++) {
    if ((items[i].count === '' || items[i].count === null) || items[i].garment.trim().length === 0 || (items[i].price === '' || items[i].price === null)) {
      sw = true;
      break;
    }
  }
  if (sw) {
    toast?.action({message: 'Hay un item incompleto', time: 3000, type:'failure'});
    return;
  }
  items.push({count: '', garment: '', price: '', delivered: false});
}

function handleInputPrice() {
  sum = 0;
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].count) && parseInt(items[i].price)) {
      sum += parseInt(items[i].price) * parseInt(items[i].count);
    }
  }
  if (Number(pay) !== 0) {
    totalPagar = sum - parseInt(pay)
  } else {
    totalPagar = sum;
  }
  handleInputAbono();
}

function handleInputSumGarment() {
  numberGarment = 0;
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].count)) {
      numberGarment += parseInt(items[i].count);
    }
  }
  sum = 0;
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].count) && parseInt(items[i].price)) {
      sum += parseInt(items[i].price) * parseInt(items[i].count);
    }
  }
  if (Number(pay) !== 0) {
    totalPagar = sum - parseInt(pay)
  } else {
    totalPagar = sum;
  }
  handleInputAbono();

}

async function handleSave() {
  if (code.trim().length === 0) {
    toast?.action({message: 'Falta el número de celular', time: 3000, type:'failure'});
    return;
  }
  if (!customer?.name) {
    toast?.action({message: 'Falta el nombre del cliente', time: 3000, type:'failure'});
    return;
  }

  let countItems = 0;
  for (let i = 0; i < items.length; i++) {
    if ((items[i].count !== '' && items[i].count !== null) && items[i].garment.trim().length !== 0 && (items[i].price !== '' && items[i].price !== null)) {
      countItems++;
    }
  }

  if (countItems === 0) {
    toast?.action({message: 'No hay datos para guardar', time: 3000, type:'failure'});
    return;
  }

  let sw = false;
  for (let i = 0; i < items.length; i++) {
    if ((items[i].count === '' || items[i].count === null) || items[i].garment.trim().length === 0 || (items[i].price === '' || items[i].price === null)) {
      sw = true;
      break;
    }
  }
  if (sw) {
    toast?.action({message: 'Hay un item incompleto', time: 3000, type:'failure'});
    return;
  }

  const info = {
    code,
    user_id: customer.user_id,
    name: customer.name,
    items: JSON.parse(JSON.stringify(items)),
    number_garment: numberGarment,
    price: sum,
    pay: Number(pay) === 0 ? 0 : pay
  }
  //console.log(info)
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
      goto('/admin');
    }
    
  } catch {
    goto('/');
  }
}

function handleClear() {
  sum = 0;
  numberGarment = 0;
  code = '';
  customer = {user_id: null, name: null};
  items = [{count: '', garment: '', price: '', delivered: false}];
}

function handleDeleteRow(index: number) {
  if (items.length === 1) return;
  items.splice(index, 1);

  sum = 0;
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].count) && parseInt(items[i].price)) {
      sum += parseInt(items[i].price) * parseInt(items[i].count);
    }
  }

  numberGarment = 0;
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].count)) {
      numberGarment += parseInt(items[i].count);
    }
  }
  handleInputAbono();
}

function handleInputAbono() {
  if (Number(pay) !== 0 && Number(dinero_recibido)) {
    totalPagar = sum - parseInt(pay);
    dinero_devuelto = parseInt(dinero_recibido) - parseInt(pay);
  } else if (Number(dinero_recibido) !== 0) {
    totalPagar = sum;
    dinero_devuelto = parseInt(dinero_recibido) - sum ? parseInt(dinero_recibido) - sum : 0;
  } else if (Number(dinero_recibido) === 0) {
    dinero_devuelto = 0;
  }
}

function handleInputRecibido() {
  handleInputAbono();
}

</script>

<Toast bind:this={toast} />

<div class="wr-bill">
  <div class="header-link">
    <Link href="/admin">Atrás</Link>
  </div>
  <div class="container-header">
    <form class="wr-search" method="post" action="?/search" use:enhance={handleSearchCustomer}>
      <input name="code_customer" class="courier input-search" type="number" placeholder="Celular / Buscar cliente" bind:value={code} />
      <button class="btn-search">
        {#if load === false}
          <span class="search">{@html search}</span>
        {:else}
          <span class="load">{@html refresh}</span>
        {/if}
      </button>
    </form>
    <input class="courier customer" type="text" placeholder="Nombre del cliente" bind:value={customer.name} />
  </div>
  <div class="container-items">
    <div class="row-item">
      <div class="courier header-fc header-count">#</div>
      <div class="courier header-fc header-garment">Prendas</div>
      <div class="courier header-fc header-price">Vr. Unit</div>
    </div>
    {#each items as item, index}
      <div class="row-item">
        <input type="number" oninput={handleInputSumGarment} class="courier input-count" bind:value={item.count} />
        <div class="wr-textarea"><textarea class="courier txt-garment" bind:value={item.garment}></textarea></div>
        <input type="number" oninput={handleInputPrice} class="courier input-price" bind:value={item.price} />
        <button class="btn-delete" onclick={()=>handleDeleteRow(index)}>{@html trash}</button>
      </div>
    {/each}
  </div>

  <div class="pago-abono">
    <div class="courier">Pago / Abono:</div>
    <input name="pago" class="courier input-pay" type="number" bind:value={pay} oninput={handleInputAbono} />
  </div>

  <div class="wr-header">
    <div class="wr-sum"><span class="courier">Prendas: {numberGarment}</span><span class="courier">Total: {sum}</span></div>
    <!--div class="courier wr-sum">
      Faltante: {totalPagar}
    </div-->
    <div class="contanier-btns">
      <button class="courier btn-action btn-clear" onclick={handleClear}>Limpiar</button>
      <div class="wr-actions-btn">
        <button class="courier btn-action btn-new-row" onclick={handleAddRow}>Nueva fila</button>
        <button class="courier btn-action btn-save-invoice" onclick={handleSave} disabled={isSave}>
          {#if isSave === false}
            Guardar
          {:else}
            {@html refresh}
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div class="wr-pago">
    <h2 class="courier">Calcular cambio</h2>
    <div class="courier wr-p">
      Recibido: <input name="recibido" class="courier recibido" type="number" bind:value={dinero_recibido} oninput={handleInputRecibido} />
    </div>
    <div class="courier wr-p">
      Cambio: {dinero_devuelto}
    </div>
  </div>


</div>

<style>
.recibido {
  width: 110px;
  padding: 0.4em;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
}
.wr-pago {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 4px 8px 8px;
  margin: 1em 0.5em;
}
.wr-p {
  display: flex;
  align-items: center;
  gap: 1em;
}
.pago-abono {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 50px;
  padding: 4px 0 4px 8px;
  margin: 0.5em;
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  align-items: center;
}
.wr-header {
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.header-link {
  margin-bottom: 2em;
  display: flex;
  gap: 1em;
  justify-content: center;
  background: #c8e1df;
  padding: 0.5em;
}
.btn-delete {
  outline: none;
  border: none;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  display: flex;
  background: #ff00002e;
  top: -4px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
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
.search {
  display: flex;
  width: 20px;
  height: 20px;
}
.load {
  animation: girar 1.5s linear infinite;
  display: flex;
  width: 20px;
  height: 20px;
}
@keyframes girar {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}
.header-fc {
  border: 1px solid #a9a9a9;
  height: 40px;
}
.wr-textarea {
  display: flex;
  padding: 10px;
  background: #f9f9f9;
  border: 1px solid #c9c9c9;
}
.btn-clear {
  background: #ffcdbd;
  box-shadow: rgb(227 151 127) 0px 7px 1px 0px;
}
.btn-save-invoice {
  background: #cde9ac;
  width: 95px;
  box-shadow: rgb(138 179 89) 0px 7px 1px 0px;
}
.btn-new-row {
  background: #b7e3f7;
  box-shadow: rgb(118 167 189) 0px 7px 1px 0px;
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
.contanier-btns {
  display: flex;
  justify-content: space-between;
  margin: 1em 0;
}
.wr-actions-btn {
  display: flex;
  gap: 0.5em;
}
.header-count {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9em;
}
.header-garment {
  padding: 0 10px;
  font-size: 0.9em;
  display: flex;
  justify-content: left;
  align-items: center;
}
.header-price {
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 10px;
  font-size: 0.9em;
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
.wr-sum {
  display: flex;
  justify-content: right;
  padding: 14px 10px;
  gap: 1em;
  border: 1px solid #a9a9a9;
  border-radius: 5px;
}
.input-count {
  padding: 10px;
  resize: none;
  text-align: center;
  height: 80px;
  border: none;
  background: #e7f0f0;
  border: 1px solid #bad1d1;
}
.txt-garment {
  resize: none;
  border: none;
  background: transparent;
  scrollbar-width: none; /* Para Firefox */
  width: 100%;
}
.txt-garment::-webkit-scrollbar {
  display: none; /* Para Chrome, Safari y Edge moderno */
}
.input-price {
  padding: 10px;
  resize: none;
  text-align: right;
  height: 80px;
  border: none;
  background: #f3f5e4;
  border: 1px solid #c3d72b;
}
.container-items {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 0.5em;
}
.row-item {
  display: grid;
  grid-template-columns: 46px 1fr 90px;
  gap: 4px;
  position: relative;
}
.container-header {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  padding: 0 0.5em;
}
.customer {
  height: 50px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  padding: 0.5em;
}
.wr-bill {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 3em;
}
.wr-search {
  display: grid;
  grid-template-columns: 1fr 50px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 50px;
  padding: 4px 4px 4px 0;
}
.btn-search {
  outline: none;
  border: none;
  cursor: pointer;
  background: #e1efd0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-search {
  padding: 0.5em;
  outline: none;
  border: none;
}
.input-pay {
  padding: 0.5em;
  outline: none;
  border: none;
  width: 100%;
  text-align: right;
}
</style>
