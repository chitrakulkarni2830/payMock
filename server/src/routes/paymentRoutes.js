const express = require("express");

const router = express.Router();

const {
  createPayment,
  getPayment,
  updatePaymentStatus,
  processPayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:paymentId", getPayment);
router.patch("/:paymentId", updatePaymentStatus);
router.patch("/:paymentId/pay", processPayment);


module.exports = router;