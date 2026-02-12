const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Routes
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const submissionRoutes = require("./routes/submission"); // ✅ ADD THIS
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/admin");



const app = express();

/* =====================================================
   MIDDLEWARE
===================================================== */
app.use(
  cors({
    origin: [
      "https://vcc-q6n56t6se-jevins-projects-f112865d.vercel.app", // Latest Vercel deployment
      "https://vcc-tawny.vercel.app", // Vercel alias (production)
      "https://vcc-qqldtqy1p-jevins-projects-f112865d.vercel.app", // Vercel production
      "https://vcc-gqwhazcv4-jevins-projects-f112865d.vercel.app", // Vercel old deployment
      "https://vibeathonvcc.netlify.app", // Old Netlify URL
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://2496-2405-201-e07a-d82a-2d08-ed78-a067-1cf6.ngrok-free.app" // New ngrok URL
    ]
    ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
const path = require("path");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json());
app.disable("x-powered-by");

// Bypass ngrok browser warning
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  res.setHeader('User-Agent', 'CustomClient');
  next();
});

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://vibeathonvcc-backend.onrender.com https://vibeathonvcc.netlify.app;; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  );

  next();
});


/* =====================================================
   ROUTES
===================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/submission", submissionRoutes); // ✅ ADD THIS
app.use("/api/admin", adminAuthRoutes); // ✅ ADD
app.use("/api/admin", adminRoutes);
app.use("/api/admin", require("./routes/evaluatePrompts")); // ✅ AI Evaluation




/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/", (req, res) => {
  res.send("Vibeathon Backend is LIVE 🚀");
});

/* =====================================================
   DATABASE CONNECTION
===================================================== */
// Initialize Firebase (imported in firebaseConfig.js)
const { admin } = require("./firebaseConfig");

console.log("Firebase Admin SDK initialized ✅");


/* =====================================================
   SERVER START
===================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
