import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import Footer from './footer.jsx'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/homeComponent.module.css'; 
import { IconButton, Avatar, Menu, MenuItem, Button, Tooltip, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';


function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
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
        // 1. WRAPPER: Added inline flex styles to force footer to bottom
        // We keep 'styles.homeWrapper' to maintain your background color/image
        <div className={styles.homeWrapper} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* 2. NAVBAR */}
            <nav className={styles.homeNav}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>

                <div className={styles.homeNavlist} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Replaced old text buttons with this Avatar Menu */}
                    
                    <span style={{ color: '#ccc', fontSize: '0.9rem', marginRight: '5px' }}>
                        My Account
                    </span>

                    <Tooltip title="Account Settings">
                        <IconButton
                            onClick={handleMenuClick}
                            size="small"
                            aria-controls={openMenu ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#ff9800', color: 'black' }}>
                                <PersonIcon />
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    {/* The Dropdown Menu */}
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
                                bgcolor: '#1a1a1a', // Dark Background
                                color: 'white',
                                border: '1px solid #333',
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: '#1a1a1a',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
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

            {/* 3. MAIN CONTENT */}
            {/* Wrapped in a div with flex: 1 so it pushes the footer down */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                
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

                {/* Patterns - Kept exactly as they were */}
                <svg className={`${styles.pattern} ${styles.patternTop}`} width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 100 C 100 10, 200 190, 390 100" stroke="#ffa500" strokeWidth="2" strokeDasharray="10 10" fill="none"/>
                </svg>

                <svg className={`${styles.pattern} ${styles.patternBottom}`} width="500" height="300" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10 C 150 250, 350 50, 490 290" stroke="#ffa500" strokeWidth="2" strokeDasharray="10 10" fill="none"/>
                </svg>
                
            </div>

            {/* 4. FOOTER COMPONENT */}
            <Footer />

        </div>
    );

}

export default withAuth(HomeComponent);