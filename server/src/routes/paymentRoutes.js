const express = require("express");

const router = express.Router();

const {
  createPayment,
  getPayment,
  processPayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:paymentId", getPayment);
router.post("/:paymentId/process", processPayment);

module.exports = router;