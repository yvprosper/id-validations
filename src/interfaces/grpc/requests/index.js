import { VerifyTokenRequest } from "stubs/auth/messages_pb";
import { PublishEventRequest, DeviceInfo } from "stubs/auditlog/messages_pb";

const createDeviceInfo = (data) => {
  const deviceInfo = new DeviceInfo();
  deviceInfo.setBrowser(data.browser);
  deviceInfo.setOs(data.os);
  deviceInfo.setVersion(data.version);
  return deviceInfo;
};

export const createVerifyTokenRequest = (data) => {
  const verifyTokenRequest = new VerifyTokenRequest();
  verifyTokenRequest.setToken(data.token);
  verifyTokenRequest.setTokenType(data.tokenType);
  verifyTokenRequest.setCurrentUrl(data.setCurrentUrl);
  return verifyTokenRequest;
};

export const createPublishEventRequest = (data) => {
  const deviceInfo = createDeviceInfo(data.deviceInfo);
  const publishEventRequest = new PublishEventRequest();
  publishEventRequest.setDeviceInfo(deviceInfo);
  publishEventRequest.setActivity(data.activity);
  publishEventRequest.setBusinessId(data.businessId);
  publishEventRequest.setBusinessType(data.businessType);
  publishEventRequest.setEvent(data.event);
  publishEventRequest.setIpAddress(data.ipAddress);
  publishEventRequest.setResource(data.resource);
  publishEventRequest.setUserId(data.userId);
  return publishEventRequest;
};
