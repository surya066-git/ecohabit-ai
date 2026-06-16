import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app";

describe("health route", () => {
  it("returns service status", async () => {
    const response = await request(createApp()).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
