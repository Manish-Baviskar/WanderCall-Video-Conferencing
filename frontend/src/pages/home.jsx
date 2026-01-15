import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import Footer from './footer'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/homeComponent.module.css'; 

// --- Material UI Imports ---
import { IconButton, Avatar, Menu, MenuItem, Tooltip, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';


function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    // --- State for Username ---
    const [username, setUsername] = useState("Guest");

    useEffect(() => {
        // Fetch the name or default to "User"
        const storedName = localStorage.getItem("username") || localStorage.getItem("userId") || "User";
        setUsername(storedName);
    }, []);

    // --- Menu State ---
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear(); 
        navigate("/");
    };

    const handleHistory = () => {
        navigate("/history");
    };

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
        // 1. NO SCROLLING: height: 100vh, overflow: hidden
        <div className={styles.homeWrapper} style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            
            <nav className={styles.homeNav}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>

                <div className={styles.homeNavlist} style={{ display: 'flex', alignItems: 'center' }}>
                    
                    {/* 2. ORANGE PILL CONTAINER (The Account Button) */}
                    <div 
                        onClick={handleMenuClick} // Make the whole pill clickable
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            backgroundColor: '#ff9800', // Yellow/Orange Background
                            padding: '5px 5px 5px 15px', // Padding for the pill shape
                            borderRadius: '50px', // Round edges
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                    >
                        {/* 3. BLACK TEXT (Readable) */}
                        <span style={{ 
                            color: 'black',  // Black text on Orange background
                            fontWeight: 'bold', 
                            fontSize: '1rem' 
                        }}>
                            {username}
                        </span>

                        <Tooltip title="Account Settings">
                            <IconButton
                                size="small"
                                aria-controls={openMenu ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                                sx={{ padding: 0 }} // Remove extra padding inside the pill
                            >
                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'black', color: '#ff9800', fontWeight: 'bold' }}>
                                    {username.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </div>

                    {/* Dropdown Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openMenu}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                bgcolor: '#1a1a1a', 
                                color: 'white',
                                border: '1px solid #333',
                                '& .MuiAvatar-root': {
                                    width: 32, height: 32, ml: -0.5, mr: 1,
                                },
                                '&:before': {
                                    content: '""', display: 'block', position: 'absolute',
                                    top: 0, right: 25, width: 10, height: 10,
                                    bgcolor: '#1a1a1a', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleHistory} sx={{ '&:hover': { bgcolor: '#333' } }}>
                            <HistoryIcon sx={{ marginRight: '10px', color: '#ff9800' }} /> History
                        </MenuItem>
                        
                        <Divider sx={{ bgcolor: '#333' }} />
                        
                        <MenuItem onClick={handleLogout} sx={{ '&:hover': { bgcolor: '#333' } }}>
                            <LogoutIcon sx={{ marginRight: '10px', color: '#ff9800' }} /> Logout
                        </MenuItem>
                    </Menu>
                </div>
            </nav>

            {/* Main Content: flex: 1 takes up all remaining space */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
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

                        <p className={styles.generateLink} onClick={handleGenerateCode}>
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

            {/* Footer stays at the bottom */}
            <Footer />

        </div>
    );
}

export default withAuth(HomeComponent);