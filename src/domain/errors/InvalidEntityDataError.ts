import BaseError from "interfaces/http/errors/base";

interface Details {
  message: string;
}

class InvalidEntityDataError extends Error {
  code: string;

  details: Array<Details>;

  constructor(errors: BaseError[]) {
    super("Provide a valid entity data");
    this.name = "InvalidEntityDataError";
    this.code = "INVALID_ENTITY_DATA_ERROR";
    this.details = errors.map((error: BaseError) => {
      return { message: error.message };
    });
  }
}

export default InvalidEntityDataError;
