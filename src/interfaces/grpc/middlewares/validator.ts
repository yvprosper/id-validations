/* eslint-disable @typescript-eslint/no-explicit-any */
const validatorMiddleware = (schema: any) => {
  return async (ctx: any, next: any) => {
    await schema.validateAsync(ctx.req.toObject(), {
      abortEarly: false,
    });
    await next();
  };
};
export default validatorMiddleware;
