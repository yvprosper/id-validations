import ResourceNotFoundError from "interfaces/http/errors/ResourceNotFound";

export default (req, res, next) => {
  next(
    new ResourceNotFoundError(
      `You have tried to access an API endpoint (${req.url}) with a '${req.method}' method that does not exist.`
    )
  );
};
