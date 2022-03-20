import createGRPCError from "grpc-create-error"; // create-grpc-error has been deprecated
/**
 * @example
 console.log({
              message: error.message,
              code: error.code,
              stackTrace: error.stack,
              name: error.name,
              details: error.details,
              metadata: error.metadata.getMap(),
            });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (error: any) => {
  const err = error;
  err.status = err.message.includes("Permission denied") ? 401 : err.status;
  if (!err.status) err.status = (err.response && err.response.status) || 500;
  const ERRORS = {
    400: {
      code: 3,
      name: "INVALID_ARGUMENT",
      stackTrace: err.stack,
      message: err.message || "Invalid data in request payload",
      success: false,
      isOperationalError: true,
      error: err,
    },
    409: {
      code: 6,
      name: "ALREADY_EXISTS",
      stackTrace: err.stack,
      message: err.message || "Resource already exists",
      success: false,
      isOperationalError: true,
      error: err,
    },
    401: {
      code: 16,
      name: "UNAUTHENTICATED",
      stackTrace: err.stack,
      message: err.message || "Unauthorized, invalid authentication credentials",
      success: false,
      isOperationalError: true,
      error: err,
    },
    402: {
      code: 9,
      name: "FAILED_PRECONDITION",
      stackTrace: err.stack,
      message: err.message || "Payment is required",
      success: false,
      isOperationalError: true,
      error: err,
    },
    403: {
      code: 7,
      name: "PERMISSION_DENIED",
      stackTrace: err.stack,
      message: err.message || "You do not have permission to access this method",
      success: false,
      isOperationalError: true,
      error: err,
    },
    501: {
      code: 12,
      name: "UNIMPLEMENTED",
      stackTrace: err.stack,
      message: err.message || "The requested resource/method has not been implemented",
      success: false,
      isOperationalError: true,
      error: err,
    },
    404: {
      code: 5,
      name: "NOT_FOUND",
      stackTrace: err.stack,
      message: err.message || "Resource not found",
      success: false,
      isOperationalError: true,
      error: err,
    },
    422: {
      code: 3,
      name: "INVALID_ARGUMENT",
      stackTrace: err.stack,
      isOperationalError: true,
      message:
        err.message ||
        "The request was well-formed but was unable to be followed due to semantic errors",
      success: false,
      error: err,
    },
    500: {
      code: 13,
      name: "INTERNAL",
      stackTrace: err.stack,
      message: err.message || "Internal error",
      success: false,
      isOperationalError: false,
      error: err,
    },
    503: {
      code: 14,
      name: "UNAVAILABLE",
      stackTrace: err.stack,
      message: err.message || "Service unavailable",
      success: false,
      isOperationalError: false,
      error: err,
    },
  };

  const errorData = ERRORS[err.status] || ERRORS[500];
  const newError = createGRPCError(errorData.message, errorData.code);
  newError.name = errorData.name;
  newError.stackTrace = errorData.stackTrace;
  newError.success = errorData.success;
  newError.error = errorData.error;
  newError.isOperationalError = errorData.isOperationalError;
  newError.errorType = "GRPC";
  return newError;
};
