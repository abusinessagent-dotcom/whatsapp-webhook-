const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 VERIFY TOKEN (Meta में यही डालना)
const VERIFY_TOKEN = "aiarthub@241";

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("Webhook running ✅");
});

// 🔥 Webhook VERIFY
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 📩 AUTO REPLY FUNCTION
async function sendMessage(to) {
  const token = "YOUR_ACCESS_TOKEN"; // Meta से लो
  const phoneNumberId = "YOUR_PHONE_NUMBER_ID"; // Meta से लो

  await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: "Hi 👋 Thanks for contacting AI Art Hub!"
      }
    })
  });
}

// 📥 DATA RECEIVE + AUTO REPLY
app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("DATA RECEIVED:", JSON.stringify(body, null, 2));

  try {
    if (body.entry) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;

      await sendMessage(from);
    }
  } catch (err) {
    console.log("Error:", err.message);
  }

  res.sendStatus(200);
});

// 🚀 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
