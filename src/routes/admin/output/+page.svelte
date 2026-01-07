<script lang="ts">
import { goto } from '$app/navigation';
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import search from '$lib/assets/svg/search.svg?raw';
import refresh from '$lib/assets/svg/refresh-ccw.svg?raw';
import { Toast } from '$lib/components';
import { Link } from '$lib/components';
import { formatearFechaHora } from '$lib/utils/utils.client';

let { data } = $props();

type Customer = {
  name?: string | null;
  user_id?: number | null;
};

const EMPTY_CUSTOMER: Customer = {
  user_id: null,
  name: null
};

type Item = {count: number; garment: string; price: number};

type Invoice = {
  invoice_id?: number;
  admin_id?: number;
  user_id?: number;
  invoice_number?: number;
  items?: Item[];
  garment_number?: number;
  price?: number;
  created_at?: string;
};

$effect(()=>{
  if (data.customer?.name) {
    code = data.code;
    customer = data?.customer;
    invoices = data?.invoices ?? [];
  }
});

let toast = $state<Toast>();
let customer = $state<Customer>(EMPTY_CUSTOMER);
let invoices: Invoice[] = $state([]);
let code = $state('');
let load = $state(false);

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
      if (result.data?.error !== 'Exit') {
        toast?.action({message: result.data?.error, time: 3000, type: result.type});
        cancel();
      } else {
        goto('/');
      }
    } else if (result.type === 'success') {
      customer = result.data?.customer;
      invoices = result.data?.invoices ?? [];
      if (!customer?.name) {
        toast?.action({message: 'Cliente no encontrado', time: 3000, type:'failure'});
      }
    }
  }
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
    <input class="courier customer" type="text" disabled={true} placeholder="Nombre del cliente" bind:value={customer.name} />
  </div>
  {#if invoices.length !== 0}
    <div class="wrapper-items">
      {#each invoices as row}
        {@const fecha = formatearFechaHora(row.created_at)}
        <a href="/admin/output/invoices?code={code}&userId={customer.user_id}&invoiceId={row.invoice_id}" class="container-items">
          <div class="r-top">
            <span class="factura">Factura: {row.invoice_number}</span>
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
  {/if}
</div>

<style>
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
.container-header {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  margin-bottom: 1em;
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
</style>
