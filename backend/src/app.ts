import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { initRoutes } from "./routes/v1/Routes";
import mongoose from "mongoose";
import { config } from "./config/config";

class App {
  public express: Express;

  constructor() {
    this.express = express();

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeRoute();
  }

  private initializeDatabaseConnection(): void {
    mongoose.connect(config.mongo.url).then(() => {
      console.log("connected to db!");
      this.listen();
    });
  }

  private initializeMiddleware(): void {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(express.urlencoded({ extended: false }));

    this.express.use((req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );

      if (req.method == "OPTIONS") {
        res.header(
          "Access-Control-Allow-Methods",
          "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
      }

      next();
    });
  }

  private initializeRoute(): void {
    initRoutes(this.express);
  }

  public listen(): void {
    const port = process.env.PORT || 8080;
    this.express.listen(port, () => {
      console.log(`Application listening at http://localhost:${port}`);
    });
  }
}

export default App;
