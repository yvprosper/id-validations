import { createContainer, asValue, asClass, asFunction, InjectionMode, Lifetime } from "awilix";
import { scopePerRequest } from "awilix-express";
import config from "config";
import MongoDbManager from "infra/database/MongoDbManager";
import redisManager from "infra/database/redisManager";
import elasticsearchManager from "infra/database/elasticSearchManager";
import router from "interfaces/http/router/routes";
import restServer from "interfaces/http/Server";
import Logger from "infra/logging/Logger";
import models from "infra/database/models/mongoose";
import tracing from "infra/tracer/tracer";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  currentUser: asValue({}), // User will be added from auth middleware...
});

container.register({
  containerMiddleware: asValue(scopePerRequest(container)),
  restServer: asClass(restServer).singleton(),
  config: asValue(config),
  router: asFunction(router).singleton(),

  // Infrastructure layer
  logger: asClass(Logger).singleton(),
  database: asClass(MongoDbManager).singleton(),
  cache: asFunction(redisManager).singleton(),
  elasticClient: asFunction(elasticsearchManager).singleton(),
  models: asValue(models),
  tracing: asValue(tracing),

  // External services
});

// load all repositories
container.loadModules(
  [
    [
      "infra/repositories/*!(BaseRepository).js",
      {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    ],
  ],
  {
    // we want `TodoRepository` to be registered as `todoRepository`.
    formatName: "camelCase",
    resolverOptions: {},
    cwd: __dirname,
  }
);

// load all usecases
container.loadModules(
  [
    [
      "app/*/*!(index.js).js",
      {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    ],
  ],
  {
    // we want `GetATodo` to be registered as `getATodo`.
    formatName: "camelCase",
    resolverOptions: {},
    cwd: __dirname,
  }
);

// load all grpc clients
container.loadModules(
  [
    [
      "infra/services/*.js",
      {
        lifetime: Lifetime.SINGLETON,
        register: asClass,
      },
    ],
  ],
  {
    // we want `TodoGrpcClient` to be registered as `todoGrpcClient`.
    formatName: "camelCase",
    resolverOptions: {},
    cwd: __dirname,
  }
);

export default container;
