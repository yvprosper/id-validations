/* eslint-disable no-await-in-loop */
import { queueTopology } from "infra/libs/queueTopology";
import { EXCHANGE_NAME, channelWrapper } from "infra/libs/rabbitmqSetup";

export interface PublishData {
  worker: string;
  message: {
    action: string;
    type: string;
    data: unknown;
  };
}

const publishToRabitmq = (data: Array<PublishData>) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataToPublish: Array<PublishData> = data;

      if (!Array.isArray(data)) {
        dataToPublish = (data as unknown) as Array<PublishData>;
      }

      if (dataToPublish.length > 0) {
        for (let i = 0; i < dataToPublish.length; i += 1) {
          const { message, worker } = dataToPublish[i];
          const { routingKey } = queueTopology(worker);
          console.log({ message, routingKey });
          await channelWrapper.publish(EXCHANGE_NAME, routingKey, message, {
            deliveryMode: 2,
            mandatory: true,
          });
        }
      } else {
        reject(new Error("Nothing to publish. Please provide job description"));
      }
      resolve({ done: true });
    } catch (error) {
      reject(error);
    }
  });
};

export default publishToRabitmq;
