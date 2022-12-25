import { spawn, Thread, Worker } from "threads";

import type {
  ServiceInterface,
  ModuleQueueNameSleeve,
  ApiCreds,
  ThreadPackage,
} from "../typedefs";

// import {
//   ApiCreds,
//   ModuleQueueNameSleeve,
//   ResponseCallback,
//   ServiceInterface,
//   ThreadPackage,

export default function ServiceFactory() {
  const Service: ServiceInterface = {
    data: {
      url: "",
      urls: [""],
      proxy: "",
      proxies: [""],
      key: { client_email: "value", private_key: "value" },
      keys: [{ client_email: "value", private_key: "value" }],
      port: 0,
      batchUrls: false,
    },
    init({
      url = "",
      urls = [""],
      proxy = "",
      proxies = [""],
      key = { client_email: "value", private_key: "value" },
      keys = [{ client_email: "value", private_key: "value" }],
      port = 0,
      batchUrls = false,
    }: ApiCreds) {
      this.data = Object.assign(this.data, {
        url,
        urls,
        proxy,
        proxies,
        key,
        keys,
        port,
        batchUrls,
        async cb(response: Response) {
          return Promise.resolve();
        },
      });
    },
    generateRandomPortNumber(lowerPortLimit = 1024, upperPortLimit = 10000) {
      let randomPortNumber = upperPortLimit * Math.random();

      while (randomPortNumber < lowerPortLimit) {
        randomPortNumber *= 10;
      }

      if (randomPortNumber > upperPortLimit) {
        const diff = randomPortNumber - upperPortLimit;
        randomPortNumber -= diff;
      }

      return randomPortNumber;
    },
    async spawnServiceWorker(modulePath: ModuleQueueNameSleeve) {
      const module = await spawn(new Worker(modulePath));
      const ThreadData: ThreadPackage = {
        module,
        Thread,
        data: this.data,
      };
      return ThreadData;
    },
  };

  return Service;
}
