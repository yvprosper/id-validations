import MethodNotAllowedHandler from "interfaces/http/errors/MethodNotAllowed";
import express from "express";

export default function methodNotAllowedHandler(req: express.Request) {
  throw new MethodNotAllowedHandler(
    `http method '${req.method}' for API endpoint (${req.originalUrl}) is not allowed.`
  );
}
