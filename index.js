const express = require("express");
const app = express();

app.use(express.json());

// 🔐 VERIFY TOKEN (same as Meta)
const VERIFY_TOKEN = "aiarthub@241";

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("Webhook running ✅");
});

// 🔥 Webhook verification (MOST IMPORTANT)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("VERIFY REQUEST:", req.query);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    return res.status(200).send(challenge);
  } else {
    console.log("Verification failed ❌");
    return res.sendStatus(403);
  }
});

// 📩 Data receive
app.post("/webhook", (req, res) => {
  console.log("DATA RECEIVED:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 🚀 Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
