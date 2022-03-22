import createError from "interfaces/grpc/errors/createError";
import { createTodoResponse } from "interfaces/grpc/responses";
import opentracing from "opentracing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (ctx: any) => {
  return new Promise(async (resolve, reject) => {
    const {
      tracing: { tracer, logSpanError },
    } = ctx.container.cradle;
    const trace = JSON.parse(ctx.get("trace")); // get trace data from metadata
    let parentSpan = tracer.extract(
      opentracing.FORMAT_TEXT_MAP,
      trace // This is the traceContext from the client metadata object
    );
    parentSpan = tracer.startSpan("GRPC.getATodo", {
      references: [opentracing.followsFrom(parentSpan)],
    });
    try {
      const todoId = ctx.req.getTodoId();
      parentSpan.log({ event: "grpc_method_start", message: `Getting todo with Id ${todoId}` });
      const todo = await ctx.container.cradle.getATodo.execute(todoId, parentSpan);
      parentSpan.log({ event: "grpc_method_end", result: todo });
      ctx.res = createTodoResponse(todo);
      resolve({});
    } catch (error) {
      const err = createError(error);
      logSpanError(parentSpan, err);
      reject(err);
    } finally {
      parentSpan.finish();
    }
  });
};
