import { getDeviceInfo } from "infra/support/helpers";
import { asValue } from "awilix";
import express from "express";
import container from "container";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const deviceInfo = getDeviceInfo(req);
  req.ipAddress = deviceInfo.ipAddress;
  req.userAgent = deviceInfo.userAgent;

  container.register({
    ipAddress: asValue(req.ipAddress),
    userAgent: asValue(req.userAgent),
  });
  next();
};
