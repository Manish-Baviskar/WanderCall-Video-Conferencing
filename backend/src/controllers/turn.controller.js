// backend/src/controllers/turn.controller.js
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    // 1. PRINT ALL AVAILABLE VARIABLE NAMES (Safe: Doesn't print values)
    console.log("--- ENVIRONMENT CHECK ---");
    console.log("Available Keys:", Object.keys(process.env)); 
    
    // 2. Check the specific key again
    const apiKey = (process.env.METERED_SECRET_KEY || "").trim();
    console.log(`Searching for 'METERED_SECRET_KEY'... Found? ${apiKey ? "YES" : "NO"}`);
    console.log("-------------------------");

    if (!apiKey) throw new Error("API Key is MISSING in process.env");

    const domain = (process.env.METERED_DOMAIN || "").trim();
    const response = await axios.get(
      `https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    
    res.json(response.data); 
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};