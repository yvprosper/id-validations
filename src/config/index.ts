/* eslint-disable import/first */
import dotEnvExtended from "dotenv-extended";
import fs from "fs";
import path from "path";

// load environmental variable
dotEnvExtended.load({
  encoding: "utf8",
  silent: false,
  path: ".env",
  defaults: ".defaults.env",
  schema: ".schema.env",
  errorOnMissing: true,
  errorOnExtra: false,
  errorOnRegex: false,
  includeProcessEnv: false,
  assignToProcessEnv: true,
  overrideProcessEnv: false,
});
import convict from "convict";
import { ConfigSchema } from "types/custom";

const _require = require;
let configCombine: convict.Schema<ConfigSchema> = {
  app: null,
  database: null,
  elasticsearch: null,
  fluentd: null,
  rabbitmq: null,
  redis: null,
};
const getConfig = (file: string) => {
  return _require(path.join(__dirname, file));
};

fs.readdirSync(__dirname)
  .filter((file) => {
    const ext = process.env.NODE_ENV === "test" ? ".ts" : ".js";
    return file.indexOf(".") !== 0 && file !== path.basename(__filename) && file.slice(-3) === ext;
  })
  .forEach((file) => {
    const conf = getConfig(file);
    configCombine = Object.assign(configCombine, conf) as convict.Schema<ConfigSchema>;
    // console.log(configCombine, 989);
  });

const config: convict.Config<ConfigSchema> = convict(configCombine);
// Perform validation
config.validate({ allowed: "strict" });

export default config;
