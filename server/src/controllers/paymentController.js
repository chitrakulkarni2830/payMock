const { nanoid } = require("nanoid");
const Payment = require("../models/Payment");

const createPayment = async (req,res) => {
    try{
    const { merchantName, customerName, amount, paymentMethod } = req.body;

    const payment = await Payment.create ({
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
        res.status(500).json ({
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


module.exports = {
  createPayment,
  getPayment,
  updatePaymentStatus
};