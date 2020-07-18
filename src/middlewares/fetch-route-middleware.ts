import { NextFunction, Request, Response } from "express";

import fetchGlobalMiddlewares from "../services/fetch-global-middlewares";
import fetchRouteDetails from "../services/fetch-route-details";
import safePromise from "../utils/safe-promise";

type MiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void;
type MiddlewareImports = Array<Promise<MiddlewareFunction>>;

const dynamicImport = async (path: string) => (await import(path)).default();

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
  if (!routeDetails) {
    throw new Error('Route details 404');
  }
  const middlewareFuncs: MiddlewareFunction[] = [];
  const middlewareImportPromises: MiddlewareImports = [];
  const {
    middlewares,
    configs,
  } = routeDetails;
  const isGlobalMiddlewaresAllowed = configs.find((config) => config.routeConfigName === "isGlobalMiddlewaresAllowed");
  const addMiddlewares = async (middleware: {
    middlewareName: string;
  }) => {
    const { middlewareName } = middleware;
    const middlewarePath = `../middlewares/${middlewareName}`;
    const [error, importedMiddleware] = await safePromise(dynamicImport(middlewarePath));
    if (error) {
      throw error;
    }
    return importedMiddleware;
  };
  if (isGlobalMiddlewaresAllowed) {
    const [
      fetchingGlobalMiddlewaresError,
      globalMiddlewares,
    ] = await safePromise(fetchGlobalMiddlewares());
    if (fetchingGlobalMiddlewaresError) {
      return next(fetchingGlobalMiddlewaresError);
    }
    globalMiddlewares && globalMiddlewares.map(addMiddlewares);
    const importPromises = middlewares.map(addMiddlewares);
    middlewareImportPromises.push(...importPromises);
  }
  const importPromises = middlewares.map(addMiddlewares);
  middlewareImportPromises.push(...importPromises);
  const [dynamicImportError, dynamicImports] = await safePromise(Promise.all(middlewareImportPromises));
  if (error) {
    throw dynamicImportError;
  }
  if (Array.isArray(dynamicImports)) {
    middlewareFuncs.push(...dynamicImports);
  }
  middlewareFuncs
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
  getNextFunc(0);
};

export default fetchRouteMiddleware;
