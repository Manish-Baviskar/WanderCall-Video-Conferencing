// backend/src/controllers/turn.controller.js
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    const apiKey = process.env.METERED_SECRET_KEY || "";
    const domain = process.env.METERED_DOMAIN || "";

    // 🕵️ DEBUG LOGS (Check your Render Logs for these lines!)
    console.log("--- DEBUG START ---");
    console.log(`Domain being used: '${domain}'`); 
    console.log(`Key length: ${apiKey.length}`); // If length is 0, key is missing.
    console.log(`Key starts with: ${apiKey.substring(0, 4)}...`); // Verify it matches the website
    console.log(`Key ends with space?: ${apiKey.endsWith(" ") ? "YES (BAD!)" : "NO (Good)"}`);
    console.log("--- DEBUG END ---");

    const response = await axios.get(
      `https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    
    res.json(response.data); 
  } catch (error) {
    console.error("FULL ERROR FROM METERED:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};