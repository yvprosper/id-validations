/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import ResponseManager from "interfaces/http/manager/Response";
import HttpStatus from "http-status-codes";
import config from "config/";
import Logger from "infra/logging/Logger";
import express from "express";
import { ExpressJoiError } from "express-joi-validation";

const logger = new Logger({ config });
// Error middleware handler
export default (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any | ExpressJoiError,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.log("\n START OF ERROR \n---------------");
  console.log(err);
  logger.error(err);
  console.log("-------------\n END OF ERROR \n");
  switch (err.name || err.error.name) {
    case "ValidationError":
      ResponseManager.getResponseHandler(res).onError(
        err.name || err.error.name,
        HttpStatus.BAD_REQUEST,
        err.message || err.error.toString(),
        err.errors || err.error.details
      );
      break;

    default:
      ResponseManager.getResponseHandler(res).onError(
        err.name || "InternalServerError",
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        err.message || "Something bad happened!",
        err.data || {}
      );
  }
};
