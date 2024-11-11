import Server from "./server";
import cluster from "node:cluster";
import os from "node:os";
import { SequelizeConnection } from "./database";

const PORT: number = 8080;
const HOST: string = "127.0.0.1";
const numCPU: number = os.cpus().length;

const server = new Server(PORT, HOST);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with exit code ${code} and signal ${signal}`);
  });
} else {
  server.start();
  (async () => {
    await SequelizeConnection.connect()
  })()

  console.log(`Worker ${process.pid} started`);
}