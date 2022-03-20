/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import { UserAgent } from "express-useragent";
import opentracing from "opentracing";

declare global {
  namespace Express {
    interface Request {
      span?: opentracing.Span | opentracing.SpanContext;
      user?: {
        email?: string;
      };
      ipAddress?: string;
      userAgent?: UserAgent.Details;
    }
  }
}

declare global {
  namespace Express {
    interface Response {
      errorMessage?: string;
      stackTrace?: string;
    }
  }
}
