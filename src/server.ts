import express from "express";
import router from "./routes";

const indexRoute = router;

class Server {
  private readonly PORT: number;
  private hostname?: string;
  private app: express.Application;


  constructor(port: number, hostname: string) {
    this.PORT = port;
    this.hostname = hostname;
    this.app = express(); // Initialisation de l'application Express dans le constructeur
  }

  start() {
    this.app.set("view engine", "ejs");
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.static("public"))
    this.app.use("/", indexRoute);

    this.app.listen(this.PORT, () => {
      console.info(`The Server Is Ready ⚡️⚡️ On\r\n\r\nPORT: http://${this.hostname}:${this.PORT}`);
    });
  }
}

export default Server;