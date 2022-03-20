import config from "config/";

export const queueTopology = (worker: string) => {
  const queuePrefix = config.get("rabbitmq.prefixKeyName") as string;
  const exchange = `${queuePrefix}.exchange`;
  let topology: { queue: string; exchange: string; routingKey: string };
  switch (worker) {
    case "test":
      topology = {
        queue: `${queuePrefix}.queue`,
        exchange,
        routingKey: `${queuePrefix}.route`,
      };
      break;

    default:
      throw new Error("Invalid queue: Something bad happened!");
  }

  return topology;
};

export const RETRY_EXCHANGE_NAME = "retry.exchange";
