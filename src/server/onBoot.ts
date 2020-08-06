import express from "express";
import loadRoutes from "../routes";

export interface onBootParams {
    app: express.Application;
    port: string;
}

export default (params: onBootParams) => () => {
    const { app, port } = params;
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port}`);
    loadRoutes(app);
  };
