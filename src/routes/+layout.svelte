<script>
let { children } = $props();
/*
  import { beforeNavigate } from '$app/navigation';

  beforeNavigate(({ to }) => {
    if (to) {
      if (to.url.pathname.split('/').length === 2) {
        const style = to.url.pathname.split('/')[1] === '' ? 'main' : to.url.pathname.split('/')[1];
        document.querySelector("html")?.classList.remove('main', 'admin')
        document.querySelector("html")?.classList.add(style)
      }
    } 
  });
*/
</script>

{@render children()}
