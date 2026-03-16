const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 4. index.html turi meniu lentelę
test("index.html turi meniu lentelę", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("<table");
});

// 5. index.html turi Regular pasirinkimą
test("index.html turi Regular plano pasirinkimą", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("Regular");
});

// 6. index.html turi Vegan pasirinkimą
test("index.html turi Vegan plano pasirinkimą", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("Vegan");
});

// 7. index.html turi visas 7 dienas
test("index.html turi visas 7 dienas meniu duomenyse", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.forEach(day => {
    expect(html).toContain(day);
  });
});

// 8. styles.css turi lentelės stilius
test("styles.css turi table stilius", () => {
  const css = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
  expect(css).toContain("table");
});

// 9. index.html turi updateMenu funkciją
test("index.html turi updateMenu() funkciją", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("updateMenu");
});

// 10. index.html turi goToCheckout funkciją
test("index.html turi goToCheckout() funkciją", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("goToCheckout");
});

// 11. index.html turi checkout.html nuorodą
test("index.html nukreipia į checkout.html", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).toContain("checkout.html");
});

// 12. index.html neturi inline <style> bloko
test("index.html neturi inline <style> bloko", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  expect(html).not.toMatch(/<style[\s>]/i);
});