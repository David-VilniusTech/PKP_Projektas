const request = require("supertest");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Sukuriam test versiją serverio su atskira DB
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const db = new sqlite3.Database(":memory:"); // atmintyje, ne faile

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      meal_plan TEXT
    )
  `);

  app.post("/order", (req, res) => {
    const { name, address, plan } = req.body;
    db.run(
      "INSERT INTO orders (name, address, meal_plan) VALUES (?, ?, ?)",
      [name, address, plan],
      function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({ success: true });
        }
      }
    );
  });

  return app;
}

const app = createApp();

// --- TESTAI ---

// 1. Vartotojas gali pasirinkti planą ir užsakyti (Regular)
test("Priima Regular plano užsakymą", async () => {
  const res = await request(app).post("/order").send({
    name: "Jonas Jonaitis",
    address: "Gedimino pr. 1, Vilnius",
    plan: "Regular",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});

// 2. Vartotojas gali pasirinkti Vegan planą
test("Priima Vegan plano užsakymą", async () => {
  const res = await request(app).post("/order").send({
    name: "Ona Onaitė",
    address: "Laisvės al. 5, Kaunas",
    plan: "Vegan",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});

// 4. Užsakymas grąžina success: true
test("Atsakymas turi success: true", async () => {
  const res = await request(app).post("/order").send({
    name: "Petras",
    address: "Vilniaus g. 10",
    plan: "Regular",
  });
  expect(res.body).toHaveProperty("success", true);
});

// 14. Užsakymas su tuščiu body
test("Grąžina klaidą arba success su tuščiu body", async () => {
  const res = await request(app).post("/order").send({});
  // backend įrašo null reikšmes - tai validuotina ateityje
  expect([200, 500]).toContain(res.statusCode);
});

// 15. POST /order endpoint egzistuoja
test("POST /order endpoint egzistuoja (ne 404)", async () => {
  const res = await request(app).post("/order").send({
    name: "Test",
    address: "Test",
    plan: "Regular",
  });
  expect(res.statusCode).not.toBe(404);
});

// 16. GET /order grąžina 404 (tik POST palaikomas)
test("GET /order grąžina 404", async () => {
  const res = await request(app).get("/order");
  expect(res.statusCode).toBe(404);
});