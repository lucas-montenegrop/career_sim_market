import express from "express";
import {
  addProductToOrder,
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getProductsByOrderId,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

const router = express.Router();


// 9. Build /orders routes next
// These are the biggest part.
// POST /orders 🔒
// Flow:
// require logged-in user
// require date
// create a new order tied to req.user.id
// send created order with 201

router.post(
  "/",
  requireUser,
  requireBody(["date"]),
  async (req, res) => {
    const { date, note } = req.body;
    const order = await createOrder(date, note, req.user.id);
    res.status(201).send(order);
  },
);

// GET /orders 🔒
// Flow:
// require logged-in user
// get all orders for that user
// send array

router.get("/", requireUser, async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});


// GET /orders/:id 🔒
// Flow:
// require logged-in user
// get order by id
// if not found → 404
// if order’s user_id does not match logged-in user → 403
// otherwise send order

router.get("/:id", requireUser, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  res.send(order);
});

router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");

    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const product = await getProductById(req.body.productId);
    if (!product) return res.status(400).send("Product not found.");

    const orderProduct = await addProductToOrder(
      order.id,
      req.body.productId,
      req.body.quantity,
    );
    res.status(201).send(orderProduct);
  },
);

router.get("/:id/products", requireUser, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  const products = await getProductsByOrderId(order.id);
  res.send(products);
});

export default router;
