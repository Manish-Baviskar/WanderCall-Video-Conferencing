import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    // 🛡️ SECURITY FIX: .trim() removes invisible spaces from the start/end
    const apiKey = (process.env.METERED_SECRET_KEY || "").trim();
    const domain = (process.env.METERED_DOMAIN || "").trim();

    // 🕵️ DEBUG LOG: See EXACTLY what is being sent (check your Render logs after deploy)
    console.log(`Fetching credentials...`);
    console.log(`Domain: '${domain}'`); 
    console.log(`Key: '${apiKey.substring(0, 5)}...' (Length: ${apiKey.length})`);

    const response = await axios.get(
      `https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    
    res.json(response.data); 
  } catch (error) {
    console.error("TURN Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};