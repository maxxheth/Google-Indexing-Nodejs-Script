import { AMQPClient } from "@cloudamqp/amqp-client";
import logger from "../utilities/logger.js";

import ServiceFactory from "../factories/service-factory.js";

import { Response } from "node-fetch";

const rabbitRelayCb =
  (queueName = "") =>
  async (response: Response) => {
    try {
      const cbAmqp = new AMQPClient("amqp://localhost");
      const connection = await cbAmqp.connect();
      const channel = await connection.channel();
      const queue = await channel.queue(queueName + "Response");
      const json = String(await response.json());
      queue.publish(json);
      logger.log({ level: "info", message: "A response was sent." });
      await connection.close();
    } catch (error) {
      logger.error({ error });
    }
  };

export default async function RunRabbitRun(queueName = "") {
  try {
    const amqp = new AMQPClient("amqp://localhost");
    const connection = await amqp.connect();
    const channel = await connection.channel();
    const queue = await channel.queue(queueName);

    logger.log({
      level: "info",
      message: "The RabbitMQ queue has been initialized.",
    });

    const consumer = await queue.subscribe({ noAck: true }, async (message) => {
      const queueMessage = message.bodyToString();
      if (!queueMessage) return;
      const queueData = JSON.parse(queueMessage);
      const service = ServiceFactory();
      service.init(queueData);
      const serviceWorkerProps = await service.spawnServiceWorker(
        `./modules/${queueName}`
      );

      const { module, Thread, data } = serviceWorkerProps;

      data.cb = rabbitRelayCb(queueName);

      module[queueName]({
        data,
      });

      await Thread.terminate(module);

      await consumer.cancel();
    });

    console.log("The Clever Indexer microservice has been initialized!");
    await consumer.wait();
    await connection.close();
    logger.log({ level: "info", message: "The connection was closed." });
  } catch (error) {
    logger.log({ level: "error", message: `There was an error: ${error}` });
  }
}
