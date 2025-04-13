const express = require("express");

const app = express();
const databse = require("./config/schema.prisma");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connect
databse.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);





app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

