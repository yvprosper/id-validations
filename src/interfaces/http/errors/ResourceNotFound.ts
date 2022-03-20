import HttpStatus from "http-status-codes";
import BaseError from "interfaces/http/errors/base";

class ResourceNotFoundError extends BaseError {
  constructor(
    message = "You have attempted to access an API endpoint that does not exist.",
    status = HttpStatus.NOT_FOUND,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any = null
  ) {
    super(message, status, data);
    this.name = "ResourceNotFoundError";
  }
}
export default ResourceNotFoundError;
