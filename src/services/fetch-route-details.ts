import 'reflect-metadata';

import safePromise from '../utils/safe-promise';
import Route from '../entities/route';

import getDatabaseConnection from './get-database-connection';

const fetchRouteDetails = async (routePath: string): Promise<Route> => {
  const [connectionError, connection] = await safePromise(
    getDatabaseConnection()
  );
  if (connectionError) {
    throw connectionError;
  }
  // eslint-disable-next-line no-console
  console.log('routePath: ', routePath);
  const repository = connection
    .getRepository(Route)
    .createQueryBuilder('route')
    .leftJoinAndSelect('route.user', 'user')
    .where('route.routePath = :routePath', { routePath })
    .select(['route.configs', 'route.middlewares'])
    .execute();
  const [queryError, route] = await safePromise(
    repository.findOne({ routePath, isActive: true, isDeleted: false })
  );
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log('route from the db: ', route);
  return route;
};

export default fetchRouteDetails;
