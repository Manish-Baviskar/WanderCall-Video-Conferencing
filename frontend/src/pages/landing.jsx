import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/landing.module.css'; // Import the new styles

export default function LandingPage() {
    const router = useNavigate();

    const handleGuestJoin = () => {
        const randomId = Math.random().toString(36).substring(7);
        router("/guestMeet?room=" + randomId);
    };

    return (
        <div className={styles.landingWrapper}>
            
            {/* 1. BACKGROUND WAVES (Replacing the dots images) */}
            <svg className={styles.wave} style={{top: 0, left: 0}} viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMinYMin slice">
                <path d="M-50 250 Q 300 300, 600 650" stroke="#ff9800" strokeWidth="2" strokeDasharray="10 10" opacity="0.5" fill="none" />
                <path d="M-50 100 Q 450 150, 750 500" stroke="#ff9800" strokeWidth="2" strokeDasharray="10 10" opacity="0.2" fill="none" />
            </svg>
            
            {/* Bottom Wave */}
            <svg className={styles.wave} style={{bottom: 0, right: 0, width: '500px', height: '300px'}} viewBox="0 0 500 300" fill="none">
                 <path d="M490 10 C 350 250, 150 50, 10 290" stroke="#ff9800" strokeWidth="2" strokeDasharray="15 15" fill="none"/>
            </svg>

            {/* 2. GLASS NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>
                <div className={styles.navlist}>
                    <p onClick={handleGuestJoin} className={styles.navLink}>Join as Guest</p>
                    <p onClick={() => router("/auth")} className={styles.navLink}>Register</p>
                    <div className={styles.loginBtn} role='button' onClick={() => router("/auth")}>
                        Login
                    </div>
                </div>
            </nav>

            {/* 3. HERO CONTENT */}
            <div className={styles.landingMainContainer}>
                
                {/* Left Side: Text */}
                <div className={styles.textSection}>
                    <h1>
                        Wander <br />
                        <span className={styles.gradientText}>Beyond Borders.</span>
                    </h1>
                    <p>
                        Experience high-quality video calls that make you feel like you’re actually there. Seamless, fast, and free.
                    </p>
                    <Link to="/auth" className={styles.getStartedBtn}>
                        Get Started
                    </Link>
                </div>

                {/* Right Side: Image with GLOW */}
                <div className={styles.imageSection}>
                    <div className={styles.imageGlow}></div> {/* The Orange Blur */}
                    <img src='/mobile.svg' alt="Mobile Video Call" className={styles.heroImage} />
                </div>
            </div>

        </div>
    )
}