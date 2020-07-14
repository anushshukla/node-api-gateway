import { Connection, Repository } from "typeorm";

import Middleware from "../entities/middleware";
import safePromise from "../utils/safe-promise";

import getDatabaseConnection from "./get-database-connection";

const fetchGlobalMiddlewares = async (): Promise<Middleware[]> => {
  const [connectionError, connection]: [Error] | [null, Connection] = await safePromise(
    getDatabaseConnection(),
  );
  if (connectionError) {
    throw connectionError;
  }
  if (!connection) {
    throw new Error("Database connection failed");
  }
  const repository: Repository<Middleware> = connection.getRepository(Middleware);
  const filters = {
    where: {
      isGlobalMiddleware: true,
      isActive: true,
      isDeleted: false,
    }
  };
  const [queryError, result]: [Error] | [null, Middleware[]] = await safePromise(repository.find(filters));
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log("result: ", result);
  return result;
};

export default fetchGlobalMiddlewares;
