import "reflect-metadata";

import { Application, static as staticFiles } from "express";
import { Container } from "typedi";
import { createConnection, useContainer as ormUseContainer } from "typeorm";
import { createExpressServer, useContainer } from "routing-controllers";
import { Connection} from "typeorm";

import { UserController } from "./controllers/User";
import { SessionController } from "./controllers/Session";

import * as morgan from "morgan";
import { FileController } from "./controllers/Upload";
import { ProviderController } from "./controllers/Provider";
import * as path from "path";
import { AppointmentController } from "./controllers/Appointment";
import { ScheduleController } from "./controllers/Schedule";

import * as mongoose from "mongoose";
import { NotificationController } from "./controllers/Notification";

export class App {

    public port = process.env.PORT;
    public server: Application;
    public connection: Connection;

    constructor() {
        this.inject();
        this.createPostgresConnection();
        this.createMongoConnection();
        this.server = createExpressServer({
            defaultErrorHandler: false,
            middlewares: [__dirname + "/middlewares/global/*{.js,.ts}"],
            cors: true,
            controllers: this.controllers()
        });

        this.server.use("/files", staticFiles(path.resolve(__dirname, "..", "tmp", "uploads")));
        this.server.use(morgan("combined"));
    }

    private createPostgresConnection() {
        createConnection().then(async connection => {
            console.log("Connected to Postgres");
            this.connection = connection;
        }).catch(error => {
            console.log("TypeORM connection error: ", error)
        });
    }

    private createMongoConnection() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        })
        .then(_ => console.log("Connected to MongoDB"))
        .catch(error => {
            console.log("Mongoose connection error: ", error)
        });
    }

    private inject() {
        useContainer(Container);
        ormUseContainer(Container);
    }

    private controllers() {
        return [
            UserController,
            SessionController,
            FileController,
            ProviderController,
            AppointmentController,
            ScheduleController,
            NotificationController
        ];
    }

    public listen() {
        return this.server.listen(this.port, () => console.log(`Server listening on port: ${this.port}`));
    }

}
