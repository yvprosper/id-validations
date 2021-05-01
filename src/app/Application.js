import GrpcServer from "interfaces/grpc/Server";
import ElasticsearchQueryManager from "infra/libs/ElasticsearchQueryManager";

class Application {
  constructor({ restServer, database, logger, config, elasticClient }) {
    const grpcServer = new GrpcServer({ logger, config });
    this.restServer = restServer;
    this.grpcServer = grpcServer;
    this.database = database;
    this.elasticClient = elasticClient;
    this.logger = logger;
    this.index = config.get("elasticsearch.indexName");
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
        await elasticsearchQueryManager.createIndex({ index: this.index });

        this.logger.info("Elasticsearch index and mapping created if not exists");
        //  logger.info("Error creating index");
      } catch (error) {
        this.logger.info("elasticsearch cluster is down!");
        throw error;
      }
    }
    await this.restServer.start();
    await this.grpcServer.start();
  }
}

export default Application;
