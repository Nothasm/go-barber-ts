import { createConnection, Connection, getConnectionOptions } from "typeorm";
import { randomBytes } from "crypto";
import { App } from "../src/app";

export const app = (new App()).server;

const databaseName = `test_${randomBytes(4).toString("hex")}`;
let mainConnection: Connection;
let connection: Connection;

beforeAll(async () => {
    const connectionOptions = await getConnectionOptions();

    mainConnection = await createConnection({
        ...connectionOptions,
        name: "master"
    });

    await mainConnection.query(`CREATE DATABASE ${databaseName};`)

    connection = await createConnection({
        ...connectionOptions,
        database: databaseName as any,
        migrationsRun: true,
        logging: false
    });
}, 6000);

afterAll(async () => {
    if (connection) {
        console.log("HERE");
        await connection.close();
    }

    if (mainConnection) {
        await mainConnection.query(`DROP DATABASE ${databaseName};`);
        await mainConnection.close();
    }
});