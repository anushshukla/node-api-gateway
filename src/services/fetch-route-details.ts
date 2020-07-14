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
  const route = connection
    .getRepository(Route)
    .createQueryBuilder("route")
    .leftJoinAndSelect("route.user", "user")
    .where("route.routePath = :routePath", { routePath })
    .select(["route.configs", "route.middlewares"])
    .execute();
  // const [queryError, route] = await safePromise(
  //   repository.find({ where: { routePath, isActive: true, isDeleted: false } }),
  // );
  // if (queryError) {
  //   throw queryError;
  // }
  // eslint-disable-next-line no-console
  console.log("route from the db: ", route);
  return route;
};

export default fetchRouteDetails;
