import * as bodyParser from "body-parser";
import { RequestHandler } from "express";

export default (): RequestHandler => bodyParser.json();
