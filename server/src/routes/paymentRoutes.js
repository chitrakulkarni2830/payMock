const express = require("express");

const router = express.Router();

const {
  createPayment,
  getPayment,
  updatePaymentStatus
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:paymentId", getPayment);
router.patch("/:paymentId", updatePaymentStatus);

module.exports = router;