import { RequestHandler } from "express";
import helmet from "helmet";

export default (
  config: helmet.IHelmetHstsConfiguration | undefined,
): RequestHandler => helmet.hsts(config);
