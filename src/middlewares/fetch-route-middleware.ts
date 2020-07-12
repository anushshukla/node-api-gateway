import { Request, Response, NextFunction } from 'express';
import { Module } from 'webpack';

import fetchRouteDetails from '../services/fetch-route-details';
import fetchGlobalMiddlewares from '../services/fetch-global-middlewares';
import safePromise from '../utils/safe-promise';
import Route from '../entities/route';

type MiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void;

type RoutePromise = Promise<never>;

const fetchRouteMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const [error, routeDetails] = await safePromise(
    <RoutePromise> fetchRouteDetails(request.path),
  );
  if (error) {
    return next(error);
  }
  const middlewareFuncs: Array<MiddlewareFunction> = [];
  const {
    middlewares = [],
    configs = [],
  } = routeDetails as unknown as Route;
  const isGlobalMiddlewaresAllowed = configs.find((config) => config.routeConfigName === 'isGlobalMiddlewaresAllowed');
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
  const addMiddlewares = async (middleware: { middlewareName: string }) => {
    type ModuleType = typeof import(middlewarePath);
    const { default: middlewareFunc }: ModuleType = await import(path);
    middlewareFuncs.push(middlewareFunc);
  };
  middlewares.map(addMiddlewares);
  response.locals = {
    routeDetails,
  };
  const getNextFunc = (index: number): void | MiddlewareFunction => {
    const hasMoreMiddlewares = middlewareFuncs[index] instanceof Function;
    if (!hasMoreMiddlewares) {
      return next();
    }
    const nextMiddleware: void | MiddlewareFunction = getNextFunc(index + 1);
    const currentMiddleware: void | MiddlewareFunction = middlewareFuncs[index](request, response, nextMiddleware);
    return currentMiddleware;
  };
  return getNextFunc(0);
};

export default fetchRouteMiddleware;
