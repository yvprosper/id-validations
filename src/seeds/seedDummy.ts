/* eslint-disable no-await-in-loop */
import config from "config/";
import Logger from "infra/logging/Logger";
import MongoDbManager from "infra/database/MongoDbManager";
import Chance from "chance";
import { Dummy } from "infra/database/models/mongoose/Dummy";

const logger = new Logger({ config });
const mongoDbManager = new MongoDbManager({ config, logger });
const chance = new Chance();

const seedDummies = async () => {
  await mongoDbManager.connect();
  for (let index = 1; index <= 2; index += 1) {
    await Dummy.create({
      subject: chance.sentence({ words: 5 }),
      note: chance.sentence({ words: 15 }),
    });
  }
  // close script
  process.exit(0);
};

seedDummies();
