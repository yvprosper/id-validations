// import { asValue } from "awilix";
import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import compression from "compression";
// import requestIP from "request-ip";
// import useragent from "express-useragent";
import helmet from "helmet";
import config from "config/";
import { methodNotAllowedHandler, errors, error404 } from "interfaces/http/middleware";
import deviceInfo from "interfaces/http/middleware/deviceInfo";

import routerV1 from "interfaces/http/router/v1";

export default ({ containerMiddleware }) => {
  const apiRouter = express.Router();

  apiRouter.use(methodOverride("X-HTTP-Method-Override"));
  // setup helmet
  // Helmet includes a whopping 12 packages that all work to block malicious parties
  // from breaking or using an application to hurt its users
  // compress json response
  apiRouter.use(compression({ threshold: "1kb" }));
  apiRouter.use(helmet());
  // Parse application/json
  apiRouter.use(
    express.json({
      limit: config.get("app.bodyLimit") as string | number,
    })
  );

  // This will attach a scoped container on the context.Middleware to create a scope per request.
  apiRouter.use(containerMiddleware);

  apiRouter.use(deviceInfo);

  /**
   * Preflight Middleware
   */

  // Enable CORS
  apiRouter.use(
    cors({
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );

  // @apiError ResourceNotFoundError The <code>id</code> of the User was not found.
  /**
   * @apiDefine MyError
   * 
    * @apiErrorExample Other Error Response:
        HTTP/1.1 404 NotFound
        {
          "success": false,
          "statusCode": 404,
          "message": "You have attempted to get a resource that does not exist.",
          "name": "ResourceNotFoundError",
          "data": {}
        }
   */

  /**
   * * @apiDefine UnauthorizedError
     * * @apiErrorExample Error Response:

    HTTP/1.1 401 Unauthorized
    {
      "success": false,
      "status_code": 401,
      "message": "Authorization is required to access this API endpoint.",
      "name": "Unauthorized",
      "data": {}
    }
  */

  apiRouter
    .route("/")
    .get((req, res) => {
      res.status(200).json({
        message: "API v1  is running",
        env: process.env.NODE_ENV,
        serviceName: process.env.SERVICE_NAME,
      });
    })
    .all(methodNotAllowedHandler);

  // Mount v1 routes
  apiRouter.use("/v1", routerV1);

  /**
   * Postflight Middleware
   */
  // handle 404's
  apiRouter.use(error404);

  // handle errors (404 is not technically an error)
  apiRouter.use(errors);

  return apiRouter;
};
