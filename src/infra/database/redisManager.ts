import { createClient } from "redis";

const redisManager = async ({ config, logger }) => {
  logger.info("Connecting to Redis database...");
  const password = config.get("redis.password");
  const isTls = config.get("redis.isTLS");
  const host = config.get("redis.host");
  const port = config.get("redis.port");
  const username = config.get("redis.username");
  // const prefix = config.get("redis.prefixKeyName");
  // const protocol = isTls ? "rediss://" : "redis://";

  const redisClient = createClient({
    socket: {
      tls: isTls,
      host,
      port,
      username,
      password,
    },
  });

  // redisClient.debug_mode(true);

  redisClient.on("connect", () => {
    logger.info("Connected to Redis");
  });

  redisClient.on("ready", () => {
    logger.info("Redis is ready");
  });
  redisClient.on("reconnecting", () => {
    logger.info("Redis is reconnecting...");
  });
  redisClient.on("error", (error) => {
    logger.error(error);
  });

  await redisClient.connect();

  return redisClient;
};

// Releveant documentations - https://github.com/NodeRedis/node-redis
export default redisManager;
