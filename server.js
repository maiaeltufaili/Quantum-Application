const express = require("express");
const session = require("express-session");
const path = require("path");
const nunjucks = require("nunjucks");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const circuitRoutes = require("./routes/circuitRoutes");

const app = express();
const port = process.env.PORT || 3000;

// --- SESSION ---
app.use(session({
    name: "quantum-session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- NUNJUCKS ---
nunjucks.configure("views", { autoescape: true, express: app, noCache: true });

// --- ROUTES ---
app.use("/", authRoutes);
app.use("/", circuitRoutes);

// --- CONNECT & START SERVER ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    })
    .catch(err => console.error("Mongoose connection error:", err));
