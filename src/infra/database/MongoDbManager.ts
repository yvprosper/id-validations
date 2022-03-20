import convict from "convict";
import Logger from "infra/logging/Logger";
import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import { ConfigSchema } from "types/custom";

interface ConnectOptions {
  poolSize: number;
  useNewUrlParser: boolean;
  useFindAndModify: boolean;
  useCreateIndex: boolean;
  useUnifiedTopology: boolean;
  autoIndex: boolean;
  ssl: boolean;
  user: string;
  pass: string;
  dbName: string;
}

class MongoDbManager {
  config: convict.Config<ConfigSchema>;

  logger: Logger;

  constructor({ config, logger }: { config: convict.Config<ConfigSchema>; logger: Logger }) {
    mongoose.Promise = global.Promise;
    // initialize beautifyUnique on all schema
    mongoose.plugin(beautifyUnique);
    this.config = config;
    this.logger = logger;
  }

  async connect(poolSize = 25, autoIndex = true) {
    // let dbName =
    //   this.config.get("app.env") === "testing"
    //     ? this.config.get("database.test")
    //     : this.config.get("database.name");
    let connectionString: string = null;

    if (this.config.get("app.env") === "staging" || this.config.get("app.env") === "production") {
      connectionString = `mongodb+srv://${this.config.get(
        "database.host"
      )}/test?retryWrites=true&w=majority`;
    } else {
      connectionString = `mongodb://${this.config.get("database.host")}:${this.config.get(
        "database.port"
      )}/test?authSource=admin&retryWrites=true&w=majority`;
    }

    const options: ConnectOptions = {
      poolSize, // Maintain up to 20 (default if not specified) socket connections,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      autoIndex,
      ssl: false,
      user: null,
      pass: null,
      dbName: this.config.get("database.name") as string,
    };

    if (this.config.get("database.auth")) {
      options.user = encodeURIComponent(this.config.get("database.user") as string);
      options.pass = encodeURIComponent(this.config.get("database.password") as string);
    }

    this.logger.info("Connecting to MongoDB database...");
    await mongoose.connect(connectionString, options).catch((error) => {
      this.logger.info("Error while connecting to MongoDB database");
      this.logger.error(error);
      console.log(JSON.stringify(error), 92020);
      process.exit(1);
    });

    if (this.config.get("app.env") === "development") {
      mongoose.set("debug", true);
    }

    this.logger.info("Connected to MongoDB database");
  }

  async close() {
    this.logger.info("Closing database...");

    await mongoose.connection.close().catch((error) => {
      this.logger.info("Error while closing MongoDB database");
      this.logger.error(error);
      process.exit(1);
    });

    this.logger.info("MongoDB Database closed");
  }
}

export default MongoDbManager;
