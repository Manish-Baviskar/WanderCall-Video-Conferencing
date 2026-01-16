import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      {/* Stop propagation so clicking content doesn't close modal */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: "#ff9800", fontSize: "1.8rem" }}>
            About WanderCall
          </h2>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* RESPONSIVE CONTENT CONTAINER (Flex Wrap) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
          
          {/* LEFT COLUMN: Brand Info */}
          <div style={{ flex: "1 1 300px" }}>
            <p style={{ color: "#ccc", lineHeight: "1.6", marginBottom: "20px" }}>
              Connecting people, anywhere, anytime. Fast, secure, and simple
              video calling for everyone. WanderCall breaks the barriers of
              distance with high-quality, seamless connectivity.
            </p>
            <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "30px" }}>
              &copy; {new Date().getFullYear()} WanderCall. <br /> Made with{" "}
              <span style={{ color: "#ff9800" }}>♥</span> by Manish Baviskar.
            </p>
          </div>

          {/* RIGHT COLUMN: Links & Socials */}
          <div style={{ flex: "1 1 300px" }}>
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              Connect With Us
            </h3>
            
            {/* SOCIAL ICONS (SX Styling to prevent Blue Links) */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
              {[
                { icon: <GitHubIcon sx={iconSx} />, link: "https://github.com/Manish-Baviskar" },
                { icon: <LinkedInIcon sx={iconSx} />, link: "https://www.linkedin.com/in/manishbaviskar/" },
                { icon: <TwitterIcon sx={iconSx} />, link: "https://x.com/_manish_23" },
                { icon: <InstagramIcon sx={iconSx} />, link: "https://www.instagram.com/manishbaviskar1/" }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }} // Force inherit color
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <h3 style={{ color: "white", marginBottom: "10px" }}>
              Quick Links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/auth" style={linkStyle}>Login / Register</a>
              
              <a 
                href="https://github.com/Manish-Baviskar/WanderCall-Video-Conferencing" 
                target="_blank" 
                rel="noreferrer" 
                style={linkStyle}
              >
                Project Source Code
              </a>
              
              <a 
                href="https://github.com/Manish-Baviskar/WanderCall-Video-Conferencing/blob/main/LICENSE" 
                target="_blank" 
                rel="noreferrer" 
                style={linkStyle}
              >
                Privacy Policy (MIT License)
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- STYLES ---

// 1. Icon Hover Effect (Shared)
const iconSx = {
  fontSize: "2.5rem",
  color: "#aaa",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#ff9800",
    transform: "translateY(-3px)",
    filter: "drop-shadow(0 0 8px rgba(255, 152, 0, 0.6))",
  },
};

// 2. Overlay with padding for mobile edges
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px", // Prevents modal from touching screen edges
};

// 3. Responsive Modal Box
const modalStyle = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #ff9800",
  borderRadius: "20px",
  padding: "40px",
  width: "100%",
  maxWidth: "800px", // Slightly wider for comfort
  maxHeight: "90vh", // Prevents it from being taller than screen
  overflowY: "auto", // Enables scrolling INSIDE modal on small phones
  boxShadow: "0 0 40px rgba(255, 152, 0, 0.2)",
  position: "relative",
  color: "white",
  fontFamily: '"Poppins", sans-serif',
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  borderBottom: "1px solid #333",
  paddingBottom: "15px",
};

// 4. Force Link Color
const linkStyle = {
  color: "#ff9800", // Forced Orange
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "0.2s",
  display: "inline-block",
  cursor: "pointer",
};