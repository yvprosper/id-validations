import { cloneDeepWith } from "lodash";
import parsePhoneNumber from "libphonenumber-js/max";
import express from "express";
import requestIP from "request-ip";
import useragent from "express-useragent";
/**
 *
 * @module Helpers
 *
 */
/**
 * A function for adding a delay
 * @function wait
 * @param {Number} timeInMs  time in milliseconds
 * @returns {*} Object of functions
 * @category sync
 */
export const wait = (timeInMs: number): unknown => {
  // eslint-disable-next-line no-undef
  let timeoutHandle: NodeJS.Timeout;

  const promise = () => {
    return new Promise((resolve) => {
      timeoutHandle = setTimeout(resolve, timeInMs);
      return timeoutHandle;
    });
  };

  return { promise, cancel: () => clearTimeout(timeoutHandle) };
};

/**
 * A function mostly to be used for callbacks when no action needs to be carried out
 * @function noOp
 * @return {Void}
 * @category async
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noOp = (): void => {};

/**
 * A function for redacting sensitve information
 * @function redactSensitiveData
 * @param {Object} data input data
 * @param {Array} sensitiveKeys  array of keys to be redated
 * @example
 * <caption>Example usage of redactSensitiveData.</caption>
 * redactSensitiveData({ name: 'john', password: '12345' }, ['password'])
 *
 * Output
 *
{ 
  name: 'john', 
  password: '[redacted]' 
}
 * @returns {Object} Returns  data with redacted sensitiveKeys
 * @category async
 */
export const redactSensitiveData = (data: object, sensitiveKeys: Array<string>): void => {
  return cloneDeepWith(data, (value: { [x: string]: string }) => {
    if (value && typeof value === "object") {
      sensitiveKeys.forEach((key) => {
        if (value[key]) {
          // eslint-disable-next-line no-param-reassign
          value[key] = "[redacted]";
        }
      });
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateMobile = (object: any, helper: any) => {
  console.log({ object });
  const phoneNumber = parsePhoneNumber(object.mobile, object.countryCode);

  if (!phoneNumber.isValid() || phoneNumber.getType() !== "MOBILE") {
    return helper.message("Mobile must be a valid mobile number in international format");
  }
  return Object.assign(object, { mobile: phoneNumber.number });
};

export const getDeviceInfo = (req: express.Request) => {
  const source = req.headers["user-agent"];
  const userAgent = useragent.parse(source);

  return {
    ipAddress: requestIP.getClientIp(req),
    userAgent,
  };
};
