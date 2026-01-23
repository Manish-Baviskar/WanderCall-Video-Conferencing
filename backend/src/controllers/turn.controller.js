import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

export const getTurnCredentials = async (req, res) => {
  try {
    // Return OpenRelay's free static servers
    const credentials = [
      {
        urls: [
          "stun:openrelay.metered.ca:80",
          "turn:openrelay.metered.ca:80?transport=udp",
          "turn:openrelay.metered.ca:80?transport=tcp",
          "turn:openrelay.metered.ca:443?transport=tcp",
        ],
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ];

    res.json(credentials);
  } catch (error) {
    console.error("Error fetching ICE servers:", error);
    // Fallback to Google's public STUN if everything fails
    res.json([{ urls: "stun:stun.l.google.com:19302" }]);
  }
};