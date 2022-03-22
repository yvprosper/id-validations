const dbConfig = {
  auth: {
    doc: "The database host",
    format: Boolean,
    default: true,
    env: "DATABASE_IS_AUTH",
    sensitive: false,
  },
  port: {
    doc: "The database port",
    format: "port",
    default: 27017,
    env: "DATABASE_PORT",
    sensitive: false,
  },
  host: {
    doc: "The database host",
    format: "*",
    default: "localhost",
    env: "DATABASE_HOST",
    sensitive: false,
  },
  name: {
    doc: "The database name",
    format: "*",
    default: "", // add a good default
    env: process.env.NODE_ENV === "test" ? "TEST_DATABASE_NAME" : "DATABASE_NAME",
    sensitive: true,
  },
  test: {
    doc: "The database name",
    format: "*",
    default: "", // add a good default
    env: "TEST_DATABASE_NAME",
    sensitive: true,
  },
  user: {
    doc: "The database username",
    format: "*",
    default: "",
    env: "DATABASE_USER",
    sensitive: true,
  },
  password: {
    doc: "The database password",
    format: "*",
    default: "",
    env: "DATABASE_PASSWORD",
    sensitive: true,
  },
  localPort: {
    doc: "The db docker port",
    format: "port",
    default: 7017,
    env: "MONGODB_LOCAL_PORT",
    sensitive: false,
  },
};

exports.database = dbConfig;
