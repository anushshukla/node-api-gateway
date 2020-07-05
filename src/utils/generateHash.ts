import crypto, {Utf8AsciiLatin1Encoding, Hash} from 'crypto';

interface HashOptions {
    string: string,
    algorithm: string,
    charset: Utf8AsciiLatin1Encoding
}

export default ({string, algorithm, charset}: HashOptions): Hash =>
  crypto
    .createHash(algorithm)
    .update(string, charset);
