import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/homeComponent.module.css';

import { IconButton, Avatar, Menu, MenuItem, Tooltip, Divider, Button, TextField } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AddBoxIcon from '@mui/icons-material/AddBox';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    const [username, setUsername] = useState("User");

    useEffect(() => {
        let storedName = localStorage.getItem("username") || localStorage.getItem("userId");
        
        if (!storedName || storedName === "undefined" || storedName === "null") {
            storedName = "User";
        }
        
        setUsername(storedName);
    }, []);

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
            
            
            <nav className={styles.homeNav}>
                <div className={styles.navHeader}>
                    <h2>WanderCall</h2>
                </div>

                <div className={styles.homeNavlist}>
                    
                    <div className={styles.accountPill} onClick={handleMenuClick}>
                        <span className={styles.userName}>{username}</span>
                        <Tooltip title="Account Settings">
                            <IconButton size="small" sx={{ padding: 0 }}>
                                
                                <Avatar sx={{ width: 40, height: 40, bgcolor: 'black', color: '#ff9800', fontWeight: 'bold' }}>
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
                                bgcolor: '#1a1a1a', 
                                color: 'white',
                                border: '1px solid #333',
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

            
            <div className={styles.mainContentContainer}>
                <div className={styles.card}>
                    
                    
                    <div className={styles.cardActions}>
                        <h1>Hello, <span className={styles.accentText}>{username}!</span></h1>
                        <p>Seamless video calling with WanderCall.</p>

                        <div className={styles.joinSection}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Meeting Code"
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                className={styles.inputField}
                                InputProps={{
                                    style: { color: 'white' } 
                                }}
                            />
                            <Button 
                                variant="contained" 
                                className={styles.joinBtn}
                                onClick={handleJoinVideoCall}
                            >
                                Join
                            </Button>
                        </div>

                        <Button
                            variant="contained"
                            fullWidth
                            className={styles.createBtn}
                            onClick={handleCreateNewMeeting}
                            startIcon={<AddBoxIcon />}
                        >
                            Create New Meeting
                        </Button>
                    </div>

                    <div className={styles.cardImageSection}>
                         <img src="/logo.png" alt="WanderCall Logo" style={{ width: '150px', opacity: 0.8 }} />
                    </div>
                </div>
            </div>

            <div className={styles.simpleFooter}>
                <p>&copy; {new Date().getFullYear()} WanderCall. All rights reserved.</p>
            </div>

        </div>
    );
}

export default withAuth(HomeComponent);