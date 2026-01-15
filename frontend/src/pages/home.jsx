import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/homeComponent.module.css';

import { IconButton, Avatar, Menu, MenuItem, Tooltip, Divider, Button, TextField } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import AddBoxIcon from '@mui/icons-material/AddBox';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);
    const [username, setUsername] = useState("User");

    // --- USERNAME FIX LOGIC ---
    useEffect(() => {
        // Try all possible keys where name might be stored
        const storedName = localStorage.getItem("username") || localStorage.getItem("name") || localStorage.getItem("userId");
        
        if (storedName && storedName !== "undefined" && storedName !== "null") {
            setUsername(storedName);
        } else {
            // DEBUG: If it says User, check Console to see what is actually in storage
            console.log("Local Storage Dump:", localStorage);
        }
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleHistory = () => navigate("/history");

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim().length > 0) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    }

    const handleCreateNewMeeting = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        addToUserHistory(result);
        navigate(`/${result}`);
    };

    return (
        <div className={styles.homeWrapper}>
            
            {/* NAVBAR */}
            <nav className={styles.homeNav}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>

                <div className={styles.homeNavlist}>
                    <div className={styles.accountPill} onClick={handleMenuClick}>
                        <span className={styles.userName}>{username}</span>
                        <Tooltip title="Account Settings">
                            <IconButton size="small" sx={{ padding: 0 }}>
                                <Avatar sx={{ width: 38, height: 38, bgcolor: '#ff9800', color: 'black', fontWeight: 'bold' }}>
                                    {username.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </div>

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
                                bgcolor: '#1a1a1a', color: 'white', border: '1px solid #333',
                                '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
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

            {/* MAIN CARD */}
            <div className={styles.mainContentContainer}>
                <div className={styles.card}>
                    <div className={styles.cardActions}>
                        <h1>Hello, <span className={styles.accentText}>{username}!</span></h1>
                        <p>Enter a code to join a meeting or start a new one.</p>

                        <div className={styles.joinSection}>
                            <TextField
                                fullWidth
                                placeholder="Enter Code (e.g. q5x-99p)"
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                InputProps={{
                                    style: { color: 'white' } // Forces text to be white
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white', 
                                        bgcolor: '#1a1a1a',  // Much lighter grey so it's visible
                                        borderRadius: '12px',
                                        '& fieldset': { 
                                            borderColor: '#666', // Visible Grey Border
                                            borderWidth: '1px'
                                        },
                                        '&:hover fieldset': { 
                                            borderColor: '#999'  // Lighter on hover
                                        },
                                        '&.Mui-focused fieldset': { 
                                            borderColor: '#ff9800', // Orange when typing
                                            borderWidth: '2px'
                                        },
                                    },
                                    '& .MuiInputBase-input::placeholder': {
                                        color: '#aaa', // Make placeholder visible
                                        opacity: 1,
                                    },
                                }}
                            />
                            <Button variant="contained" onClick={handleJoinVideoCall} sx={{
                                    bgcolor: '#ff9800',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    padding: '0 30px',
                                    height: '55px',
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        bgcolor: '#e68a00',
                                        boxShadow: '0 0 15px rgba(255, 152, 0, 0.4)'
                                    }
                                }}>
                                Join
                            </Button>
                        </div>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleCreateNewMeeting}
                            startIcon={<AddBoxIcon />}
                            sx={{
                                color: '#ff9800',
                                borderColor: '#ff9800',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                                padding: '15px',
                                borderWidth: '2px', // Thicker border
                                '&:hover': {
                                    borderColor: '#ff9800',
                                    bgcolor: 'rgba(255, 152, 0, 0.1)'
                                }
                            }}
                        >
                            Create New Meeting
                        </Button>
                    </div>

                    <div className={styles.cardImageSection}>
                         <img src="/homepage.svg" alt="WanderCall Logo" />
                    </div>
                </div>
            </div>

            {/* BACKGROUND PATTERNS (Restored!) */}
           <svg className={`${styles.pattern} ${styles.patternCorner}`} viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMinYMin slice">
                {/* Darker Inner Wave */}
                <path d="M-50 250 Q 300 300, 600 650" stroke="#ff9800" strokeWidth="2" strokeDasharray="10 10" opacity="0.7" fill="none" />
                {/* Faded Outer Wave */}
                <path d="M-50 100 Q 450 150, 750 500" stroke="#ff9800" strokeWidth="2" strokeDasharray="10 10" opacity="0.4" fill="none" />
            </svg>

            {/* --- BOTTOM RIGHT WAVE (Restored) --- */}
            {/* This is the code that was missing in your previous attempt */}
            <svg style={{ position: 'absolute', bottom: 0, right: 0, width: '500px', height: '300px', zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 500 300" fill="none">
                 <path d="M490 10 C 350 250, 150 50, 10 290" stroke="#ff9800" strokeWidth="2" strokeDasharray="15 15" fill="none"/>
            </svg>

            <div className={styles.simpleFooter}>
                <p>&copy; 2026 WanderCall. All rights reserved.</p>
                <p style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                    Made with <span style={{ color: '#ff9800', fontSize: '1.2rem' }}>♥</span> by <span style={{ color: '#fff', fontWeight: 'bold' }}>Manish Baviskar</span>
                </p>
            </div>

        </div>
    );
}

export default withAuth(HomeComponent);