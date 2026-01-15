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

    // Helper: Format Date (e.g., 18/11/2025)
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }

    // Helper: Format Time (e.g., 15:48:35)
    const formatTime = (dateString) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour12: false });
    }

    // Helper: Calculate Duration (e.g., "5 min 18 sec")
    const calculateDuration = (start, end) => {
        if (!start || !end) return "Ongoing / Unknown";
        
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diffMs = endTime - startTime; // Difference in milliseconds

        if (diffMs < 0) return "Error";

        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        return `${minutes} min ${seconds} sec`;
    }

    return (
        <div className={`${styles.goldenGlass}`} style={{ minHeight: '100vh', backgroundColor: '#0a0a23', paddingBottom: '50px' }}>
            
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3, borderBottom: '1px solid #333', bgcolor: '#1a1a2e' }}>
                <IconButton onClick={() => navigate("/home")} sx={{ color: 'white' }}>
                     <ArrowBackIcon fontSize="large" />
                </IconButton>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    Meeting History
                </Typography>
            </Box>

            {/* List */}
            <Box sx={{ p: { xs: 2, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {meetings.length === 0 ? (
                    <Typography style={{ color: 'gray', textAlign: 'center' }}>No history found.</Typography>
                ) : (
                    meetings.map((e, i) => (
                        <Paper key={i} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#16213e' }}>
                            <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
                                
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                                {e.meetingCode}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'gray' }}>
                                                {formatDate(e.date)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mr: 2, px: 2, py: 0.5, bgcolor: '#ff9800', color: 'black', borderRadius: 4, fontWeight: 'bold' }}>
                                            {e.attendees.length} Participants
                                        </Box>
                                    </Box>
                                </AccordionSummary>

                                <AccordionDetails sx={{ bgcolor: '#0f172a', borderTop: '1px solid #333', p: 3 }}>
                                    <Grid container spacing={2}>
                                        {e.attendees.map((attendee, idx) => (
                                            <Grid item xs={12} md={6} key={idx}>
                                                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#4dabf5' }}>
                                                        {attendee.user?.name?.charAt(0) || "?"}
                                                    </Avatar>
                                                    <Box sx={{ width: '100%' }}>
                                                        <Typography variant="body1" fontWeight="bold" color="white">
                                                            {attendee.user?.name || "Unknown"}
                                                        </Typography>
                                                        
                                                        {/* --- DURATION STATS --- */}
                                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                                Joined at: {formatTime(attendee.joinTime)}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                                Left at: {attendee.leaveTime ? formatTime(attendee.leaveTime) : "Active"}
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
    )
}