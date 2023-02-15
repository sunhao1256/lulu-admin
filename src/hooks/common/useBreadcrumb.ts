import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {routePath} from '@/router';
import {useRouteStore} from '@/store';
import {getBreadcrumbByRouteKey} from '@/utils';


export default function useBreadcrumb(rootPath: Exclude<AuthRoute.AllRouteKey, 'not-found'> = 'root') {
  const route = useRoute();
  const routeStore = useRouteStore();

  const breadcrumbs = computed(() =>
    getBreadcrumbByRouteKey(route.name as string, routeStore.menus as App.GlobalMenuOption[], routePath(rootPath))
  );

  return {
    breadcrumbs
  };
}
