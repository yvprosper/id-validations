import convict from "convict";
import FluentLogger from "fluent-logger";
import BaseError from "interfaces/http/errors/base";
import { ConfigSchema } from "types/custom";

class Logger {
  config: convict.Config<ConfigSchema>;

  TAG: string;

  defaultMessage: { service: { name: string } };

  constructor({ config }: { config: convict.Config<ConfigSchema> }) {
    // console.log({ configFromLogger: config });
    this.config = config;
    this.TAG = "log";
    this.defaultMessage = {
      service: { name: this.config.get("app.serviceName") as string },
    };
    this.connect();
  }

  connect() {
    // console.log({
    //   serviceName: this.config.get("app.serviceName"),
    //   host: this.config.get("fluentd.host"),
    //   port: this.config.get("fluentd.port"),
    //   sharedKey: this.config.get("fluentd.sharedKey"),
    // });
    FluentLogger.configure(this.config.get("app.serviceName") as string, {
      host: this.config.get("fluentd.host") as string,
      port: this.config.get("fluentd.port") as number,
      timeout: 3.0,
      reconnectInterval: 300000, // 5 minutes
      security: {
        clientHostname: "client.local",
        sharedKey: this.config.get("fluentd.sharedKey") as string,
      },
    });
  }

  error(error: BaseError) {
    try {
      let logMessage: {
        message: string;
        status: number;
        code?: number;
        errorName: string;
        isOperationalError?: boolean;
        method?: string;
        errorType?: string;
        methodType?: string;
      };
      if (error instanceof BaseError) {
        logMessage = {
          message: error.message || (error.error && error.error.toString()) || "Unknown Error",
          status: error.status || -1,
          code: error.code || error.status || -1,
          errorName: error.name || error.error.name,
          isOperationalError: error.isOperationalError || false,
          method: error.method || "none",
          errorType: error.errorType || "HTTP",
          methodType: error.methodType || "none",
        };
      } else {
        logMessage = {
          message: error,
          errorName: "UnknownError",
          status: -1,
        };
      }

      FluentLogger.emit(this.TAG, {
        ...logMessage,
        ...this.defaultMessage,
        level: "ERROR",
        ...{
          stackTrace:
            error instanceof BaseError && !error.isOperationalError ? error.stack : "none",
        },
      });
    } catch (err) {
      this.failSilently(err);
    }
  }

  info(message: string | unknown) {
    if ((this.config.get("app.env") as string) !== "test") {
      try {
        let logMessage = {};
        if (!(message instanceof Object)) {
          logMessage = {
            message,
          };
        }
        console.log(logMessage);
        FluentLogger.emit(this.TAG, { ...logMessage, ...this.defaultMessage, level: "INFO" });
      } catch (err) {
        this.failSilently(err);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  failSilently(error: BaseError) {
    console.error({ loggerSilentError: error });
  }
}

export default Logger;
