import { NextFunction, Request, Response } from "express";

import fetchGlobalMiddlewares from "../services/fetch-global-middlewares";
import fetchRouteDetails from "../services/fetch-route-details";
import safePromise from "../utils/safe-promise";
import Middleware from "../entities/middleware";

type MiddlewareFunction = (request: Request, response: Response, next: NextFunction) => void;
type MiddlewareImports = Array<Promise<MiddlewareFunction>>;

const dynamicImport = async (path: string) => await import(path);

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const [error, routeDetails] = await safePromise(
    fetchRouteDetails(request.path, request.method),
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
    transposedConfigs: {
      isGlobalMiddlewaresAllowed,
    },
  } = routeDetails;
  const addMiddlewares = async (middleware: Middleware) => {
    const { middlewareName, options } = middleware;
    const middlewarePath = `../middlewares/${middlewareName}`;
    const [error, importedMiddleware] = await safePromise(dynamicImport(middlewarePath));
    if (error) {
      throw error;
    }
    return importedMiddleware.default(options);
  };
  const importPromises = middlewares.map(addMiddlewares);
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
  middlewareImportPromises.push(...importPromises);
  const [dynamicImportError, dynamicImports] = await safePromise(Promise.all(middlewareImportPromises));
  if (error) {
    throw dynamicImportError;
  }
  if (Array.isArray(dynamicImports)) {
    middlewareFuncs.push(...dynamicImports);
  }
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
