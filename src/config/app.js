const config = {
  serviceName: {
    doc: "Microservice Name",
    format: "*",
    default: null,
    env: "SERVICE_NAME",
    sensitive: false,
  },
  httpPort: {
    doc: "The rest port to bind",
    format: "port",
    default: 30007,
    env: "HTTP_PORT",
    sensitive: false,
  },
  grpcPort: {
    doc: "The grpc port to bind",
    format: "port",
    default: 30015,
    env: "GRPC_PORT",
    sensitive: false,
  },
  bodyLimit: {
    doc: "The port to bind",
    format: "*",
    default: "20mb",
    env: "BODY_LIMIT",
    sensitive: false,
  },
  apiVersion: {
    doc: "The API version",
    format: "*",
    default: "v1",
    env: "API_VERSION",
    sensitive: false,
  },
  env: {
    doc: "The application environment",
    format: ["production", "development", "test", "qa", "staging", "local"],
    default: "local",
    env: "NODE_ENV",
    sensitive: false,
  },
  frontendBaseUrl: {
    doc: "The frontend base URL",
    format: "*",
    default: null,
    env: "FRONTEND_BASE_URL",
    sensitive: false,
  },
  authServiceGrpcHostPort: {
    doc: "Auth service grpc hostport",
    format: "*",
    default: null,
    env: "AUTH_SERVICE_GRPC_HOSTPORT",
    sensitive: true,
  },
  auditLogGrpcHostPort: {
    doc: "AuditLog service grpc hostport",
    format: "*",
    default: null,
    env: "AUDITLOG_SERVICE_GRPC_HOSTPORT",
    sensitive: true,
  },
};

exports.app = config;
