const { nanoid } = require("nanoid");
const Payment = require("../models/Payment");

const createPayment = async (req, res) => {
  try {
    const { merchantName, customerName, amount, paymentMethod } = req.body;

    const payment = await Payment.create({
      paymentId: nanoid(10),
      merchantName,
      customerName,
      amount,
      paymentMethod,
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

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { paymentId },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Payment is already ${payment.status}`,
      });
    }

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
    if (paymentMethod === "Card" &&
  (!cardNumber || !cardHolderName || !expiry || !cvv)
) {
  return res.status(400).json({
    success: false,
    message: "All card details are required",
  });
}
  payment.status = "Success";
await payment.save();

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
  updatePaymentStatus,
  processPayment,
};