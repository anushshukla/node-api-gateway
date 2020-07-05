import 'reflect-metadata';
import getDatabaseConnection from '../services/getDatabaseConnection';
import safePromise from '../utils/safePromise';
import Route from '../entities/route';

export default async (routePath: string): Promise<any> => {
  const [connectionError, connection] = await safePromise(
    getDatabaseConnection(),
  );
  if (connectionError) {
    throw connectionError;
  }
  // eslint-disable-next-line no-console
  console.log('routePath: ', routePath);
  const repository = connection.getRepository(Route);
  const [queryError, route] = await safePromise(
    repository.findOne({routePath, isActive: true, isDeleted: false}),
  );
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log('route from the db: ', route);
  return route;
};
