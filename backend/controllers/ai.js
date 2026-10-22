const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Listing, Review } = require("../models");

// Use v1 API — required for gemini-3.x models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

// Confirmed working models (tested against the live API)
const MODEL_CHAIN = [
  "gemini-3.5-flash-lite", // lightest & fastest
  "gemini-3.5-flash",
  "gemini-3.6-flash",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry with model fallback
async function callWithRetry(fn) {
  const MAX_RETRIES = 2;
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    const m = genAI.getGenerativeModel({ model: modelName });
    console.log(`[AI] Trying model: ${modelName}`);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await fn(m);
        console.log(`[AI] Success with: ${modelName}`);
        return result;
      } catch (err) {
        lastError = err;
        const msg = err.message || "";
        const is503 = msg.includes("503") || msg.includes("Service Unavailable") || msg.includes("high demand");
        const is404 = msg.includes("404") || msg.includes("not found") || msg.includes("no longer available");
        const isBadKey = msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || msg.includes("[401]");

        console.warn(`[AI] ${modelName} attempt ${attempt} failed (${msg.substring(0, 60)})`);

        if (isBadKey) throw new Error("INVALID_API_KEY");

        if (is404) { break; } // skip to next model

        if (is503) {
          if (attempt < MAX_RETRIES) {
            await sleep(attempt * 1500);
            continue;
          } else {
            break; // try next model
          }
        }

        break; // unknown error — try next model
      }
    }
  }

  throw lastError || new Error("All AI models unavailable");
}

// ─── Feature 1: AI Travel Chatbot ────────────────────────────────────────────
module.exports.chat = async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    return res.status(503).json({ error: "AI service not configured. Please set GEMINI_API_KEY in .env" });
  }

  try {
    const listings = await Listing.findAll({
      attributes: ["id", "title", "location", "country", "price", "category"],
      limit: 100,
    });

    const listingContext = listings
      .map((l) => `- ${l.title} | ${l.location}, ${l.country} | Rs.${l.price}/night | ${l.category}`)
      .join("\n");

    const systemPrompt = `You are a friendly AI travel assistant for "Wanderlust", a hotel booking platform.

Available hotel listings:
${listingContext}

Guidelines:
- Be warm and helpful. Recommend hotels from the list above when relevant.
- Keep replies concise (2-4 sentences). Use emojis occasionally.
- Always respond in English.`;

    const chatHistory = (history || []).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const reply = await callWithRetry((m) => {
      const chat = m.startChat({
        history: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Got it! I'm your Wanderlust travel assistant. How can I help you today?" }] },
          ...chatHistory,
        ],
        generationConfig: { maxOutputTokens: 400, temperature: 0.8 },
      });
      return chat.sendMessage(message).then((r) => r.response.text());
    });

    res.json({ reply });
  } catch (err) {
    console.error("[AI] Chat final error:", err.message);
    if (err.message === "INVALID_API_KEY") {
      return res.status(401).json({ error: "Invalid Gemini API key. Please check your .env file." });
    }
    return res.status(503).json({ error: "AI is busy right now. Please try again in a few seconds! 🙏" });
  }
};

// ─── Feature 4: AI Review Sentiment Summary ──────────────────────────────────
module.exports.reviewSummary = async (req, res) => {
  const { listingId } = req.params;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    return res.json({ summary: null, totalReviews: 0, avgRating: 0 });
  }

  try {
    const reviews = await Review.findAll({
      where: { listingId },
      attributes: ["rating", "comment"],
    });

    if (!reviews || reviews.length === 0) {
      return res.json({ summary: null, totalReviews: 0, avgRating: 0 });
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const reviewText = reviews.map((r) => `[${r.rating}/5]: ${r.comment}`).join("\n");

    const prompt = `Summarize these hotel reviews in 1-2 sentences (max 30 words). Start with positives, then mention concerns if any. Do not start with "Guests".

Reviews:
${reviewText}`;

    const summary = await callWithRetry((m) =>
      m.generateContent(prompt).then((r) => r.response.text().trim())
    );

    res.json({ summary, totalReviews: reviews.length, avgRating: parseFloat(avgRating.toFixed(1)) });
  } catch (err) {
    console.error("[AI] Review summary error:", err.message);
    res.json({ summary: null, totalReviews: 0, avgRating: 0 });
  }
};
