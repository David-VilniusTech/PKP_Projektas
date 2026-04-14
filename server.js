const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const db = new sqlite3.Database("orders.db");

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

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Name is required"
    });
  }



  const allowedPlans = ["Regular", "Vegan"];
  if (!allowedPlans.includes(plan)) {
    return res.status(400).json({
      success: false,
      error: "Invalid meal plan"
    });
  }

  db.run(
    "INSERT INTO orders (name, address, meal_plan) VALUES (?, ?, ?)",
    [name, address, plan],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Database error"
        });
      }

      return res.status(200).json({
        success: true
      });
    }
  );
});

if (require.main === module) {
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
}

module.exports = app;