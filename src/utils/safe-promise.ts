import { Connection } from 'typeorm';

import Route from '../entities/route';
import Middleware from '../entities/middleware';

export type SafePromiseParam =
  | Connection
  | Route
  | [Route]
  | Middleware
  | [Middleware];
export type SafePromiseThen = [null, SafePromiseParam];
export type SafePromiseError = [Error];
export type SafePromiseResponse = SafePromiseThen | SafePromiseError;

export declare type safePromiseFunction = (
  promise: Promise<SafePromiseParam>
) => Promise<SafePromiseResponse>;

const safePromise = async (
  promise: Promise<SafePromiseParam>
): Promise<SafePromiseResponse> => {
  try {
    return [null, await promise];
  } catch (error) {
    return [error];
  }
};

export default safePromise;
