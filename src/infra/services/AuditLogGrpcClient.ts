import grpc from "grpc";
import { createPublishEventRequest } from "interfaces/grpc/requests";
import flatten from "flat";
import opentracing from "opentracing";
import convict from "convict";
import BaseError from "interfaces/http/errors/base";
import { ConfigSchema, PublishEvent, User, UserAgent } from "types";
import ClientServices from "../../interfaces/grpc/services-protos-nodejs/services/auditlog/service_grpc_pb";

/**
 * class AuditLogGrpcClient
 */
class AuditLogGrpcClient {
  config: convict.Config<ConfigSchema>;

  tracer: opentracing.Tracer;

  logSpanError: (arg0: opentracing.Span | opentracing.SpanContext, arg1: BaseError) => void;

  hostport: string;

  client: ClientServices.AuditLogAPIClient;

  userAgent: UserAgent;

  ipAddress: string;

  currentUser: User;

  constructor({
    config,
    tracing: { tracer, logSpanError },
    userAgent,
    ipAddress,
    currentUser,
  }: {
    config: convict.Config<ConfigSchema>;
    tracing: {
      tracer: opentracing.Tracer;
      logSpanError: (span: opentracing.Span | opentracing.SpanContext, error: BaseError) => void;
    };
    userAgent: UserAgent;
    ipAddress: string;
    currentUser: User;
  }) {
    this.config = config;
    this.tracer = tracer;
    this.logSpanError = logSpanError;
    this.hostport = this.config.get("app.auditLogGrpcHostPort") as string;
    this.client = new ClientServices.AuditLogAPIClient(
      this.hostport,
      grpc.credentials.createInsecure()
    );
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.currentUser = currentUser;
  }

  /**
   * log an audit
   * @param {*} payload
   * @param {*} span
   * @returns {Promise}
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publishEvent(payload: PublishEvent, span: opentracing.Span): Promise<unknown> {
    return new Promise((resolve, reject) => {
      try {
        let auditActivityDetails = "";
        if (typeof payload.activityDetail === "object" && payload.activityDetail !== null) {
          auditActivityDetails = JSON.stringify(
            flatten(payload.activityDetail, {
              delimiter: "_",
            })
          );
        }

        const eventPayload = Object.assign(payload, {
          deviceInfo: {
            browser: this.userAgent.browser,
            os: this.userAgent.os,
            version: this.userAgent.version,
          },
          ipAddress: this.ipAddress,
          businessId: this.currentUser.businessId,
          businessType: this.currentUser.businessType,
          userId: this.currentUser._id,
          activityDetail: auditActivityDetails,
        });
        const traceContext = {};
        this.tracer.inject(span, opentracing.FORMAT_TEXT_MAP, traceContext);
        const metadata = new grpc.Metadata();
        metadata.add("trace", JSON.stringify(traceContext));
        const request = createPublishEventRequest(eventPayload);
        this.client.publishEvent(request, metadata, (error, response) => {
          if (error) {
            reject(error);
            return;
          }
          const { success, response: data } = response.toObject();
          resolve({ success, response: JSON.parse(data) });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default AuditLogGrpcClient;
