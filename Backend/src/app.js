const express = require('express');
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const cookieParser = require('cookie-parser')
const cors = require("cors")


const app = express();

const allowedOrigins = ["http://localhost:5173"];

if (process.env.FRONTEND_URL) {
    let origin = process.env.FRONTEND_URL.trim();
    // If it doesn't start with http:// or https://, prepend https://
    if (!/^https?:\/\//.test(origin)) {
        origin = `https://${origin}`;
    }
    // Remove any trailing slash
    origin = origin.replace(/\/$/, "");
    allowedOrigins.push(origin);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Log for debugging on Render
            console.warn(`[CORS Blocked] Origin: ${origin}. Allowed: ${allowedOrigins.join(", ")}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// Request debugging logger
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url} - Headers:`, { origin: req.headers.origin }, `- Body:`, req.body);
    next();
});

// Root health-check endpoint
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Auvora Backend API is running successfully." });
});

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)



module.exports = app;

