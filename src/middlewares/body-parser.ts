import bodyParser from "body-parser";
import { NextHandleFunction } from 'connect';

export default (): NextHandleFunction => bodyParser.json();
