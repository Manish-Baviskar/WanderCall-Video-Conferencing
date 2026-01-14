import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/homeComponent.module.css'; 

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if(meetingCode.trim().length > 0) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    }

    
    const handleGenerateCode = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setMeetingCode(result); 
    };

    return (
        <div className={styles.homeWrapper}>
            
            <nav className={styles.homeNav}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>

                <div className={styles.homeNavlist}>
                    <p onClick={() => navigate("/history")}>History</p>
                    <button 
                        className={styles.logoutBtn}
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className={styles.homeMainContainer}>
                
                <div className={styles.textSection}>
                    <h1>Ready to <br /> <span className={styles.accentText}>Connect?</span></h1>
                    
                    <p>
                        Enter a code to join an existing meeting, or generate a new one to start your own.
                    </p>

                    <div className={styles.inputGroup}>
                        <input 
                            className={styles.codeInput}
                            value={meetingCode}
                            onChange={e => setMeetingCode(e.target.value)}
                            placeholder="e.g. q5x-99p" 
                        />
                        <button className={styles.joinBtn} onClick={handleJoinVideoCall}>
                            Join Room
                        </button>
                    </div>

                    
                    <p 
                        className={styles.generateLink} 
                        onClick={handleGenerateCode}
                    >
                        Don't have a code? <span>Generate Random Code</span>
                    </p>

                </div>

                <div className={styles.imageSection}>
                    <img src="/home_hero.svg" alt="Video Call Illustration" />
                </div>

            </div>

            <svg className={`${styles.pattern} ${styles.patternTop}`} width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 100 C 100 10, 200 190, 390 100" stroke="#ffa500" strokeWidth="2" strokeDasharray="10 10" fill="none"/>
            </svg>

            <svg className={`${styles.pattern} ${styles.patternBottom}`} width="500" height="300" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M10 10 C 150 250, 350 50, 490 290" stroke="#ffa500" strokeWidth="2" strokeDasharray="10 10" fill="none"/>
            </svg>

        </div>
    )
}

export default withAuth(HomeComponent);