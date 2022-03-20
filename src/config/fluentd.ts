const fdConfig = {
  host: {
    doc: "Fluentd logger host",
    format: "*",
    default: null,
    env: "FLUENTD_HOST",
    sensitive: false,
  },
  port: {
    doc: "Fluentd logger port",
    format: "port",
    default: null,
    env: "FLUENTD_PORT",
    sensitive: false,
  },
  sharedKey: {
    doc: "Fluentd logger sharedKey",
    format: "*",
    default: null,
    env: "FLUENTD_SHARED_KEY",
    sensitive: true,
  },
};

exports.fluentd = fdConfig;
