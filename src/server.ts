import express from "express";
import bodyParser from "body-parser";
import { initDbConnection } from "./models/db";
import route from "./routes/";

const app: express.Application = express();

export async function initServer() {
  // middleware
  app.use(bodyParser.json());

  await initDbConnection();
  addRoutes();
  app.listen(3000, () => {
    console.log("Server started at port");
  });
}

function addRoutes() {
  app.use("/api/", route);
  app.get("/health", (_, res) => {
    res.send(200);
  });
}

export default app;
