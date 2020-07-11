import fs from 'fs';
import https from 'https';

import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';

import loadRoutes from './routes';
import safePromise, { safePromiseFunction } from './utils/safe-promise';

declare global {
  namespace NodeJS {
    interface Global {
      safePromise: safePromiseFunction;
    }
    interface ProcessEnv {
      DB_TYPE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      PORT: number;
      DEBUG: boolean;
      SECURED_SERVER: string;
    }
  }
}

global.safePromise = safePromise;

const compiler = webpack({
  // Configuration Object
});

compiler.run((err: Error, stats: webpack.Stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // eslint-disable-next-line no-console
  console.log(
    stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true // Shows colors in the console
    })
  );
});

// const watching = compiler.watch({
//   // Example watchOptions
//   aggregateTimeout: 300,
//   poll: undefined,
// }, (err: Error, stats: webpack.Stats) => {
//   if (err || stats.hasErrors()) {
//     // Handle errors here
//     return;
//   }
//   // eslint-disable-next-line no-console
//   console.log(stats.toString({
//     chunks: false, // Makes the build much quieter
//     colors: true, // Shows colors in the console
//   }));
// });

// watching.close(() => {
//   // eslint-disable-next-line no-console
//   console.log('Watching Ended.');
// });

const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const {
  env: { PORT: port, SECURED_SERVER }
} = process;
const app: express.Application = express();

const onBoot = () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
  // fetchRoutes(app);
  // fetchMiddlewares(app);
  loadRoutes(app);
};

const startServer = () => {
  if (SECURED_SERVER === 'YES') {
    const privateKey = fs.readFileSync('privatekey.pem');
    const certificate = fs.readFileSync('certificate.pem');
    https
      .createServer(
        {
          key: privateKey,
          cert: certificate
        },
        app
      )
      .listen(port);
  } else {
    app.listen(port, onBoot);
  }
};

startServer();

export default app;
