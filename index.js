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
  const token = "EAAVFZAdxHALkBRS9X3ZCijYQM8vq2oNRYk0q9opm6mbCoLiSDkZAVq3ZCgC0MLToXTkPkCCZAxeEvowLfAU1UykKx33Upxu3i7ZCNjBDhrSmZBVR9WMD3DUSaYqaTp967XWJSDi2kp1SFJxio3h2KLZAnaqrPF9IQ9feyaDfZCBufXFqz0u2YwkoYm9ZCOXe30MOjpUCDrlGNGN6ZB2ZBd42FwJn1ji3gfwCSzP72XeZCvjfAeE8ZCkGjHe7MJxUTQk5XkX5ZBkAYipZBotB8EdBB4oc75Ya2x5kfAZDZD"; // Meta से लो
  const phoneNumberId = "1122015147663326"; // Meta से लो

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
