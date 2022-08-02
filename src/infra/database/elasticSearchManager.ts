import { Client } from "@elastic/elasticsearch";
import convict from "convict";
import Logger from "infra/logging/Logger";
import { ConfigSchema } from "types";

const elasticsearchManager = ({
  config,
  logger,
}: {
  config: convict.Config<ConfigSchema>;
  logger: Logger;
}) => {
  logger.info("Connecting to Elasticsearch database...");

  const elasticClient = new Client({
    node: {
      url: new URL(`${config.get("elasticsearch.host")}:${config.get("elasticsearch.port")}`),
    },
    auth: {
      username: config.get("elasticsearch.username") as string,
      password: config.get("elasticsearch.password") as string,
    },
    ssl: {
      rejectUnauthorized: false,
    },
    maxRetries: 3,
    requestTimeout: 60000,
    sniffOnStart: false,
  });

  return elasticClient;
};

// Releveant documentations
// https://www.npmjs.com/package/@elastic/elasticsearch
// https://github.com/sudo-suhas/elastic-builder

export default elasticsearchManager;
