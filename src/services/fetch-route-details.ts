import "reflect-metadata";

import { Connection } from "typeorm";

import Route from "../entities/route";
import safePromise from "../utils/safe-promise";

import getDatabaseConnection from "./get-database-connection";
type ConnectionPromiseResponse = [Error] | [null, Connection];
type ConnectionPromise = Promise<Connection>;

const fetchRouteDetails = async (routePath: string): Promise<Route> => {
  const [connectionError, connection]: ConnectionPromiseResponse = await safePromise(
    getDatabaseConnection() as ConnectionPromise,
  );
  if (connectionError) {
    throw connectionError;
  }
  // eslint-disable-next-line no-console
  console.log("routePath: ", routePath);
  const where = { routePath };
  const relations = ['configs', 'middlewares'];
  const find = {
    relations,
    where,
  };
  const routeRepositor = connection.getRepository(Route);
  const [queryError, route] = await safePromise(routeRepositor.findOne(find));
  if (queryError) {
    throw queryError;
  }
  // eslint-disable-next-line no-console
  console.log("route from the db: ", route);
  return route;
};

export default fetchRouteDetails;
