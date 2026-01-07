<script lang="ts">
import type { SubmitFunction } from '@sveltejs/kit';
import { enhance } from '$app/forms';
import { Toast } from '$lib/components';
import LogIn from '$lib/assets/svg/log-in.svg?raw';

let toast = $state<Toast>();

const handleLogin: SubmitFunction = ({formData, cancel}) => {
  const code = formData.get('code') as string;
  if (code.length === 0) {
    toast?.action({message: 'Escribe el código de acceso', time: 3000, type:'failure'});
    cancel();
  }
  return async ({ update, result }) => {
    if (result.type === 'failure') {
      toast?.action({message: result.data?.error, time: 3000, type: result.type});
      cancel();
    }
    update();
  }
}
</script>

<Toast bind:this={toast} />

<h1 class="bevan title">La Lavandería</h1>

<div class="wr-form">
  <form method="post" use:enhance={handleLogin}>
    <div class="wr-input">
      <input class="courier input" type="text" placeholder="Código de acceso" name="code" />
      <button class="button">{@html LogIn}</button>
    </div>
  </form>
</div>

<style>
.wr-form {
  padding: 1em;
  max-width: 400px;
  margin: 0 auto;
}
.input {
  padding: 0.7em;
  border: none;
  outline: none;
}
.button {
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  cursor: pointer;
  border-radius: 14px;
  transition: 0.3s;
  width: 43px;
}
.button:hover {
  background: #efefef;
}
:global{
  .button > svg {
    width: 30px;
    color: #6f6f6f;
    stroke-width: 1.2px;
  }
}
.wr-input {
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 50px;
  padding: 0.5em;
  border-radius: 14px;
}
.title {
  color: #fff;
  text-align: center;
  font-size: 2.8em;
  padding: 1em 0 0;
  text-shadow: 1px 4px 7px #000000;
}
</style>
