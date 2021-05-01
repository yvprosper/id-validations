import grpc from "grpc";
import { createVerifyTokenRequest, createGetManyUsersRequest } from "interfaces/grpc/requests";
import ClientServices from "stubs/user/service_grpc_pb";

/**
 * class AuthGrpcClient
 */
class AuthGrpcClient {
  constructor({ config, tracing: { tracer, logSpanError } }) {
    this.config = config;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.hostport = this.config.get("app.userServiceGrpcHostPort");
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
  async verifyToken(payload) {
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
  async getManyUsers(userIdsList) {
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
