import { RequestHandler } from "express";
import helmet, { IHelmetXssFilterConfiguration } from "helmet";

export default (config: IHelmetXssFilterConfiguration): RequestHandler =>
  helmet.xssFilter(config);
