import { RequestHandler } from 'express';
import cors from 'cors';

export default (
  config: cors.CorsOptions | cors.CorsOptionsDelegate | undefined,
): RequestHandler => cors(config);
