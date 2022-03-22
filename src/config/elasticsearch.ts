const esConfig = {
  host: {
    doc: "Elasticsearch host",
    format: "*",
    default: null,
    env: "ELASTICSEARCH_HOST",
    sensitive: false,
  },
  port: {
    doc: "Elasticsearch port",
    format: "port",
    default: null,
    env: "ELASTICSEARCH_PORT",
    sensitive: false,
  },
  username: {
    doc: "Elasticsearch username",
    format: "*",
    default: null,
    env: "ELASTICSEARCH_USERNAME",
    sensitive: true,
  },
  password: {
    doc: "Elasticsearch password",
    format: "*",
    default: null,
    env: "ELASTICSEARCH_PASSWORD",
    sensitive: true,
  },
  indexName: {
    doc: "Elasticsearch index name",
    format: "*",
    default: null,
    env: "ELASTICSEARCH_INDEX_NAME",
    sensitive: false,
  },
  isTls: {
    doc: "Is Elasticsearch TLS",
    format: Boolean,
    default: null,
    env: "ELASTICSEARCH_TLS",
    sensitive: false,
  },
};

exports.elasticsearch = esConfig;
