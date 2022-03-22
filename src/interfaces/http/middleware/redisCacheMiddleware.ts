/* eslint-disable @typescript-eslint/no-explicit-any */
import ResponseManager from "interfaces/http/manager/Response";
import HTTP_STATUS from "http-status-codes";
import onEnd from "on-http-end";
import express from "express";
import container from "container";

/**
 *
 * @param {*} duration - default duration is 1hr
 */
const redisCachedMiddleware = (duration = 3600) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      if (req.method !== "GET") {
        throw new Error("Cache middleware can only be used for a GET request");
      }
      const { cache } = container.cradle;
      const key = `__express__${req.originalUrl}` || req.url;
      let data = await cache.get(key);
      if (data) {
        data = JSON.parse(data);
        res.setHeader("X-Source", "redis");
        ResponseManager.getResponseHandler(res).onSuccess(
          data.data,
          `${data.message}`,
          HTTP_STATUS.OK
        );
      } else {
        onEnd(res, async (payload: any) => {
          await cache.set(key, payload.data.toString(), "EX", duration);
        });
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export default redisCachedMiddleware;
