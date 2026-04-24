const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Database is connected");
    } catch (err) {
        console.error("FULL ERROR:", err);
        process.exit(1);
    }
};

module.exports = connectDB;