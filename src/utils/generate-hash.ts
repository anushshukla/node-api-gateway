import crypto, { Hash, Utf8AsciiLatin1Encoding } from "crypto";

interface HashOptions {
  string: string;
  algorithm: string;
  charset: Utf8AsciiLatin1Encoding;
}

const generateHash = ({ string, algorithm, charset }: HashOptions): Hash =>
  crypto.createHash(algorithm).update(string, charset);

export default generateHash;
