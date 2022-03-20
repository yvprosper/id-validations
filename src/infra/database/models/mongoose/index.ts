import fs from "fs";
import path from "path";

const _require = require;

const getModel = (file: string) => {
  return _require(path.join(__dirname, file)).default;
};
const models = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    const ext = process.env.NODE_ENV === "test" ? ".ts" : ".js";
    return file.indexOf(".") !== 0 && file !== path.basename(__filename) && file.slice(-3) === ext;
  })
  .forEach((file) => {
    const model = getModel(file);
    models[model.modelName] = model;
  });

export default models;
