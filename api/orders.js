import express from "express";
import {
  getOrdersByUserIdAndProductId,
  getProductById,
  getProducts,
} from "#db/queries/products";
import getUserFromToken from "#middleware/getUserFromToken";
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
  getUserFromToken,
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

router.get("/", getUserFromToken, requireUser, async (req, res) => {
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

router.get("/:id", getUserFromToken, requireUser, async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).send("Order not found.");

  if (order.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  res.send(order);
});
