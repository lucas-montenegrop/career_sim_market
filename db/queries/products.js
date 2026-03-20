import db from "#db/client";

export async function getProducts() {
  const { rows } = await db.query(`
    SELECT *
    FROM products
    ORDER BY id
  `);

  return rows;
}

export async function getProductById(id) {
  const sql = `
    SELECT *
    FROM products
    WHERE id = $1
  `;
  const {
    rows: [product],
  } = await db.query(sql, [id]);
  return product;
}

export async function getOrdersByUserIdAndProductId(userId, productId) {
  const sql = `
    SELECT orders.*
    FROM orders
    JOIN orders_products
      ON orders.id = orders_products.order_id
    WHERE orders.user_id = $1
      AND orders_products.product_id = $2
    ORDER BY orders.id
  `;
  const { rows: orders } = await db.query(sql, [userId, productId]);
  return orders;
}
