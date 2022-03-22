import express, { Router } from "express";
import http from "http";
import path from "path";
import Logger from "infra/logging/Logger";
import convict from "convict";
import { ConfigSchema } from "types/custom";

class Server {
  config: convict.Config<ConfigSchema>;

  logger: Logger;

  express: express.Application;

  appServer: http.Server;

  constructor({
    config,
    router,
    logger,
  }: {
    config: convict.Config<ConfigSchema>;
    router: Router;
    logger: Logger;
  }) {
    this.config = config;
    this.logger = logger;
    this.express = express();
    this.express.disable("x-powered-by");
    this.express.use(
      "/rest-api",
      express.static(path.resolve(__dirname, "../../../docs/restdocs"))
    );
    this.express.use("/readme", express.static(path.resolve(__dirname, "../../../docs/readme")));
    this.express.use(router);
    // parse application/x-www-form-urlencoded
    this.express.use(express.urlencoded({ extended: false }));
    this.appServer = http.createServer(this.express);
  }

  start() {
    return new Promise((resolve) => {
      const server = this.appServer.listen(this.config.get("app.httpPort"), () => {
        const addr = server.address();
        const port = typeof addr === "string" ? `pipe/socket ${addr}` : `port ${addr.port}`;
        this.logger.info(`[pid ${process.pid}] REST server Listening on port ${port}`);
        return resolve(this.appServer);
      });
    });
  }
}

export default Server;
