import { Thread } from "threads";

import { Response } from "node-fetch";
export interface ApiCreds {
  key: KeySet;
  keys: KeySet[];
  url: string;
  urls: string[];
  proxy: string;
  proxies: string[];
  port?: number;
  batchUrls?: boolean;
  cb?: typeof ResponseCallback;
}

export interface ServiceInterface {
  data: ApiCreds;
  init(data: ApiCreds): void;
  generateRandomPortNumber(): number;
  spawnServiceWorker(ModuleQueueNameSleeve): Promise<ThreadPackage>;
}

export type KeySet = {
  client_email: string;
  private_key: string;
};

export type ModuleQueueNameSleeve = `./modules/${string}`;

export type ArbitraryThreadType = any;

export type ThreadPackage = {
  module: ArbitraryThreadType;
  Thread: typeof Thread;
  data: ApiCreds;
};

declare function ResponseCallback(response: Response): Promise<void>;
