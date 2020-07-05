import {Request, Response} from 'express';
import safePromise from '../utils/safePromise';
import fetchRouteDetails from '../services/fetchRouteDetails';
import fetchGlobalMiddlewares from '../services/fetchGlobalMiddlewares';

interface Middleware {
    middlewareName: string
}

export default async (
  request: Request,
  response: Response,
  next: Function,
): Promise<any> => {
  const [error, routeDetails] = await safePromise(
    fetchRouteDetails(request.path),
  );
  if (error) {
    throw error;
  }
  const middlewareFuncs: Array<Function> = [];
  if (routeDetails.config.isGlobalMiddlewaresAllowed) {
    const [error, globalMiddlewares] = await safePromise(
      fetchGlobalMiddlewares(),
    );
    if (error) {
      throw error;
    }
    const addGlobalMiddlewares =
      async (middleware: { middlewareName: any; }) => {
        const {middlewareName} = middleware;
        const {default: middlewareFunc} = await import(`./${middlewareName}`);
        middlewareFuncs.push(middlewareFunc);
      };
    globalMiddlewares.middlewares.map(addGlobalMiddlewares);
  }
  const addMiddlewares = async (middleware: { middlewareName: any; }) => {
    const {middlewareName} = middleware;
    const {default: middlewareFunc} = await import(`./${middlewareName}`);
    middlewareFuncs.push(middlewareFunc);
  };
  routeDetails.middlewares.map(addMiddlewares);
  const getNextFunc = (index: number) => {
    middlewareFuncs[index] instanceof Function ?
      middlewareFuncs[index](request, response, getNextFunc(index + 1)) :
      next();
  };
  getNextFunc(0);
};
