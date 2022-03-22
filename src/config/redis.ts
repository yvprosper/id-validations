const rdConfig = {
  host: {
    doc: "Redis host",
    format: "*",
    default: null,
    env: "REDIS_HOST",
    sensitive: false,
  },
  port: {
    doc: "Redis port",
    format: "port",
    default: null,
    env: "REDIS_PORT",
    sensitive: false,
  },
  username: {
    doc: "Redis username",
    format: "*",
    default: null,
    env: "REDIS_USERNAME",
    sensitive: true,
  },
  password: {
    doc: "Redis password",
    format: "*",
    default: null,
    env: "REDIS_PASSWORD",
    sensitive: true,
  },
  isTLS: {
    doc: "Redis isTLS",
    format: Boolean,
    default: null,
    env: "REDIS_TLS",
    sensitive: false,
  },
  prefixKeyName: {
    doc: "Redis prefix key name",
    format: "*",
    default: null,
    env: "REDIS_KEY_PREFIX",
    sensitive: false,
  },
};

exports.redis = rdConfig;
