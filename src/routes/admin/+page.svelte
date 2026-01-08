<script lang="ts">
import { enhance } from '$app/forms';
import receiptText from '$lib/assets/svg/receipt-text.svg?raw';
import chartLine from '$lib/assets/svg/chart-line.svg?raw';
import usersRound from '$lib/assets/svg/users-round.svg?raw';
import logout from '$lib/assets/svg/log-out.svg?raw';
import shirt from '$lib/assets/svg/shirt.svg?raw';
</script>

<h1 class="bevan title">Opciones</h1>
<div class="wr-links">
  <a class="link" href="/admin/bill">
    <div class="box-svg">{@html receiptText}</div>
    <span class="courier label">Entrada</span>
  </a>
  <a class="link" href="/admin/output">
    <div class="box-svg">{@html usersRound}</div>
    <span class="courier label">Salida</span>
  </a>
  <a class="link" href="/admin/couple">
    <div class="box-svg">{@html shirt}</div>
    <span class="courier label">Acoplar</span>
  </a>
  <a class="link" href="/admin/statistics">
    <div class="box-svg">{@html chartLine}</div>
    <span class="courier label">Estadística</span>
  </a>
  <form method="POST" use:enhance>
    <button class="link">
      <div class="box-svg">{@html logout}</div>
      <span class="courier label">Cerrar</span>
    </button>
  </form>
</div>

<style>
.title {
  color: #287397;
  text-align: center;
  font-size: 2em;
  padding: 1em 0 0;
  text-shadow: 1px 4px 2px #cec4d1;
}
.label {
  font-size: 1em;
}
.wr-links {
  display: flex;
  gap: 1em;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 3em 1em;
}
.link {
  background: #f3f3f3;
  display: flex;
  flex-direction: column;
  width: 150px;
  padding: 1em;
  align-items: center;
  text-decoration: none;
  border-radius: 10px;
  color: #333;
  gap: 0.5em;
  box-shadow: rgb(100 100 111 / 32%) 0px 7px 1px 0px;
  transition: 0.3s;
  border: 1px solid #878787;
}
.link:hover {
  background: #ebf5ee;
  box-shadow: rgb(188 211 195) 0px 7px 1px 0px;
}
.box-svg {
  display: flex;
  justify-content: center;
  align-items: center;
}
:global {
  .box-svg > svg {
    width: 40px;
    color: #898989;
    stroke-width: 1px;
  }
}
@media (min-width: 700px) {
  .label {
    font-size: 0.9em;
  }
}
</style>
