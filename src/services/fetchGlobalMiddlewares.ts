import getDatabaseConnection from '../services/getDatabaseConnection';
import safePromise from '../utils/safePromise';
import Middleware from '../entities/middleware';

export default async () => {
  const [connectionError, connection] = await safePromise(
    getDatabaseConnection(),
  );
  if (connectionError) {
    throw connectionError;
  }
  const repository = connection.getRepository(Middleware);
  const filters = {isGlobalMiddleware: true, isActive: true, isDeleted: false};
  const [queryError, route] = await safePromise(
    repository.findAll(filters),
  );
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log('route from the db: ', route);
  return route;
};
