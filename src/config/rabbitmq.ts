const mqConfig = {
  host: {
    doc: "RabbitMq host",
    format: "*",
    default: null,
    env: "RABBITMQ_HOST",
    sensitive: false,
  },
  port: {
    doc: "RabbitMq port",
    format: "port",
    default: null,
    env: "RABBITMQ_PORT",
    sensitive: false,
  },
  username: {
    doc: "RabbitMq username",
    format: "*",
    default: null,
    env: "RABBITMQ_USERNAME",
    sensitive: true,
  },
  password: {
    doc: "RabbitMq password",
    format: "*",
    default: null,
    env: "RABBITMQ_PASSWORD",
    sensitive: true,
  },
  prefixKeyName: {
    doc: "RabbitMq prefix key name",
    format: "*",
    default: null,
    env: "RABBITMQ_KEY_PREFIX",
    sensitive: false,
  },
  isTls: {
    doc: "Is RabbitMq TLS",
    format: Boolean,
    default: null,
    env: "RABBITMQ_TLS",
    sensitive: false,
  },
  vhost: {
    doc: " RabbitMq vhost",
    format: "*",
    default: null,
    env: "RABBITMQ_VHOST",
    sensitive: true,
  },
};

exports.rabbitmq = mqConfig;
