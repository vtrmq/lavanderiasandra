<script lang="ts">
//import { browser } from '$app/environment';
let { children } = $props();
/*
if (browser) {
  document.body.setAttribute('data-route', 'admin');
}
*/
</script>

<main>
  {@render children()}
</main>

