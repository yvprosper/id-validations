import { asValue } from "awilix";
import UnauthorizedError from "interfaces/http/errors/Unauthorized";
import ForbiddenError from "interfaces/http/errors/Forbidden";
import publicIp from "public-ip";
import express from "express";
import container from "container";

export default (tokenType = "jwt") => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { userGrpcClient, appEnvironment, ipAddress } = container.cradle;
      const { headers } = req;
      const jwtToken = headers.authorization && headers.authorization.split("Bearer ")[1];
      const apiToken = headers.token;
      const token = tokenType === "jwt" ? jwtToken : apiToken;
      const ip = ipAddress === "::1" ? await publicIp.v4() : ipAddress;
      const data = await userGrpcClient.verifyToken({
        tokenType,
        token,
        currentUrl: req.url,
        ipAddress: ip,
      });

      // check if request is for the right environment
      if (appEnvironment !== data.user.environment) {
        throw new ForbiddenError(
          `Unauthorized: You cannot make a request to ${appEnvironment.toUpperCase()} environment from  ${data.user.environment.toUpperCase()} environment`,
          403,
          {
            requestEnvironment: data.user.environment,
          }
        );
      }

      // save user to req.user
      req.user = data.user;
      // save user to container so it is available to any method, function with access to the container

      container.register({
        currentUser: asValue(data.user),
      });
      next();
    } catch (error) {
      next(new UnauthorizedError(error.message));
    }
  };
};
