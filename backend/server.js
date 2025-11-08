import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Temporary memory storage
let sensorData = [];
let feedbacks = [];

// ============= SENSOR DATA ROUTES =============

// IoT or simulator sends data here
app.post("/data", (req, res) => {
  const data = req.body;
  data.time = new Date();
  sensorData.push(data);
  if (sensorData.length > 50) sensorData.shift();
  res.json({ message: "Data stored" });
});

// Frontend fetches this
app.get("/data", (req, res) => {
  res.json(sensorData);
});

// ============= FEEDBACK + IMAGE UPLOAD =============

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST feedback
app.post("/feedback", upload.single("image"), (req, res) => {
  const { name, message } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const fb = {
    id: Date.now(),
    name,
    message,
    image,
    time: new Date(),
  };

  feedbacks.push(fb);
  console.log("📩 Feedback:", fb);
  res.json({ message: "Feedback received", feedback: fb });
});

// GET all feedbacks
app.get("/feedback", (req, res) => {
  res.json(feedbacks);
});

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
