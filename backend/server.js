// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// temporary in-memory data store
let sensorData = [];

// POST route - receive sensor readings
app.post("/data", (req, res) => {
  const { ghat, pH, turbidity, lighting } = req.body;
  const entry = { ghat, pH, turbidity, lighting, time: new Date() };
  sensorData.push(entry);
  console.log("Data received:", entry);
  res.status(200).json({ message: "Data stored successfully" });
});

// GET route - fetch latest data
app.get("/data", (req, res) => {
  res.json(sensorData.slice(-10)); // last 10 entries
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
