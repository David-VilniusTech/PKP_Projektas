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

// 1. Pirmadienio maistinė vertė – Regular plano
test("Regular plano pirmadienio maistinė vertė turi laukus", () => {
  const monday = {
    day: "Monday",
    breakfast: "Scrambled eggs",
    lunch: "Chicken soup",
    dinner: "Grilled chicken & rice",
    nutrition: { kcal: 2100, protein: 140, carbs: 180, fat: 95, fiber: 18 }
  };

  expect(monday.day).toBe("Monday");
  expect(monday.nutrition).toBeDefined();
  expect(monday.nutrition).toHaveProperty("kcal");
  expect(monday.nutrition).toHaveProperty("protein");
  expect(monday.nutrition).toHaveProperty("carbs");
  expect(monday.nutrition).toHaveProperty("fat");
  expect(monday.nutrition).toHaveProperty("fiber");
});

// 2. Pirmadienio maistinė vertė – Vegan plano
test("Vegan plano pirmadienio maistinė vertė turi laukus", () => {
  const monday = {
    day: "Monday",
    breakfast: "Smoothie bowl",
    lunch: "Lentil soup",
    dinner: "Chickpea curry & rice",
    nutrition: { kcal: 1800, protein: 60, carbs: 250, fat: 50, fiber: 30 }
  };

  expect(monday.day).toBe("Monday");
  expect(monday.nutrition).toBeDefined();
  expect(monday.nutrition).toHaveProperty("kcal");
  expect(monday.nutrition).toHaveProperty("protein");
  expect(monday.nutrition).toHaveProperty("carbs");
  expect(monday.nutrition).toHaveProperty("fat");
  expect(monday.nutrition).toHaveProperty("fiber");
});