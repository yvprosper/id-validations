import Mali from "mali";
import { asValue, AwilixContainer } from "awilix";
import services from "stubs/todo/service_grpc_pb";

import { getATodo } from "interfaces/grpc/services";
import { grpcLogger, ipAddress, container } from "interfaces/grpc/middlewares";
import Logger from "infra/logging/Logger";
import convict from "convict";
import { ConfigSchema } from "types/custom";

interface Contxt {
  container?: AwilixContainer;
}

/**
 *
 *
 * @class Server
 */
class Server {
  logger: Logger;

  config: convict.Config<ConfigSchema>;

  constructor({ config, logger }: { logger: Logger; config: convict.Config<ConfigSchema> }) {
    this.logger = logger;
    this.config = config;
  }

  /**
   *
   * @memberof Server
   */
  async start() {
    const app = new Mali(services, "TodoAPI");
    // const self = this;
    app.on("error", (error, ctx) => {
      const newError = error;
      newError.method = ctx.name;
      newError.methodType = ctx.type;
      console.log("\n START OF GRPC_ERROR \n---------------");
      console.log(error);
      this.logger.error(newError);
      console.log("-------------\n END OF GRPC_ERROR \n");
    });
    // const { getATodo } = this;
    // register middlewares
    // app.use(container);
    // app.context = Object.assign(app.context, { container });
    // console.log(app.context, 8930);
    const contxt: Contxt = app.context;
    contxt.container = container;
    app.use(ipAddress); // This middleware is not workinng as intended - fix required TODO:
    app.use(grpcLogger);
    // this middleware is to make sure all attributes on the grpc container is consistent with http interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.use(async (ctx: any, next: any) => {
      const userAgent = {
        browser: ctx.get("user-agent"),
        os: ctx.get("user-agent"),
        version: ctx.get("user-agent"),
      };
      ctx.container.register({
        currentUser: asValue({}), // User will be added from auth middleware...
        userAgent: asValue(userAgent), // No user agent will be needed for gRPC
      });
      await next();
    });
    // register application methods
    app.use({ getATodo });
    // start application
    const port = this.config.get("app.grpcPort");
    await app.start(`0.0.0.0:${port}`);
    this.logger.info(`[pid ${process.pid}] GRPC server Listening on port ${port}`);
  }
}

export default Server;
