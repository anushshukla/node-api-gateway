import { RequestHandler } from 'express';
import expressSslify, { HTTPS as https } from 'express-sslify';

export default (config: expressSslify.Options | undefined): RequestHandler =>
  https(config);
