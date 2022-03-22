import HttpStatus from "http-status-codes";
import express from "express";

const BasicResponse = {
  success: false,
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: "",
  data: null,
  links: null,
  name: null,
};

class ResponseManager {
  static get HTTP_STATUS() {
    return HttpStatus;
  }

  static getResponseHandler(res: express.Response) {
    return {
      onSuccess: (data: unknown, message: string, code: number) => {
        ResponseManager.respondWithSuccess(res, code, data, message);
      },
      onError: (errorName: string, errorCode: number, errorMessage: string, data: unknown) => {
        ResponseManager.respondWithError(res, errorName, errorCode, errorMessage, data);
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static generateHATEOASLink(link: string, method: any, rel: any) {
    return {
      link,
      method,
      rel,
    };
  }

  static respondWithSuccess(
    res: express.Response,
    code = ResponseManager.HTTP_STATUS.OK,
    data = {},
    message = "success",
    links = []
  ) {
    const response = { ...BasicResponse };
    response.success = true;
    response.message = message;
    response.data = data;
    response.links = links;
    response.statusCode = code;

    res.status(code).json(response);
  }

  static respondWithError(
    res: express.Response,
    errorName: string,
    errorCode = ResponseManager.HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = "Unknown error",
    data = {}
  ) {
    const response = { ...BasicResponse };
    response.success = false;
    response.name = errorName;
    response.message = message;
    response.statusCode = errorCode;
    response.data = data;
    response.data = data;
    res.errorMessage = response.message;
    res.status(errorCode).json(response);
  }
}
export default ResponseManager;
