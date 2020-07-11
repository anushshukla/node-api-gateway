import safePromise from '../utils/safe-promise';
import Middleware from '../entities/middleware';

import getDatabaseConnection from './get-database-connection';

const fetchGlobalMiddlewares = async (): Promise<Middleware> => {
  const [connectionError, connection] = await safePromise(
    getDatabaseConnection()
  );
  if (connectionError) {
    throw connectionError;
  }
  const repository = connection.getRepository(Middleware);
  const filters = {
    isGlobalMiddleware: true,
    isActive: true,
    isDeleted: false
  };
  const [queryError, result] = await safePromise(repository.findAll(filters));
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log('result: ', result);
  return result;
};

export default fetchGlobalMiddlewares;
