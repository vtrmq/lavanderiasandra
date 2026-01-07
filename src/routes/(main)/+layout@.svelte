<script lang="ts">
	let { children } = $props();
</script>

<main class="main">
  {@render children()}
</main>

<style>
.main {
  background: #031f28;
  background-size: cover;
  background-image: url(/images/kristaps-ungurs.jpg);
  background-attachment: fixed;
  height: 100vh;
}
</style>
