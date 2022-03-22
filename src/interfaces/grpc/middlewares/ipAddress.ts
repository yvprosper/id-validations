import { asValue } from "awilix";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ipAddress = async (ctx: any, next: any) => {
  ctx.container.register({
    ipAddress: asValue(ctx.request.call.getPeer()),
  });
  await next();
};

export default ipAddress;
