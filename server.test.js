const request = require("supertest");
const app = require("./server");

describe("POST /order", () => {
  test("fail vardo trūkumas", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "",
        address: "Vilnius",
        plan: "Regular"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Name is required"
    });
  });

  test("pass su valid Regular order", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Jonas",
        address: "Vilnius",
        plan: "Regular"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true
    });
  });

  test("fail kai adreso trūksta", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Ona",
        address: "",
        plan: "Vegan"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Address is required"
    });
  });

  test("pass su valid Vegan order", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Ieva",
        address: "Kaunas",
        plan: "Vegan"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true
    });
  });

  test("fail kai plano trūksta", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Mantas",
        address: "Klaipeda",
        plan: ""
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Plan is required"
    });
  });

  test("fail kai maisto planas neteisingas", async () => {
    const response = await request(app)
      .post("/order")
      .send({
        name: "Rasa",
        address: "Siauliai",
        plan: "Keto"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      error: "Invalid meal plan"
    });
  });
});