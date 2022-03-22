import tracingMiddleware from "interfaces/http/middleware/tracing";
import express from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catchErrors = (controllerMethod: any) => {
  // eslint-disable-next-line func-names
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    return tracingMiddleware(req, res, next, controllerMethod);
    // return controllerMethod(req, res, next).catch(next);
  };
};

export default catchErrors;
