import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query("DELETE FROM orders_products");
  await db.query("DELETE FROM orders");
  await db.query("DELETE FROM products");
  await db.query("DELETE FROM users");

  const productsToCreate = [
    ["Apples", "Fresh red apples", 1.99],
    ["Bananas", "Sweet yellow bananas", 0.99],
    ["Bread", "Whole grain sandwich bread", 3.49],
    ["Milk", "One gallon of milk", 4.29],
    ["Eggs", "Dozen large eggs", 3.99],
    ["Cheese", "Cheddar cheese block", 5.49],
    ["Rice", "Long grain white rice", 6.99],
    ["Pasta", "Italian spaghetti pasta", 2.49],
    ["Tomato Sauce", "Classic tomato pasta sauce", 3.29],
    ["Coffee", "Ground medium roast coffee", 8.99],
  ];

  const createdProducts = [];
  for (const [title, description, price] of productsToCreate) {
    const {
      rows: [product],
    } = await db.query(
      `
        INSERT INTO products (title, description, price)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [title, description, price],
    );
    createdProducts.push(product);
  }

  const hashedPassword = await bcrypt.hash("password123", 10);
  const {
    rows: [user],
  } = await db.query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *
    `,
    ["demo_user", hashedPassword],
  );

  const {
    rows: [order],
  } = await db.query(
    `
      INSERT INTO orders (date, note, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    ["2026-03-20", "Seed order", user.id],
  );

  for (const [index, product] of createdProducts.slice(0, 5).entries()) {
    await db.query(
      `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
      `,
      [order.id, product.id, index + 1],
    );
  }
}
