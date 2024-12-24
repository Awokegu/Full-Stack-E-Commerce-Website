const mongoose = require("mongoose");

async function connectDB() {  
    try { 
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });    
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    } 
}

module.exports = connectDB;
