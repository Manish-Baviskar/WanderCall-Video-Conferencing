// backend/src/controllers/turn.controller.js
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    // ⚠️ HARDCODING FOR TESTING ONLY ⚠️
    // Paste the values DIRECTLY from the Metered "Developers" tab.
    // Do NOT use process.env here.
    
    const HARDCODED_DOMAIN = "wandercall.metered.live"; 
    const HARDCODED_KEY = "vJvjlIgGhFOv0IR4r5TQjljdbiWdb6xrZqF4jbqz__iccO2v"; // <--- PASTE YOUR FULL KEY HERE INSIDE THE QUOTES

    console.log("Testing with Hardcoded Credentials...");

    const response = await axios.get(
      `https://${HARDCODED_DOMAIN}/api/v1/turn/credentials?apiKey=${HARDCODED_KEY}`
    );
    
    console.log("SUCCESS! Got credentials from Metered.");
    res.json(response.data); 
  } catch (error) {
    console.error("HARDCODE TEST FAILED:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
};