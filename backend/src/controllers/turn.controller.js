import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    const apiKey = process.env.METERED_SECRET_KEY;
    const domain = process.env.METERED_DOMAIN;
    
    const response = await axios.get(
      `https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`
    );
    res.json(response.data); 
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed" });
  }
};