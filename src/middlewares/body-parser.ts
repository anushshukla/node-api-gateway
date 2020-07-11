import { RequestHandler } from 'express';
import * as bodyParser from 'body-parser';

export default (): RequestHandler => bodyParser.json();
