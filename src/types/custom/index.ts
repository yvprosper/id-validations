import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

export interface ConfigSchema {
  app: Record<string, unknown>;
  database: Record<string, unknown>;
  elasticsearch: Record<string, unknown>;
  fluentd: Record<string, unknown>;
  rabbitmq: Record<string, unknown>;
  redis: Record<string, unknown>;
}

export interface UserAgent {
  browser: string;
  os: string;
  version: string;
}

export interface PublishEvent {
  deviceInfo?: UserAgent;
  businessId?: string;
  businessType?: string;
  ipAddress?: string;
  activityDetail?: string;
  userId?: string;
  activity: string;
  event: string;
  resource: string;
}

export interface User {
  businessId?: string;
  businessType?: string;
  _id: string;
  firstName: string;
  lastName: string;
}

export interface AttachmentData {
  filename?: string;
  url?: string;
  _id?: string;
  createdAt?: string;
  fileSizeInByte?: number;
  fileType?: string;
  fileUrl?: string;
}

export interface EmailSMSPayload {
  from: string;
  to?: Array<string>;
  subject?: string;
  cc?: Array<string>;
  bcc?: Array<string>;
  replyTo?: string;
  templatePayload?: string;
  templateName?: string;
  attachments?: Array<AttachmentData>;
  message?: string;
  phoneNumber?: string;
}

export interface DummyRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    firstName: string;
    lastName: string;
    email: string;
    _id?: string;
  };
}
