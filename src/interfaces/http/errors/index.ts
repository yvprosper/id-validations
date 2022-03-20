import fs from "fs";
import path from "path";

const _require = require;

const getErrors = (file: string) => {
  return _require(path.join(__dirname, file)).default;
};
const APIErrors = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file !== "base.js" &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const error = getErrors(file);
    APIErrors[error.name] = error;
  });
export default APIErrors;
