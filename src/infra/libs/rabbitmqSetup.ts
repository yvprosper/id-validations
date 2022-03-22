import amqp from "amqp-connection-manager";
import { ConfirmChannel, Options } from "amqplib";
import config from "config/";

const logger = {
  info: console.info,
  error: console.error,
};
const isTls = config.get("rabbitmq.isTls") as string;
const queuePrefix = config.get("rabbitmq.prefixKeyName") as string;
const connectionOptions: Options.Connect = {
  protocol: isTls ? "amqps" : "amqp",
  hostname: config.get("rabbitmq.host") as string,
  port: config.get("rabbitmq.port") as number,
  username: config.get("rabbitmq.username") as string,
  password: config.get("rabbitmq.password") as string,
  locale: "en_US",
  frameMax: 0,
  heartbeat: 0,
  vhost: config.get("rabbitmq.vhost") as string,
};
// Create a connetion manager
logger.info("Connecting to RabbitMq...");
const connection = amqp.connect(connectionOptions as (string | Options.Connect)[]);
connection.on("connect", () => logger.info("RabbitMq is connected!"));
connection.on("disconnect", () => logger.info("RabbitMq disconnected. Retrying..."));

export const EXCHANGE_NAME = `${queuePrefix}.exchange`;
export const QUEUE = `${queuePrefix}.queue`;
export const ROUTING_KEY = `${queuePrefix}.route`;
// Create a channel wrapper
export const channelWrapper = connection.createChannel({
  json: true,
  setup(channel: ConfirmChannel) {
    // `channel` here is a regular amqplib `ConfirmChannel`.
    // assert and bind all your queues here
    return Promise.all([
      channel.assertExchange(EXCHANGE_NAME, "topic", {
        durable: true,
      }),
      channel.assertQueue(QUEUE, { durable: true }),
      channel.bindQueue(QUEUE, EXCHANGE_NAME, ROUTING_KEY),
    ]);
  },
});
channelWrapper.on("connect", () => {
  logger.info("RabbitMq channel has connected");
});

channelWrapper.on("close", () => {
  logger.info("RabbitMq channel has closed");
});
