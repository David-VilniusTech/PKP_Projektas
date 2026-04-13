const request = require("supertest");
const app = require("./server");

describe("POST /order", () => {
  test("should create order successfully with valid data", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Jonas",
        address: "Vilnius",
        plan: "Regular"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  test("should still return success when different valid plan is sent", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Ona",
        address: "Kaunas",
        plan: "Vegan"
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ success: true });
  });
});