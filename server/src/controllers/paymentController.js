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
 * Helper: Validate card expiry format (MM/YY), month range (01-12), and non-expired date.
 */
const isValidExpiry = (expiry) => {
  if (!expiry || typeof expiry !== "string") return false;
  const match = expiry.trim().match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(`20${match[2]}`, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed (1-12)

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

/**
 * Helper: Validate card number (13-19 digits).
 */
const isValidCardNumber = (cardNumber) => {
  const digits = (cardNumber || "").replace(/\s/g, "");
  return /^\d{13,19}$/.test(digits);
};

/**
 * Helper: Validate CVV (3-4 digits).
 */
const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv || "");
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

    if (paymentMethod === "Card") {
      if (!cardNumber || !cardHolderName || !expiry || !cvv) {
        return res.status(400).json({
          success: false,
          message: "All card details are required",
        });
      }

      if (!isValidExpiry(expiry)) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired card expiry date. Format must be MM/YY with a valid month (01-12).",
        });
      }

      if (!isValidCardNumber(cardNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid card number",
        });
      }

      if (!isValidCVV(cvv)) {
        return res.status(400).json({
          success: false,
          message: "Invalid CVV code",
        });
      }
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