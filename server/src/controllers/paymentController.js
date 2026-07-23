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

module.exports = {
    createPayment,
};