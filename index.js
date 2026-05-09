const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔑 YOUR DETAILS
const VERIFY_TOKEN = "aiarthub@241";   // Meta webhook verify token
const ACCESS_TOKEN = "EAAVFZAdxHALkBRS9X3ZCijYQM8vq2oNRYk0q9opm6mbCoLiSDkZAVq3ZCgC0MLToXTkPkCCZAxeEvowLfAU1UykKx33Upxu3i7ZCNjBDhrSmZBVR9WMD3DUSaYqaTp967XWJSDi2kp1SFJxio3h2KLZAnaqrPF9IQ9feyaDfZCBufXFqz0u2YwkoYm9ZCOXe30MOjpUCDrlGNGN6ZB2ZBd42FwJn1ji3gfwCSzP72XeZCvjfAeE8ZCkGjHe7MJxUTQk5XkX5ZBkAYipZBotB8EdBB4oc75Ya2x5kfAZDZD";   // Meta access token
const PHONE_NUMBER_ID = "1122015147663326";

// ✅ GET (Webhook Verification)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 📥 POST (Messages + Flow)
app.post("/webhook", async (req, res) => {
  const body = req.body;

  console.log("DATA RECEIVED:", JSON.stringify(body, null, 2));

  try {
    // 🟢 1. FLOW FORM SUBMIT
    if (body.screen) {
      console.log("FLOW SUBMITTED DATA:", body);

      return res.json({
        screen: "SUCCESS",
        data: {}
      });
    }

    // 🟢 2. WHATSAPP MESSAGE
    if (body.entry) {
      const msg = body.entry[0].changes[0].value.messages?.[0];

      if (msg) {
        const from = msg.from;

        await sendMessage(from);
      }
    }

  } catch (err) {
    console.log("ERROR:", err.message);
  }

  res.sendStatus(200);
});

// 📤 AUTO REPLY FUNCTION
async function sendMessage(to) {
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
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

// 🚀 SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
