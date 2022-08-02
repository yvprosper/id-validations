import express, { Router } from "express";
import http from "http";
import path from "path";
import Logger from "infra/logging/Logger";
import convict from "convict";
import { ConfigSchema } from "types";
import { Server as IoServer, Socket } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

class Server {
  config: convict.Config<ConfigSchema>;

  logger: Logger;

  express: express.Application;

  appServer: http.Server;

  io: IoServer;

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
    this.io = new IoServer(this.appServer, { cors: { origin: "*" } });
  }

  start() {
    return new Promise((resolve) => {
      const pubClient = createClient({ socket: { url: "redis://localhost:6379" } });
      const subClient = pubClient.duplicate();
      // Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
      this.io.adapter(createAdapter(pubClient, subClient));
      // });

      const server = this.appServer.listen(this.config.get("app.httpPort"), () => {
        const addr = server.address();
        const port = typeof addr === "string" ? `pipe/socket ${addr}` : `port ${addr.port}`;
        this.logger.info(`[pid ${process.pid}] REST server Listening on port ${port}`);
        return resolve(this.appServer);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage = async (data: any, socket: Socket, io: IoServer) => {
    try {
      const { name, message, room } = data;
      // console.log({name, message, room})
      const msg = { name, message };
      if (room) {
        io.to(room).emit("message", msg);
      } else {
        socket.broadcast.emit("message", msg);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  async onConnection() {
    await this.start();
    this.io.on("connection", async (socket: Socket) => {
      socket.on("input", (data) => {
        console.log({ data });
        this.sendMessage(data, socket, this.io);
      });

      socket.on("join-room", (rooms) => {
        rooms.forEach((room) => socket.join(room));
      });

      socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
      });
    });

    this.io.use((socket, next) => {
      const { token } = socket.handshake.auth;
      if (token) {
        socket.disconnect();
      }
      console.log({ token });
      // ...
      next();
    });
  }
}

export default Server;
