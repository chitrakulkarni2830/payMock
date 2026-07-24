const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "PayMock API is running", 
    });
});

app.use("/api/payments", paymentRoutes);

module.exports = app;