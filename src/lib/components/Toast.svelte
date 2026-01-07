<script lang="ts">
  import { fly } from 'svelte/transition';
  import { onDestroy } from "svelte";

  type Info = {
    message: string;
    type: string;
    time: number;
  };

  let info: Info = $state({ message: '', type: '', time: 0 });
  let idTime = $state(0);
  let idEvent = $state(0);
  let display = $state(false);

  export const action = (e: Info) => {
    display = false;
    clearInterval(idTime);
    clearInterval(idEvent);
    info = e;
    idTime = setTimeout(() => { 
      display = true;
      idEvent = setTimeout(() => { display = false; }, e.time);
    }, 400);
  };

  onDestroy(() => { 
    display = false;
    clearInterval(idTime);
    clearInterval(idEvent) 
  })
</script>

{#if display}
  <div class="container-toast" transition:fly={{ y: 100 }}>
    <div 
      class="toast courier" 
      class:success={info.type === "success"} 
      class:error={info.type === "failure"}>
      {info.message}
    </div>
  </div>
{/if}

<style>
  :global(:root) {
    --toast-error: #b35437;
    --toast-success: #395f39;
	}
  .error {
    background: var(--toast-error);
    color: #fff;
  }
  .success {
    background: var(--toast-success);
    color: #fff;
  }
  .container-toast {
    display: flex;
    justify-content: center;
    height: 0;
    position: fixed;
    bottom: 0px;
    width: 100%;
    left: 0;
    z-index: 5;
  }
  .toast {
    padding: 0.7em 1em;
    position: absolute;
    bottom: 60px;
    border-radius: 8px;
    font-size: 0.96em;
    max-width: 320px;
    line-height: 20px;
    text-align: center;
    margin: 0 0.5em;
  }
  @media (min-width: 500px) {
    .toast {
      font-size: 0.9em;
    }
  }
</style>
