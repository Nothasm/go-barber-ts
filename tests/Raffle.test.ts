import * as request from "supertest";
import { app } from "./helpers";

test("should create a media successfully", async () => {
    const { body, status } = await request(app)
        .get("/raffle");
    console.log(body);
    expect(status).toBe(201);
});