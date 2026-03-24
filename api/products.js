import express from "express";
import {
  getOrdersByUserIdAndProductId,
  getProductById,
  getProducts,
} from "#db/queries/products";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

const router = express.Router();

// Build /products routes next
// GET /products
// Just return all products.
router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

// GET /products/:id
// Flow:
// read product id from params
// find product
// if not found -> 404
// send product
router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  res.send(product);
});

// GET /products/:id/orders
// This one is protected.
// Flow:
// require logged-in user
// check whether product exists
// if not -> 404
// do this before sending anything else
// get only the logged-in user's orders that include that product
// send array
// Important
// The assignment explicitly says:
// if product does not exist, send 404 even if the user is logged in
// That means your route should definitely check product existence.
router.get("/:id/orders", getUserFromToken, async (req, res, next) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.status(404).send("Product not found.");

  next();
}, requireUser, async (req, res) => {
  const orders = await getOrdersByUserIdAndProductId(req.user.id, req.params.id);
  res.send(orders);
});

export default router;
