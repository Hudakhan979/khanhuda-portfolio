const path = require("path");
const dotenv = require("dotenv");

// Load .env file
const result = dotenv.config({
  path: path.join(__dirname, ".env"),
});

if (result.error) {
  console.error("❌ Error loading .env file:", result.error);
} else {
  console.log("✅ .env file loaded successfully");
}

console.log("📌 Current Directory:", __dirname);
console.log("📌 MONGODB_URI:", process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const experienceRoutes = require("./routes/experience");
const testimonialRoutes = require("./routes/testimonials");
const certificateRoutes = require("./routes/certificates");
const achievementRoutes = require("./routes/achievements");
const contactRoutes = require("./routes/contact");
const analyticsRoutes = require("./routes/analytics");
const githubRoutes = require("./routes/github");

// Connect to MongoDB
connectDB();

const app = express();

// Security
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/github-stats", githubRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});