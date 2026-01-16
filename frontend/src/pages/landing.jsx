import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/landing.module.css";
import AboutModal from "./AboutModal";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; 
import { IconButton, Tooltip } from '@mui/material';

export default function LandingPage() {
  const router = useNavigate();

  const [isAboutOpen, setAboutOpen] = useState(false);

  const handleGuestJoin = () => {
    const randomId = Math.random().toString(36).substring(7);
    router("/guestMeet?room=" + randomId);
  };

  return (
    <div className={styles.landingWrapper}>
      {/* 1. BACKGROUND WAVES (Same as Home) */}
      {/* --- NEW: LEFT WAVE (Behind Text Only) --- */}
      {/* Notice: width is only 50% so it stops in the middle */}
      <svg
        className={styles.landingWave}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60vw",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        viewBox="0 0 600 800"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* A smooth, solid curve that cups the text area */}
        <path
          d="M -100 100 C 100 300, 400 0, 600 200"
          stroke="#ff9800"
          strokeWidth="3"
          opacity="0.15" /* Very subtle */
          fill="none"
        />
        {/* A secondary faint line for depth */}
        <path
          d="M -100 250 C 150 450, 350 200, 500 400"
          stroke="#ff9800"
          strokeWidth="2"
          opacity="0.08"
          fill="none"
        />
      </svg>

      {/* --- NEW: RIGHT WAVE (Behind Image Only) --- */}
      {/* Notice: positioned bottom-right, distinct from the left one */}
      <svg
        className={styles.landingWave}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "50vw",
          height: "60vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
        viewBox="0 0 600 500"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* A curve that wraps under the laptop image */}
        <path
          d="M 100 500 C 300 200, 500 400, 700 100"
          stroke="#ff9800"
          strokeWidth="3"
          opacity="0.15"
          fill="none"
        />
      </svg>

      {/* 2. NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navHeader}>
          <h2>WanderCall</h2>
        </div>
        <div className={styles.navlist}>
          <p onClick={handleGuestJoin} className={styles.navLink}>
            Join as Guest
          </p>
          <p onClick={() => router("/auth")} className={styles.navLink}>
            Register
          </p>
          <div
            className={styles.loginBtn}
            role="button"
            onClick={() => router("/auth")}
          >
            Login
          </div>
        </div>
      </nav>

      {/* 3. HERO CONTENT (No Box, Just Big & Bold) */}
      <div className={styles.landingMainContainer}>
        {/* Left Side: Text */}
        <div className={styles.textSection}>
          <h1>
            Wander <br />
            <span className={styles.gradientText}>Beyond Borders.</span>
          </h1>
          <p>
            Experience high-quality video calls that make you feel like you’re
            actually there. Seamless, fast, and free.
          </p>
          <Link to="/auth" className={styles.getStartedBtn}>
            Get Started
          </Link>
        </div>

        {/* Right Side: Image */}
        <div className={styles.imageSection}>
          <img
            src="https://res.cloudinary.com/dz7fdvk48/image/upload/v1768548357/Group_video-amico_1_qnomat.png"
            alt="Mobile Video Call"
            className={styles.heroImage}
            loading="eager"
            fetchpriority="high"
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '30px', left: '40px', zIndex: 100 }}>
                <Tooltip title="About WanderCall" arrow placement="right">
                    <IconButton 
                        onClick={() => setAboutOpen(true)}
                        sx={{ 
                            color: 'rgba(255,255,255,0.5)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: '0.3s',
                            '&:hover': { color: '#ff9800', borderColor: '#ff9800', transform: 'scale(1.1)' }
                        }}
                    >
                        <HelpOutlineIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '15px',
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.4)', // Subtle grey
                fontSize: '0.8rem',
                zIndex: 100,
                pointerEvents: 'none' // Lets clicks pass through if needed
            }}>
                <p>
                    &copy; 2026 WanderCall. Made with <span style={{ color: '#ff9800' }}>♥</span> by <span style={{ color: '#fff', fontWeight: '500' }}>Manish Baviskar</span>
                </p>
            </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setAboutOpen(false)} />

    </div>
  );
}
