import db from "#db/client";

export async function createOrder(date, note, userId) {
  const sql = `
    INSERT INTO orders
      (date, note, user_id)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [order],
  } = await db.query(sql, [date, note, userId]);
  return order;
}

export async function getOrdersByUserId(userId) {
  const sql = `
    SELECT *
    FROM orders
    WHERE user_id = $1
  `;
  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrderById(id) {
  const sql = `
    SELECT *
    FROM orders
    WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}

export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
    INSERT INTO orders_products
      (order_id, product_id, quantity)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [orderProduct],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orderProduct;
}

export async function getProductsByOrderId(orderId) {
  const sql = `
    SELECT products.*
    FROM orders_products
    JOIN products
      ON orders_products.product_id = products.id
    WHERE orders_products.order_id = $1
  `;
  const { rows: products } = await db.query(sql, [orderId]);
  return products;
}
