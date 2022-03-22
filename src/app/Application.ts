import { asValue } from "awilix";
import GrpcServer from "interfaces/grpc/Server";
import RestServer from "interfaces/http/Server";
import ElasticsearchQueryManager from "infra/libs/ElasticsearchQueryManager";
import redisManager from "infra/database/redisManager";
import container from "container";
import convict from "convict";
import Logger from "infra/logging/Logger";
import MongoDbManager from "infra/database/MongoDbManager";
import { Client } from "@elastic/elasticsearch";
import { ConfigSchema } from "types/custom";

class Application {
  restServer: RestServer;

  database: MongoDbManager;

  logger: Logger;

  config: convict.Config<ConfigSchema>;

  elasticClient: Client;

  grpcServer: GrpcServer;

  index: string;

  constructor({
    restServer,
    database,
    logger,
    config,
    elasticClient,
  }: {
    restServer: RestServer;
    database: MongoDbManager;
    logger: Logger;
    config: convict.Config<ConfigSchema>;
    elasticClient: Client;
  }) {
    const grpcServer = new GrpcServer({ logger, config });
    this.restServer = restServer;
    this.grpcServer = grpcServer;
    this.database = database;
    this.elasticClient = elasticClient;
    this.logger = logger;
    this.config = config;
    this.index = config.get("elasticsearch.indexName") as string;
  }

  async start() {
    if (this.database) {
      await this.database.connect();
    }
    // start and create elasticsearch index and mapping
    if (this.elasticClient) {
      try {
        await this.elasticClient.ping();

        this.logger.info("Connected to Elasticsearch");

        // create index mappings
        const elasticsearchQueryManager = new ElasticsearchQueryManager(this.elasticClient);
        await elasticsearchQueryManager.createIndex({ index: this.index }); // you can modify this method to accept multiple elasticsearch index

        this.logger.info("Elasticsearch index and mapping created if not exists");
        //  logger.info("Error creating index");
      } catch (error) {
        this.logger.info("elasticsearch cluster is down!");
        throw error;
      }
    }
    if (redisManager) {
      const redisClient = await redisManager({ config: this.config, logger: this.logger });

      container.register({
        cache: asValue(redisClient),
      });
    }
    await this.restServer.start();
    await this.grpcServer.start();
  }

  shutdown = async () => {
    // clean up your resources and exit
    if (this.config.get("app.env") === "test") {
      await this.database.close();
    } else {
      process.exit(1);
    }
  };
}

export default Application;
