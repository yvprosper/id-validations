// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger = async (ctx: any, next: any) => {
  const start = new Date();

  await next();
  const ms: number = Number(new Date()) - Number(start);
  console.log("%s %s [%s] - %s ms", ctx.service, ctx.name, ctx.type, ms);
};

export default logger;
