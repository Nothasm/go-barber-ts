import "reflect-metadata";

import { Application } from "express";
import { Container } from "typedi";
import { createConnection, useContainer as ormUseContainer } from "typeorm";
import { createExpressServer, useContainer } from "routing-controllers";
import { Connection} from "typeorm";

import { UserController } from "./controllers/User";
import { SessionController } from "./controllers/Session";

import * as morgan from "morgan";
import { FileController } from "./controllers/Upload";

export class App {

    public port = process.env.PORT;
    public server: Application;
    public connection: Connection;

    constructor() {
        this.inject();
        this.createCon()
        this.server = createExpressServer({
            defaultErrorHandler: false,
            middlewares: [__dirname + "/middlewares/global/*{.js,.ts}"],
            cors: true,
            controllers: this.controllers()
        });

        this.server.use(morgan("combined"));
    }

    private createCon() {
        createConnection().then(async connection => {
            console.log("Connected to DB");
            this.connection = connection;
        }).catch(error => {
            console.log("TypeORM connection error: ", error)
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
            FileController
        ];
    }

    public listen() {
        this.createCon();
        return this.server.listen(this.port, () => console.log(`Server listening on port: ${this.port}`));
    }

}
