import grpc from "grpc";
import { createVerifyTokenRequest, createGetManyUsersRequest } from "interfaces/grpc/requests";
import opentracing from "opentracing";
import convict from "convict";
import BaseError from "interfaces/http/errors/base";
import { ConfigSchema } from "types";
import ClientServices from "../../interfaces/grpc/services-protos-nodejs/services/user/service_grpc_pb";

export interface TokenPayload {
  token: string;
  tokenType: string;
  currentUrl: string;
  ipAddress: string;
}

/**
 * class AuthGrpcClient
 */
class AuthGrpcClient {
  config: convict.Config<ConfigSchema>;

  tracer: opentracing.Tracer;

  logSpanError: (arg0: opentracing.Span | opentracing.SpanContext, arg1: BaseError) => void;

  hostport: string;

  client: ClientServices.UserAPIClient;

  constructor({
    config,
    tracing: { tracer, logSpanError },
  }: {
    config: convict.Config<ConfigSchema>;
    tracing: {
      tracer: opentracing.Tracer;
      logSpanError: (span: opentracing.Span | opentracing.SpanContext, error: BaseError) => void;
    };
  }) {
    this.config = config;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.hostport = this.config.get("app.userServiceGrpcHostPort") as string;
    this.client = new ClientServices.UserAPIClient(
      this.hostport,
      grpc.credentials.createInsecure()
    );
  }

  /**
   * verify a token
   * @param {*} payload - { token, tokenType, currentUrl }
   * @returns {Promise}
   *
   */
  async verifyToken(payload: TokenPayload): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        const request = createVerifyTokenRequest(payload);
        this.client.verifyToken(request, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          const { success, user } = response.toObject();
          resolve({ success, user: JSON.parse(user) });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * get many users
   * @param {*} userIdsList
   * @returns {Promise}
   *
   */
  async getManyUsers(userIdsList: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        const request = createGetManyUsersRequest(userIdsList);
        this.client.getManyUsers(request, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          const { success, usersList } = response.toObject();
          resolve({ success, usersList });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default AuthGrpcClient;
