import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/landing.module.css";

export default function LandingPage() {
  const router = useNavigate();

  const handleGuestJoin = () => {
    const randomId = Math.random().toString(36).substring(7);
    router("/guestMeet?room=" + randomId);
  };

  return (
    <div className={styles.landingWrapper}>
      {/* 1. BACKGROUND WAVES (Same as Home) */}
      <svg
        className={styles.landingWave}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          height: "200px",
        }}
        viewBox="0 0 1440 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 150 C 400 50, 900 250, 1440 100"
          stroke="#ff9800"
          strokeWidth="2"
          strokeDasharray="15 15"
          opacity="0.4"
          fill="none"
        />
        <path
          d="M0 200 C 450 100, 950 300, 1440 150"
          stroke="#ff9800"
          strokeWidth="2"
          strokeDasharray="10 10"
          opacity="0.2"
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
            src="/mobile.svg"
            alt="Mobile Video Call"
            className={styles.heroImage}
          />
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className={styles.footer}>
        <p>&copy; 2026 WanderCall. All rights reserved.</p>
        <p style={{ marginTop: "5px" }}>
          Made with{" "}
          <span style={{ color: "#ff9800", fontSize: "1.2rem" }}>♥</span> by{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            Manish Baviskar
          </span>
        </p>
      </div>
    </div>
  );
}
