import { Request, Response, NextFunction } from 'express';

import safePromise from '../utils/safe-promise';
import fetchRouteDetails from '../services/fetch-route-details';
import fetchGlobalMiddlewares from '../services/fetch-global-middlewares';

interface Middleware {
  middlewareName: string;
}

const fetchRouteMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const [error, routeDetails] = await safePromise(
    fetchRouteDetails(request.path)
  );
  if (error) {
    throw error;
  }
  const middlewareFuncs: Array<Middleware> = [];
  if (routeDetails.config.isGlobalMiddlewaresAllowed) {
    const [
      fetchingGlobalMiddlewaresError,
      globalMiddlewares
    ] = await safePromise(fetchGlobalMiddlewares());
    if (fetchingGlobalMiddlewaresError) {
      throw fetchingGlobalMiddlewaresError;
    }
    const addGlobalMiddlewares = async (middleware: {
      middlewareName: string;
    }) => {
      const { middlewareName } = middleware;
      const { default: middlewareFunc } = await import(`./${middlewareName}`);
      middlewareFuncs.push(middlewareFunc);
    };
    globalMiddlewares.map(addGlobalMiddlewares);
  }
  const addMiddlewares = async (middleware: { middlewareName: string }) => {
    const { middlewareName } = middleware;
    const { default: middlewareFunc } = await import(`./${middlewareName}`);
    middlewareFuncs.push(middlewareFunc);
  };
  routeDetails.middlewares.map(addMiddlewares);
  response.locals.routeDetails = routeDetails;
  const getNextFunc = (index: number) => {
    middlewareFuncs[index] instanceof Function
      ? middlewareFuncs[index](request, response, getNextFunc(index + 1))
      : next();
  };
  getNextFunc(0);
};

export default fetchRouteMiddleware;
