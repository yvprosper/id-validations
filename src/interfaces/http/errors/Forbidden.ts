import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class ForbiddenError extends BaseError {
  constructor(
    message = "You do not have permission to access this API endpoint.",
    status = HttpStatus.FORBIDDEN,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) {
    super(message, status, data);
    this.name = "ForbiddenError";
  }
}

export default ForbiddenError;
