// backend/src/controllers/turn.controller.js
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    const response = await axios.get(
      `https://${process.env.METERED_DOMAIN}/api/v1/turn/credentials?apiKey=${process.env.METERED_SECRET_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching TURN credentials:", error);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};