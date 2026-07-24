const { nanoid } = require("nanoid");
const Payment = require("../models/Payment");

/**
 * POST /api/payments
 *
 * Creates a new payment record initialized with status "Pending".
 * Generates a unique paymentId using nanoid.
 */
const createPayment = async (req, res) => {
  try {
    const { merchantName, customerName, amount, paymentMethod } = req.body;

    const payment = await Payment.create({
      paymentId: nanoid(10),
      merchantName,
      customerName,
      amount,
      paymentMethod,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/payments/:paymentId
 *
 * Read-only endpoint — returns payment details without modifying state.
 */
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/payments/:paymentId/process
 *
 * Simulates payment processing for UPI or Card.
 * Validates request payload and prevents duplicate processing if status is
 * already "Success" or "Failed". Updates payment status internally.
 */
const processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const {
      paymentMethod,
      upiId,
      cardNumber,
      cardHolderName,
      expiry,
      cvv,
    } = req.body;

    // Validate payment method
    if (!["UPI", "Card"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    if (paymentMethod === "UPI" && !upiId) {
      return res.status(400).json({
        success: false,
        message: "UPI ID is required",
      });
    }

    if (paymentMethod === "Card" && (!cardNumber || !cardHolderName || !expiry || !cvv)) {
      return res.status(400).json({
        success: false,
        message: "All card details are required",
      });
    }

    // Check existing payment status before processing
    const existing = await Payment.findOne({ paymentId });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (existing.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Payment is already ${existing.status}`,
      });
    }

    // Update status Pending -> Success
    const payment = await Payment.findOneAndUpdate(
      { paymentId, status: "Pending" },
      { status: "Success", paymentMethod },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getPayment,
  processPayment,
};