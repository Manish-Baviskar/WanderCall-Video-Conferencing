// backend/src/controllers/turn.controller.js
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    const apiKey = (process.env.METERED_SECRET_KEY || "").trim();
    const domain = (process.env.METERED_DOMAIN || "").trim();

    // Debug to confirm the clean key
    console.log(`Using Key: ${apiKey.substring(0, 5)}... (Length: ${apiKey.length})`);

    const response = await axios.get(
      `https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    
    res.json(response.data); 
  } catch (error) {
    console.error("FULL ERROR FROM METERED:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};