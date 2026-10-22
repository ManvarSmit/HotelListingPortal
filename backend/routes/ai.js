const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsycn.js");
const aiController = require("../controllers/ai.js");

// POST /api/ai/chat  — AI Travel Chatbot
router.post("/chat", wrapAsync(aiController.chat));

// GET /api/ai/review-summary/:listingId  — AI Review Sentiment Summary
router.get("/review-summary/:listingId", wrapAsync(aiController.reviewSummary));

module.exports = router;
