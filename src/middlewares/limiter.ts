import { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

export default (config: rateLimit.Options): RequestHandler => rateLimit(config);
