import RunRabbitRun from "./message-queue/spinup.js";

(async () => {
  await RunRabbitRun("IndexingApi");
  await RunRabbitRun("MobileFriendly");
})();
