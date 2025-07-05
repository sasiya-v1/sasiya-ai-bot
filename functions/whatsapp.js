const axios  = require("axios");
const twilio = require("twilio");

exports.handler = async (event) => {
  const params = new URLSearchParams(event.body);
  const incomingMsg = params.get("Body") || "";
  const from        = params.get("From");

  // Call OpenAI Chat Completion
  const oa = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: incomingMsg }]
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
    }
  );

  const reply = oa.data.choices[0].message.content.trim();

  // Send WhatsApp message back
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: `🤖 *Sasiya AI ChatGPT*:\n${reply}`,
    from: "whatsapp:+12512908599", // Twilio sandbox number
    to:   from
  });

  return {
    statusCode: 200,
    body: "OK"
  };
};
