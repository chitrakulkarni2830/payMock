const express = require("express");

const router = express.Router();

const {
  createPayment,
  getPayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:paymentId", getPayment);


module.exports = router;