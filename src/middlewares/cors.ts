import cors from "cors";
import { RequestHandler } from "express";

export default (
  config: cors.CorsOptions | cors.CorsOptionsDelegate | undefined,
): RequestHandler => cors(config);
