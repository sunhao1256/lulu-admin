import type {MockMethod} from 'vite-plugin-mock';
import {routeModel, userModel} from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult => {

      const routeHomeName: AuthRoute.LastDegreeRouteKey = 'dashboard_analytics';

      const role = userModel.find(item => item.userName === 'admin')?.userRole || 'user';

      const filterRoutes = routeModel[role];

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: filterRoutes,
          home: routeHomeName
        }
      };
    }
  }
];

export default apis;
