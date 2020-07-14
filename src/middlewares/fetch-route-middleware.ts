import { NextFunction, Request, Response } from "express";

import Route from "../entities/route";
import fetchGlobalMiddlewares from "../services/fetch-global-middlewares";
import fetchRouteDetails from "../services/fetch-route-details";
import safePromise from "../utils/safe-promise";

type MiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void;

type RoutePromise = Promise<never>;

const fetchRouteMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const [error, routeDetails] = await safePromise(
    fetchRouteDetails(request.path),
  );
  if (error) {
    return next(error);
  }
  const middlewareFuncs: MiddlewareFunction[] = [];
  const {
    middlewares,
    configs,
  } = routeDetails;
  const isGlobalMiddlewaresAllowed = configs.find((config) => config.routeConfigName === "isGlobalMiddlewaresAllowed");
  if (isGlobalMiddlewaresAllowed) {
    const [
      fetchingGlobalMiddlewaresError,
      globalMiddlewares,
    ] = await safePromise(fetchGlobalMiddlewares());
    if (fetchingGlobalMiddlewaresError) {
      return next(fetchingGlobalMiddlewaresError);
    }
    const addGlobalMiddlewares = async (middleware: {
      middlewareName: string;
    }) => {
      const { middlewareName } = middleware;
      const path = `./${middlewareName}`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { default: middlewareFunc } = await import(path);
      middlewareFuncs.push(middlewareFunc);
    };
    globalMiddlewares.map(addGlobalMiddlewares);
  }
  const addMiddlewares = async (middleware) => {
    const { middlewareName } = middleware;
    const middlewarePath = `../middleware/${middlewareName}`;
    const { default: middlewareFunc } = await import(middlewarePath);
    middlewareFuncs.push(middlewareFunc);
  };
  middlewares.map(addMiddlewares);
  response.locals = {
    routeDetails,
  };
  const getNextFunc = (index: number): void => {
    const hasMoreMiddlewares = middlewareFuncs[index] instanceof Function;
    if (!hasMoreMiddlewares) {
      return next();
    }
    const nextMiddleware = () => getNextFunc(index + 1);
    const currentMiddleware = middlewareFuncs[index](request, response, nextMiddleware);
    return currentMiddleware;
  };
  return getNextFunc(0);
};

export default fetchRouteMiddleware;
