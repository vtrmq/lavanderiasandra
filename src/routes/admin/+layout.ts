import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  if (browser && !data.user) {
    goto('/', { replaceState: true });
    return {};
  }
  return { ...data };
};
