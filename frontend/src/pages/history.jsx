import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import HistoryIcon from '@mui/icons-material/History';

// Import styles if you still use them for individual cards
import styles from '../styles/history.module.css'; 

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await getHistoryOfUser();
                const data = historyData.activity || (Array.isArray(historyData) ? historyData : []);
                setMeetings(data);
            } catch (e) {
                console.log("Error fetching history:", e);
            }
        }
        fetchHistory();
    }, [getHistoryOfUser]);

    // Helpers...
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
    const formatTime = (dateString) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour12: false });
    }
    const calculateDuration = (start, end) => {
        if (!start || !end) return "Ongoing / Unknown";
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffMs = endTime - startTime; 
        if (diffMs < 0) return "Error";
        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        return `${minutes} min ${seconds} sec`;
    }

    return (
        // 1. OUTER CONTAINER: The Vivid Background *BEHIND* the glass
        <div style={{ 
            minHeight: '100vh', 
            // A dark gradient background to give depth
            background: 'radial-gradient(circle at top left, #1a1a1a, #000000)', 
            position: 'relative',
            overflow: 'hidden', // Stop scrollbars from the absolute glass layer
            fontFamily: 'Poppins, sans-serif',
        }}>
            
            {/* --- BACKGROUND PATTERNS (Sitting behind the glass) --- */}
            {/* Increased opacity slightly so they show through the blur */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} viewBox="0 0 1440 900" preserveAspectRatio="xMinYMin slice">
                 <path d="M-50 100 Q 450 150, 750 500" stroke="#ff9800" strokeWidth="3" strokeDasharray="15 15" opacity="0.3" fill="none"/>
                 <path d="M-50 250 Q 300 300, 600 650" stroke="#ff9800" strokeWidth="3" strokeDasharray="15 15" opacity="0.5" fill="none"/>
                 <path d="M1000 600 Q 1200 400, 1500 500" stroke="#ff9800" strokeWidth="3" strokeDasharray="15 15" opacity="0.3" fill="none"/>
            </svg>

            {/* 2. THE GLASS OBERLAY: Covers the entire screen */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                // The Glass Effect:
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark tint
                backdropFilter: 'blur(30px) saturate(150%)', // Strong blur + saturation boost
                WebkitBackdropFilter: 'blur(30px) saturate(150%)', // For Safari
                border: '1px solid rgba(255, 255, 255, 0.05)', // Subtle noise border
                zIndex: 1,
                overflowY: 'auto', // Allow scrolling INSIDE the glass container
                color: 'white'
            }}>

                {/* --- HEADER (Transparent background to let glass show) --- */}
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2, 
                    p: 3, 
                    borderBottom: '1px solid rgba(255, 152, 0, 0.3)',
                    background: 'transparent', 
                    position: 'relative',
                    zIndex: 10
                }}>
                    <IconButton onClick={() => navigate("/home")} sx={{ color: '#ff9800' }}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        Meeting History
                    </Typography>
                </Box>

                {/* --- MAIN LIST CONTENT --- */}
                <Box sx={{ 
                    p: { xs: 2, md: 5 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3, 
                    maxWidth: '1000px', 
                    margin: '0 auto',
                    position: 'relative', 
                    zIndex: 10,
                    pb: 10
                }}>
                    {meetings.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, opacity: 0.6 }}>
                            <HistoryIcon sx={{ fontSize: 80, color: '#ff9800', mb: 3, filter: 'drop-shadow(0 0 10px rgba(255,152,0,0.5))' }} />
                            <Typography variant="h5" style={{ color: '#ccc' }}>No meeting history found.</Typography>
                        </Box>
                    ) : (
                        meetings.map((e, i) => (
                            // The individual cards are now "glass on glass"
                            <Paper 
                                key={i} 
                                elevation={5} 
                                sx={{ 
                                    borderRadius: 4, 
                                    overflow: 'hidden', 
                                    // Lighter glass tint for the cards to make them pop against the background glass
                                    bgcolor: 'rgba(255, 255, 255, 0.03)', 
                                    backdropFilter: 'blur(10px)', // Additional subtle blur for card
                                    border: '1px solid rgba(255, 152, 0, 0.2)',
                                    transition: '0.3s',
                                    '&:hover': { 
                                        transform: 'translateY(-5px)', 
                                        border: '1px solid rgba(255, 152, 0, 0.6)',
                                        boxShadow: '0 10px 30px -10px rgba(255,152,0,0.3)'
                                    }
                                }}
                            >
                                <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
                                    
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ff9800' }} />}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', letterSpacing: '1px' }}>
                                                    {e.meetingCode}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#ccc' }}>
                                                    {formatDate(e.date)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mr: 2, px: 2, py: 0.5, border: '1px solid #ff9800', color: '#ff9800', borderRadius: 4, fontWeight: 'bold', fontSize: '0.9rem', bgcolor: 'rgba(255,152,0,0.1)' }}>
                                                {e.attendees.length} Participants
                                            </Box>
                                        </Box>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,152,0,0.2)', p: 3 }}>
                                        <Grid container spacing={2}>
                                            {e.attendees.map((attendee, idx) => (
                                                <Grid item xs={12} md={6} key={idx}>
                                                    <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                                        <Avatar sx={{ bgcolor: '#ff9800', color: 'black', fontWeight: 'bold' }}>
                                                            {attendee.user?.name?.charAt(0) || "?"}
                                                        </Avatar>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Typography variant="body1" fontWeight="bold" color="white">
                                                                {attendee.user?.name || "Unknown"}
                                                            </Typography>
                                                            
                                                            {/* Stats */}
                                                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                                    Joined: {formatTime(attendee.joinTime)}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                                    Left: {attendee.leaveTime ? formatTime(attendee.leaveTime) : "Active"}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                                                                    Duration: {calculateDuration(attendee.joinTime, attendee.leaveTime)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        ))
                    )}
                </Box>
            </div>
        </div>
    )
}