<script lang="ts">
let { href = '', children } = $props();
</script>

<a {href} class="courier link">{@render children()}</a>

<style>
.link {
  color: #333;
  text-decoration: none;
}
</style>
