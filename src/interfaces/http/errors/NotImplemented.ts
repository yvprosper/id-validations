import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class NotImplementedError extends BaseError {
  constructor(
    message = "The requested resource/method has not been implemented",
    status = HttpStatus.NOT_IMPLEMENTED,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "NotImplementedError";
  }
}

export default NotImplementedError;
