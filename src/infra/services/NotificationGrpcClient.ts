import convict from "convict";
import grpc from "grpc";
import BaseError from "interfaces/http/errors/base";
// import { createQueueEmailRequest, createQueueSmsRequest } from "interfaces/grpc/requests";
import opentracing from "opentracing";
import { ConfigSchema, EmailSMSPayload } from "types";
import ClientServices from "../../interfaces/grpc/services-protos-nodejs/services/notification/service_grpc_pb";

/**
 * class NotificationGrpcClient
 */
class NotificationGrpcClient {
  config: convict.Config<ConfigSchema>;

  tracer: opentracing.Tracer;

  logSpanError: (arg0: opentracing.Span | opentracing.SpanContext, arg1: BaseError) => void;

  hostport: string;

  client: ClientServices.NotificationAPIClient;

  constructor({
    config,
    tracing: { tracer, logSpanError },
  }: {
    config: convict.Config<ConfigSchema>;
    tracing: {
      tracer: opentracing.Tracer;
      logSpanError: (span: opentracing.Span | opentracing.SpanContext, error: BaseError) => void;
    };
  }) {
    this.config = config;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.hostport = this.config.get("app.notificationGrpcHostPort") as string;
    // this.client = new ClientServices.NotificationAPIClient(
    //   this.hostport,
    //   grpc.credentials.createInsecure()
    // );
  }

  /**
   * queue email
   * @param {*} payload
   * @param {*} span
   * @returns {Promise}
   *
   */
  async queueEmail(payload: EmailSMSPayload, span: opentracing.Span): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        console.log({ hostport: this.hostport });
        const traceContext = {};
        this.tracer.inject(span, opentracing.FORMAT_TEXT_MAP, traceContext);
        const metadata = new grpc.Metadata();
        metadata.add("trace", JSON.stringify(traceContext));
        // const request = createQueueEmailRequest(payload);
        // this.client.queueEmail(request, metadata, (error, response) => {
        //   if (error) {
        //     reject(error);
        //     return;
        //   }
        //   const { success, response: data } = response.toObject();
        //   resolve({ success, response: JSON.parse(data) });
        // });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * queue SMS
   * @param {*} payload
   * @param {*} span
   * @returns {Promise}
   *
   */
  async queueSms(payload: EmailSMSPayload, span: opentracing.Span): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        console.log({ hostport: this.hostport });
        const traceContext = {};
        this.tracer.inject(span, opentracing.FORMAT_TEXT_MAP, traceContext);
        const metadata = new grpc.Metadata();
        metadata.add("trace", JSON.stringify(traceContext));
        // const request = createQueueSmsRequest(payload);
        // this.client.queueSms(request, metadata, (error, response) => {
        //   if (error) {
        //     reject(error);
        //     return;
        //   }
        //   const { success, response: data } = response.toObject();
        //   resolve({ success, response: JSON.parse(data) });
        // });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default NotificationGrpcClient;
