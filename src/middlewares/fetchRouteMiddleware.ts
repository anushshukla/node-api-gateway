import { Request, Response } from 'express';
import safePromise from '../utils/safePromise';
import fetchRouteDetails from '../utils/fetchRouteDetails';

interface Middleware {
    middlewareName: string
}

interface RoutePath {
    routePath: string;
    middlewares: Array<Middleware>;
}

export default (request: Request, response: Response, next: Function): void => {
    const routeDetails: RoutePath = fetchRouteDetails(request.path);
    const middlewareFuncs: Array<Function> = [];
    routeDetails.middlewares.map(async middleware => {
        const { middlewareName } = middleware;
        const { default: middlewareFunc } = await import(`./${middlewareName}`);
        middlewareFuncs.push(middlewareFunc);
    })
    const getNextFunc = (index: number) => {
        middlewareFuncs[index] instanceof Function ? middlewareFuncs[index](request, response, getNextFunc(index + 1)) : next();
    }
    getNextFunc(0);
}