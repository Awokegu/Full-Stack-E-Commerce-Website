require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// CORS setup 
app.use(cors({
    origin: process.env.FRONTEND_URL,  // This should be set in .env (e.g., http://localhost:3001)
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server after connecting to DB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
