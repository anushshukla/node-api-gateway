import { Utf8AsciiLatin1Encoding } from "crypto";

import { NextFunction, Request, Response } from "express";

import generateHash from "../utils/generate-hash";

export default () => (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const start = Date.now();
  // Or get your request parameters
  const {
    headers: { authorization },
    path,
  } = request;
  const string = `${authorization}-${path}`;
  // Use the CryptoJS
  const algorithm = "md5";
  const charset: Utf8AsciiLatin1Encoding = "utf8";
  const hashOptions = { string, algorithm, charset };
  const hash = generateHash(hashOptions);
  // eslint-disable-next-line no-console
  console.log(`${hash} requested started at`, start);
  response.on("finish", () => {
    // eslint-disable-next-line no-console
    console.log(`${hash} requested ended at`, Date.now() - start);
  });
  next();
};
