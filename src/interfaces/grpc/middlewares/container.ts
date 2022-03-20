import container from "container";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (ctx: any, next: any) => {
  ctx.container = container;
  await next();
};
