const mongoose = require("mongoose");

const connectDB = async () =>  {
    try{
        await mongoose.connect(process.evn.MONGODB_URI);
        console.log("MongoDB Successfully Connected");
    } catch (error) {
         console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
    }
};

module.exports = connectDB