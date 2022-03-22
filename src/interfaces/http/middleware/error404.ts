import ResourceNotFoundError from "interfaces/http/errors/ResourceNotFound";
import express from "express";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(
    new ResourceNotFoundError(
      `You have tried to access an API endpoint (${req.url}) with a '${req.method}' method that does not exist.`
    )
  );
};
