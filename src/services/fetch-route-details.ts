import "reflect-metadata";

import { Connection } from "typeorm";

import Route from "../entities/route";
import safePromise from "../utils/safe-promise";

import getDatabaseConnection from "./get-database-connection";
type ConnectionPromiseResponse = [Error] | [null, Connection];
type ConnectionPromise = Promise<Connection>;

export default async (routePath: string): Promise<Route> => {
  const [connectionError, connection]: ConnectionPromiseResponse = await safePromise(
    getDatabaseConnection() as ConnectionPromise,
  );
  if (connectionError) {
    throw connectionError;
  }
  if (!connection) {
    throw new Error("no connection found");
  }
  const where = { routePath };
  const relations = ["configs", "middlewares"];
  const find = {
    relations,
    where,
  };
  const routeRepositor = connection.getRepository(Route);
  const [queryError, route] = await safePromise(routeRepositor.findOne(find));
  if (queryError) {
    throw queryError;
  }
  if (!route) {
    throw new Error("no route found");
  }
  const transposedConfigs = route.getTransposedConfigs();
  route.transposedConfigs = transposedConfigs;
  return route;
};
